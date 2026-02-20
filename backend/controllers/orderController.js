const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 🧾 Place Order
exports.placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items: requestItems } = req.body;

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  let orderItems = [];

  if (Array.isArray(requestItems) && requestItems.length > 0) {
    const productIds = requestItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map(product => [product._id.toString(), product]));

    for (const item of requestItems) {
      const product = productMap.get(item.product);
      const quantity = Number(item.quantity || 0);

      if (!product) {
        return res.status(400).json({ message: "One or more products are invalid" });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      orderItems.push({
        product,
        quantity
      });
    }
  } else {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    orderItems = cart.items;

    cart.items = [];
    await cart.save();
  }

  // Calculate total
  const totalPrice = orderItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    totalPrice,
    shippingAddress,
    paymentMethod
  });

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
