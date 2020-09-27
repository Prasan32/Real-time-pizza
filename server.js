require('dotenv').config();

const express=require('express');
const app=express();
const PORT=process.env.PORT || 3000;
const ejs=require('ejs');
const layout = require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo')(session);
const passport=require('passport');
const Emitter=require('events')

//database connection
const url="mongodb+srv://admin:admin123@cluster0.lmybk.mongodb.net/pizza";
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("Database connected...")
}).catch(err=>{
    console.log('Connection failed...')
})


//session store
let mongoStore = new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions',
})

// event emitter
const eventEmitter=new Emitter();
app.set('eventEmitter',eventEmitter)

//session
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{ maxAge:1000 * 60 * 60 *24 } //24 hours
}))

app.use(flash());

//passport config
const passportInit=require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())


app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;
    next()
})

//assets
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//set templating engine
app.use(layout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


require('./routes/web')(app);


const server=app.listen(PORT,(error,result)=>{
    console.log(`server is listening at ${PORT}`)
})


//socket

const io=require('socket.io')(server)

io.on('connection',(socket)=>{
    //join 
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})


eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to(`adminRoom`).emit('orderPlaced',data)
})