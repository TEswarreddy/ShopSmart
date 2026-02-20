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
    },
    dispute: {
      status: {
        type: String,
        enum: ["none", "raised", "resolved", "closed"],
        default: "none"
      },
      reason: String,
      description: String,
      raisedAt: Date,
      resolvedAt: Date,
      resolution: String
    },
    refund: {
      status: {
        type: String,
        enum: ["none", "requested", "approved", "processed", "rejected"],
        default: "none"
      },
      amount: Number,
      reason: String,
      requestedAt: Date,
      processedAt: Date,
      transactionId: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
