const Order = require("../models/Order");
const Cart = require("../models/Cart");

// 🧾 Place Order
exports.placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Calculate total
  const totalPrice = cart.items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    totalPrice,
    shippingAddress,
    paymentMethod
  });

  // Clear Cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// 📄 Get User Orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product");

  res.json(orders);
};

// 📄 Admin - Get All Orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product");

  res.json(orders);
};

// ✏ Admin - Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
