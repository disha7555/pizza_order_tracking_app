const order=require('../../../models/order');
function orderController(){
    return {
        // index(req,res){
        // order.find({status:{ne:'completed'}},null, {sort:{'createdAt':-1}}).populate('customerId','-password')
        // .exec((err,orders)=>{
        //     if(req.xhr){
        //         res.json(orders)
        //     }
        //     else{
        //         return res.render('admin/orders')
        //     }
        // });
        // }

        async index(req, res) {
            try {
                const orders = await order.find({ status: { $ne: 'completed' } })
                    .sort({ 'createdAt': -1 })
                    .populate('customerId', '-password')
                    .exec();

                if (req.xhr) {
                    res.json(orders);
                } else {
                    return res.render('admin/orders', { orders });
                }
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
        }
        //exec executes this given query whole and also has a callbaCK to execue next statements or to redirect
        //column name with  minus sign ex -password, is to avoid the password in the query result
        //populate will replace customerId with data of user that is having same id and that will hasppen here for all the documents(entries)

    }
}
module.exports=orderController;