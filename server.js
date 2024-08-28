const express = require("express");
const app=express();
const ejs=require("ejs");
const expressLayout=require('express-ejs-layouts');
const PORT=process.env.PORT||3300;
const path=require('path');

app.get('/',(req,res)=>{
    res.render('home');
});
//set assets
app.use(express.static('public'));

//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
//app.set('views',path.join(__dirname,'/resources/scss'));
app.set('view engine','ejs');


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});