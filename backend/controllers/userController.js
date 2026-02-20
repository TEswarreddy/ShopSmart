const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VALID_ROLES = ["user", "shop", "admin"];

const isEmailValid = (email = "") => /\S+@\S+\.\S+/.test(email);
const isPhoneValid = (phone = "") => /^[0-9+\-\s]{10,15}$/.test(phone);
const isPasswordValid = (password = "") => typeof password === "string" && password.length >= 6;

const buildAuthResponse = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  shopApprovalStatus: user.shopApprovalStatus,
  shopDetails: user.shopDetails,
  token: generateToken(user._id),
});

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register
exports.registerUser = async (req, res) => {
  const {
    name,
    fullName,
    email,
    password,
    role,
    phone,
    city,
    state,
    country,
    gender,
    dateOfBirth,
    shopName,
    ownerName,
    businessType,
    gstNumber,
    addressLine1,
    addressLine2,
    postalCode,
    website,
  } = req.body;

  const normalizedRole = role || "user";
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").trim();
  if (!VALID_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  if (normalizedRole === "admin") {
    return res.status(403).json({ message: "Admin registration is not allowed from this form" });
  }

  if (!isEmailValid(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (!isPhoneValid(normalizedPhone)) {
    return res.status(400).json({ message: "Please enter a valid phone number" });
  }

  const resolvedName = normalizedRole === "shop" ? shopName : (fullName || name);
  if (!resolvedName || String(resolvedName).trim().length < 2) {
    return res.status(400).json({ message: "Please enter a valid name" });
  }

  if (normalizedRole === "user") {
    if (!city || !state || !country) {
      return res.status(400).json({ message: "Please complete your location details" });
    }
  }

  if (normalizedRole === "shop") {
    if (!ownerName || !businessType || !addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "Please complete all mandatory shop details" });
    }
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const parsedDob = dateOfBirth ? new Date(dateOfBirth) : null;
  if (dateOfBirth && Number.isNaN(parsedDob?.getTime?.())) {
    return res.status(400).json({ message: "Invalid date of birth" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userPayload = {
    name: String(resolvedName).trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: hashedPassword,
    role: normalizedRole,
  };

  if (normalizedRole === "user") {
    userPayload.profile = {
      gender: gender || undefined,
      dateOfBirth: parsedDob || undefined,
    };
  }

  if (normalizedRole === "shop") {
    userPayload.shopDetails = {
      shopName: shopName,
      ownerName: ownerName,
      businessType: businessType,
      gstNumber: gstNumber || undefined,
      addressLine1: addressLine1,
      addressLine2: addressLine2 || undefined,
      city: city,
      state: state,
      postalCode: postalCode,
      country: country,
      website: website || undefined,
    };
  }

  const user = await User.create(userPayload);

  res.json(buildAuthResponse(user));
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.role === "user" && user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked by admin" });
    }

    if (role && role !== user.role) {
      return res.status(403).json({ message: "Role does not match this account" });
    }

    if (user.role === "shop" && user.shopApprovalStatus !== "approved") {
      if (user.shopApprovalStatus === "suspended") {
        return res.status(403).json({ message: "Your shop account is suspended by admin" });
      }
      if (user.shopApprovalStatus === "rejected") {
        return res.status(403).json({ message: "Your shop account was rejected by admin" });
      }
      return res.status(403).json({ message: "Your shop account is pending admin approval" });
    }

    res.json(buildAuthResponse(user));
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

exports.getUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    shopApprovalStatus: req.user.shopApprovalStatus,
    profile: req.user.profile,
    shopDetails: req.user.shopDetails,
  });
};

exports.updateUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, phone, gender, dateOfBirth, shopDetails } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) {
    if (!String(name).trim() || String(name).trim().length < 2) {
      return res.status(400).json({ message: "Please enter a valid name" });
    }
    user.name = String(name).trim();
  }

  if (phone !== undefined) {
    const normalizedPhone = String(phone || "").trim();
    if (normalizedPhone && !isPhoneValid(normalizedPhone)) {
      return res.status(400).json({ message: "Please enter a valid phone number" });
    }
    user.phone = normalizedPhone;
  }

  if (user.role === "user") {
    user.profile = {
      ...(user.profile || {}),
      ...(gender !== undefined ? { gender } : {}),
      ...(dateOfBirth !== undefined
        ? {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          }
        : {}),
    };

    if (dateOfBirth !== undefined && dateOfBirth) {
      const parsedDob = new Date(dateOfBirth);
      if (Number.isNaN(parsedDob.getTime())) {
        return res.status(400).json({ message: "Invalid date of birth" });
      }
      user.profile.dateOfBirth = parsedDob;
    }
  }

  if (user.role === "shop" && shopDetails) {
    user.shopDetails = {
      ...(user.shopDetails || {}),
      ...shopDetails,
    };
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    shopApprovalStatus: updatedUser.shopApprovalStatus,
    profile: updatedUser.profile,
    shopDetails: updatedUser.shopDetails,
  });
};

exports.updateUserPassword = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};

exports.getPendingShops = async (req, res) => {
  const shops = await User.find({ role: "shop", shopApprovalStatus: "pending" })
    .select("name email phone shopDetails shopApprovalStatus createdAt")
    .sort({ createdAt: -1 });

  res.json(shops);
};

exports.updateShopApprovalStatus = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected", "suspended", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid shop status" });
  }

  const shop = await User.findById(req.params.id);

  if (!shop || shop.role !== "shop") {
    return res.status(404).json({ message: "Shop account not found" });
  }

  shop.shopApprovalStatus = status;
  await shop.save();

  res.json({
    _id: shop._id,
    name: shop.name,
    email: shop.email,
    phone: shop.phone,
    shopApprovalStatus: shop.shopApprovalStatus,
    shopDetails: shop.shopDetails,
  });
};

exports.getAllShopsWithSales = async (req, res) => {
  const shops = await User.find({ role: "shop" })
    .select("name email phone shopDetails shopApprovalStatus createdAt")
    .sort({ createdAt: -1 });

  const shopIds = shops.map((shop) => shop._id.toString());

  const products = await Product.find({ shop: { $in: shopIds } }).select("_id shop");
  const productCountByShop = new Map();
  const productToShop = new Map();

  for (const product of products) {
    const shopId = product.shop?.toString();
    if (!shopId) continue;
    productToShop.set(product._id.toString(), shopId);
    productCountByShop.set(shopId, (productCountByShop.get(shopId) || 0) + 1);
  }

  const orders = await Order.find({ "items.product": { $in: products.map((p) => p._id) } })
    .populate("items.product", "_id shop price");

  const salesByShop = new Map();
  const orderCountByShop = new Map();

  for (const order of orders) {
    const shopSeenInOrder = new Set();

    for (const item of order.items || []) {
      const product = item.product;
      const productId = product?._id?.toString?.();
      const shopId = productId ? productToShop.get(productId) : undefined;
      if (!shopId) continue;

      const lineTotal = Number(product.price || 0) * Number(item.quantity || 0);
      salesByShop.set(shopId, (salesByShop.get(shopId) || 0) + lineTotal);
      shopSeenInOrder.add(shopId);
    }

    for (const shopId of shopSeenInOrder) {
      orderCountByShop.set(shopId, (orderCountByShop.get(shopId) || 0) + 1);
    }
  }

  const result = shops.map((shop) => {
    const shopId = shop._id.toString();
    return {
      _id: shop._id,
      name: shop.name,
      email: shop.email,
      phone: shop.phone,
      shopApprovalStatus: shop.shopApprovalStatus,
      shopDetails: shop.shopDetails,
      createdAt: shop.createdAt,
      totalProducts: productCountByShop.get(shopId) || 0,
      totalSales: salesByShop.get(shopId) || 0,
      totalOrders: orderCountByShop.get(shopId) || 0,
    };
  });

  res.json(result);
};

exports.deleteShop = async (req, res) => {
  const shop = await User.findById(req.params.id);

  if (!shop || shop.role !== "shop") {
    return res.status(404).json({ message: "Shop account not found" });
  }

  await shop.deleteOne();
  res.json({ message: "Shop deleted" });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("name email phone isBlocked createdAt")
    .sort({ createdAt: -1 });

  res.json(users);
};

exports.updateUserBlockStatus = async (req, res) => {
  const { isBlocked } = req.body;

  if (typeof isBlocked !== "boolean") {
    return res.status(400).json({ message: "isBlocked must be boolean" });
  }

  const user = await User.findById(req.params.id);

  if (!user || user.role !== "user") {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = isBlocked;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== "user") {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
};
