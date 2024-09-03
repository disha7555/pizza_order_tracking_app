require('dotenv').config();

const express = require("express");
const app=express();
const ejs=require("ejs");
const expressLayout=require('express-ejs-layouts');
const PORT=process.env.PORT||3301;
const path=require('path');
const mongoose=require("mongoose");
const session=require('express-session');
const flash=require("express-flash");
const MongoStore=require('connect-mongo');
// MongoStore(session);
const { error } = require("console");

//database connection
const url="mongodb+srv://disha:DKMongo%407555@cluster0.ssh4wdp.mongodb.net/pizza?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(url)
.then(()=>console.log("connected to database"))
.catch((error)=>console.error("databse connection failed",error));


// let mongostore=new MongoStore({})

//session config & session store
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:url,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60, 
        autoRemove: 'native'   
    }),
    //store: new MongoStore({ url: 'mongodb://localhost/session-db' })
    cookie: { maxAge: 1000 * 60 * 60 * 24}
}));

app.use(flash());

//set assets
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    next();
})

//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
//app.set('views',path.join(__dirname,'/resources/scss'));
app.set('view engine','ejs');



require('./routes/web')(app); //as it imports a function


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});
