const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Create Razorpay Order
exports.createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  const options = {
    amount: order.totalPrice * 100, // in paise
    currency: "INR",
    receipt: order._id.toString(),
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    const order = await Order.findById(orderId);
    order.paymentStatus = "Completed";
    order.orderStatus = "Paid";
    await order.save();

    res.json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }
};
