const mongoose = require("mongoose");

const OrderSchema=new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:{
        type:Object,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        default:'COD'
    },
    status:{
         type:String,
        default:'Order_placed'
    }
},
{timestamps:true}
);

const Order=new mongoose.model("Order",OrderSchema);

module.exports=Order;