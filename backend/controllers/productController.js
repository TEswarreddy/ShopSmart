const Product = require("../models/Product");
const mongoose = require("mongoose");

// ➕ Add Product (Admin)
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📄 Get All Products
exports.getProducts = async (req, res) => {
  const { search = "", category = "" } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
};

// 🔍 Get Single Product
exports.getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// ✏ Update Product (Admin)
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// ❌ Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// ⭐ Add Product Review (Logged-in User)
exports.addProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  const parsedRating = Number(rating);
  if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: "You already reviewed this product" });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: parsedRating,
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
};

exports.getMyShopProducts = async (req, res) => {
  const products = await Product.find({ shop: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
};

exports.addShopProduct = async (req, res) => {
  const { title, description, price, image, category, stock } = req.body;

  if (!title || !description || price === undefined) {
    return res.status(400).json({ message: "Title, description, and price are required" });
  }

  const product = await Product.create({
    title,
    description,
    price,
    image,
    category,
    stock,
    shop: req.user._id,
  });

  res.status(201).json(product);
};

exports.updateShopProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, shop: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  Object.assign(product, req.body);
  product.shop = req.user._id;

  const updated = await product.save();
  res.json(updated);
};

exports.deleteShopProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, shop: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
};

exports.uploadShopProductImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({ imageUrl });
};
