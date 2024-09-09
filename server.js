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
const passport=require("passport");
const EventEmitter = require('events');

// MongoStore(session);
const { error } = require("console");

//database connection
const url="mongodb+srv://disha:DKMongo%407555@cluster0.ssh4wdp.mongodb.net/pizza?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(url)
.then(()=>console.log("connected to database"))
.catch((error)=>console.error("databse connection failed",error));


// let mongostore=new MongoStore({})



//emitter
const eventEmitter = new EventEmitter();
app.set('eventEmitter',eventEmitter)

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

//passport config
const passportInit=require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());


const flashMiddleware = (req, res, next) => {
    res.locals.flash = req.flash();
    next();
};
// Apply middleware globally
app.use(flashMiddleware);

//set assets
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    //res.locals.success_msg = req.flash('success');
    //res.locals.error_msg = req.flash('error');
    res.locals.user=req.user;
    next();
})

//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
//app.set('views',path.join(__dirname,'/resources/scss'));
app.set('view engine','ejs');



require('./routes/web')(app); //as it imports a function


const server=app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});

//socket.io (server side)
const io = require("socket.io")(server);
io.on('connection',(socket)=>{
        //we have to create different room for each order 
        //room's name would be its order id

        console.log(socket.id)
        socket.on('join',(orderId)=>{
            //orderId is our room no
            console.log(orderId);
            socket.join(orderId)
        });
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})