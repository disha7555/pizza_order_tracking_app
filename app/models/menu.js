const mongoose = require("mongoose");

const MenuSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    }
});

const Menu=new mongoose.model("Menu",MenuSchema);

module.exports=Menu;