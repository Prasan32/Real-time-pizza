const express=require('express');
const app=express();
const PORT=process.env.PORT || 3000;
const ejs=require('ejs');
const layout = require('express-ejs-layouts')
const path=require('path')

//assets
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.render('home')
})

//set templating engine
app.use(layout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')



app.listen(PORT,(error,result)=>{
    console.log(`server is listening at ${PORT}`)
})