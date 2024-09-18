const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
function orderController() {
  return {
    async store(req, res) {
      console.log("private key", process.env.STRIPE_PRIVATE_KEY);
      // validate req
      const { phone, address, stripeToken, paymentType } = req.body;
      console.log(req.body);
      console.log("Reached after req.body");
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are required" });
        // req.flash("error", "All fields are required");
        //return res.redirect("/cart");
      }
      //   const order = new Order({
      //     customerId: req.user._id,
      //     items: req.session.cart.items,
      //     phone,
      //     address,
      //   });
      //   order
      //     .save()
      //     .then((result) => {
      //       Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
      //         req.flash("success", "Order placed successfully");
      //         delete req.session.cart;
      //         //emit event

      //         //to get eventEmitter instance which was defined on server.js
      //         const eventEmitter = req.app.get("eventEmitter");
      //         eventEmitter.emit("orderPlaced", placedOrder);

      //         return res.redirect("/customer/orders");
      //       });
      //     })
      try {
        const order = new Order({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone,
          address,
        });
        console.log("Reached after getting data for insert");
        const result = await order.save();
        console.log("result: ",result);
        const placedOrder = await Order.populate(result, {
          path: "customerId",
        });
        console.log("placedOrder: ",placedOrder)
        if(paymentType==='cod'){
          placedOrder
          .save()
          .then((ord) => {
           // console.log(r);
            // Emit event
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", ord);
            delete req.session.cart;
            return res.json({
              message: "Order placed successfully, Pay at delivery",
            });
          })
        }
        console.log("population done");
        // req.flash("success", "Order placed successfully");
        // toastr.success("Order placed!")
        console.log("order placed before payment");
        //stripe payment
        if (paymentType === "card") {
          console.log(req.session.cart.totalPrice);
          console.log(req.body.stripeToken);
          console.log(process.env.STRIPE_PRIVATE_KEY);
          placedOrder.paymentType='card';
          stripe.charges
            .create({
              amount: req.session.cart.totalPrice * 100,
              source: stripeToken,
              currency: "inr",
              description: `Pizza order:${placedOrder._id}`,
            })
            .then(() => {
              placedOrder.paymentStatus = true;
              placedOrder
                .save()
                .then((ord) => {
                 // console.log(r);
                  // Emit event
                  const eventEmitter = req.app.get("eventEmitter");
                  eventEmitter.emit("orderPlaced", ord);
                  delete req.session.cart;
                  return res.json({
                    message: "Payment successful, Order placed successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((errors) => {
              delete req.session.cart;
              console.log(errors);
              return res.json({
                message:
                  "Order placed but Payment failed, You can pay at delivery time",
              });
            });
        }
        

        //return res.redirect("/customer/orders");
      } catch (err) {
        return res
          .status(500)
          .json({
            message:
              "Order placed but Payment failed, You can pay at delivery time",
          });

        // req.flash("error", "Something went wrong");
        // return res.redirect("/cart");
      }
      // .catch((err) => {
      //   req.flash("error", "something went wrong");
      //   return res.redirect("/cart");
      // });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Catche-Control",
        "no-catche,private,no-store,must-revalidate,max-stale=0,post-check=9,pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
      //console.log(orders);
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      //Authorized user
      if (req.user._id.toString() === order.customerId.toString()) {
        res.render("customers/singleOrder", { order: order });
      } else {
        res.redirect("/");
      }
    },
  };
}
module.exports = orderController;
