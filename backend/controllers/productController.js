const Product = require("../models/Product");

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
  const products = await Product.find();
  res.json(products);
};

// 🔍 Get Single Product
exports.getProductById = async (req, res) => {
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
