const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    async store(req, res) {
      // validate req
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
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

        const result = await order.save();

        const placedOrder = await Order.populate(result, { path: "customerId" });

        req.flash("success", "Order placed successfully");
        delete req.session.cart;

        // Emit event
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderPlaced", placedOrder);

        return res.redirect("/customer/orders");
      } catch (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/cart");
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
