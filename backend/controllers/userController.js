const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VALID_ROLES = ["user", "shop", "admin"];

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const normalizedRole = role || "user";
  if (!VALID_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: normalizedRole,
  });

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
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

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
