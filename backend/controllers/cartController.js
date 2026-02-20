const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ➕ Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity ?? 1);

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty });
  }

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json(populatedCart);
};

// 📄 Get User Cart
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");

  if (!cart) {
    return res.json({ user: req.user._id, items: [] });
  }

  res.json(cart);
};

// ✏ Update Quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  if (!Number.isInteger(qty)) {
    return res.status(400).json({ message: "Quantity must be a valid number" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  if (qty <= 0) {
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    const populatedCartAfterRemoval = await Cart.findById(cart._id).populate("items.product");
    return res.json(populatedCartAfterRemoval);
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = qty;
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json(populatedCart);
};

// ❌ Remove Item
exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json(populatedCart);
};
