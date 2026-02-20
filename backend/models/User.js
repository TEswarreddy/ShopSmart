const mongoose = require("mongoose");

const shopDetailsSchema = mongoose.Schema(
  {
    shopName: { type: String },
    ownerName: { type: String },
    businessType: { type: String },
    gstNumber: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    website: { type: String }
  },
  { _id: false }
);

const profileSchema = mongoose.Schema(
  {
    gender: { type: String },
    dateOfBirth: { type: Date }
  },
  { _id: false }
);

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  profile: profileSchema,
  shopDetails: shopDetailsSchema,
  role: {
    type: String,
    enum: ["user", "shop", "admin"],
    default: "user"
  },
  shopApprovalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "suspended"],
    default: function () {
      return this.role === "shop" ? "pending" : "approved";
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
