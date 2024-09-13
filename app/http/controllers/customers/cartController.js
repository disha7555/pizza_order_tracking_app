function cartController(){
    return{
        index(req,res){
            res.render('customers/cart');
        },
        update(req,res){
            // let cart={
            //     items:{
            //         pizzaId:{item:pizzaObject,qty:0},

            //     },
            //     totalqty:0,
            //     totalprice:0
                
            // }

            //in below "cart" is akey which will  be added to session 
            //if "cart" is not available then we create an empty cart as below  
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }}
                let cart=req.session.cart;
                //console.log(req.body);
              //  check if item does not exists in cart
                if(!cart.items[req.body._id]){
                    cart.items[req.body._id]={
                        item:req.body,
                        qty:1
                    }
                    cart.totalQty=cart.totalQty+1;
                    cart.totalPrice=cart.totalPrice + req.body.price
                }
                else{
                    cart.items[req.body._id].qty=cart.items[req.body._id].qty+1;
                    cart.totalQty=cart.totalQty+1;
                    cart.totalPrice=cart.totalPrice + req.body.price
                }
            
            // console.log(req.body);
            return res.json({totalQty:req.session.cart.totalQty});
        },
        qtyinc(req,res){
            let cart=req.session.cart;
            if (!cart.items[req.body._id]) {
                return res.status(400).send('Item not found in cart');
            }
            cart.items[req.body._id].qty=cart.items[req.body._id].qty+1;
            cart.totalQty=cart.totalQty+1;
            cart.totalPrice=cart.totalPrice + cart.items[req.body._id].item.price;
            return res.redirect('/cart');


        },
        // qtydec(req,res){
        //     let cart=req.session.cart;
        //     if (!cart.items[req.body._id]) {
        //         return res.status(400).send('Item not found in cart');
        //     }
        //     cart.items[req.body._id].qty=cart.items[req.body._id].qty-1;
        //     cart.totalQty=cart.totalQty-1;
        //     cart.totalPrice=cart.totalPrice - cart.items[req.body._id].item.price;
        //     if (cart.totalQty === 0) {
        //         req.session.cart = null;
                
        //     }
        //     else{
        
        //     return res.redirect('/cart');
        // }
        // },
        qtydec(req, res) {
            let cart = req.session.cart;
            if (!cart.items[req.body._id]) {
                return res.status(400).send('Item not found in cart');
            }
        
            let item = cart.items[req.body._id];
            
            if (item.qty > 1) {
                // Decrease quantity and update total values
                item.qty -= 1;
                cart.totalQty -= 1;
                cart.totalPrice -= item.item.price;
            } else {
                // Remove item if quantity is 1
                delete cart.items[req.body._id];
                cart.totalQty -= 1;
                cart.totalPrice -= item.item.price;
        
                if (cart.totalQty === 0) {
                    req.session.cart = null;
                }
            }
        
            return res.redirect('/cart');
        },
        
        remove(req,res){
            let cart=req.session.cart;
            if (!cart.items[req.body._id]) {
                return res.status(400).send('Item not found in cart');
            }
            let selecteditem=cart.items[req.body._id];
            delete cart.items[req.body._id];
            cart.totalQty= cart.totalQty-selecteditem.qty;
            cart.totalPrice=cart.totalPrice - (selecteditem.qty*selecteditem.item.price);
            if (cart.totalQty === 0) {
                req.session.cart = null;
                
            }
            
        
            return res.redirect('/cart');
        
        }
    };
}

module.exports=cartController;