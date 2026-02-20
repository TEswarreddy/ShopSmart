const User = require("../models/User");
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
    if (role && role !== user.role) {
      return res.status(403).json({ message: "Role does not match this account" });
    }

    res.json(buildAuthResponse(user));
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
