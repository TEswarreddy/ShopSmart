const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true
    },
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String
    },
    paymentMethod: {
      type: String,
      default: "COD"
    },
    paymentStatus: {
      type: String,
      default: "Pending"
    },
    orderStatus: {
      type: String,
      default: "Processing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
