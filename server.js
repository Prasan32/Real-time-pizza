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

//session
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{ maxAge:1000 * 60 * 60 *24 } //24 hours
}))

app.use(flash())

app.use((req,res,next)=>{
    res.locals.session=req.session;
    next()
})

//assets
app.use(express.static('public'));
app.use(express.json())

//set templating engine
app.use(layout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


require('./routes/web')(app);


app.listen(PORT,(error,result)=>{
    console.log(`server is listening at ${PORT}`)
})