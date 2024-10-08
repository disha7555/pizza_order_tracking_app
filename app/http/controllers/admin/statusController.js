
// const Order=require('../../../models/order')
// function statusController() {
//   return {
//             update(req,res){
//                 Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
//                     if(err){
//                         //req.flash
//                         res.redirect('admin/orders');
//                     }
//                     res.redirect('admin/orders');

//                 });
//             }
//   }
// }

// module.exports= statusController

const { EventEmitter } = require('connect-mongo');
const Order = require('../../../models/order');

function statusController() {
  return {
    async update(req, res) {
      try {
        await Order.updateOne({ _id: req.body.orderId }, { status: req.body.status });
        if(req.body.status=="completed")
          {
            await Order.updateOne({_id:req.body.orderId},{paymentStatus:true})
          }
        //emit event

        //to get eventEmitter instance which was defined on server.js
        const eventEmitter= req.app.get('eventEmitter');
        eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
        
        res.redirect('/admin/orders');  // Make sure the URL starts with '/'
      } catch (err) {
        console.error(err);
        // You can use req.flash to send an error message if needed
        res.redirect('/admin/orders');
      }
    }
  }
}

module.exports = statusController;
