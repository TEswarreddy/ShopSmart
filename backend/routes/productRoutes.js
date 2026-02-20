const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getMyShopProducts,
  addShopProduct,
  updateShopProduct,
  deleteShopProduct
} = require("../controllers/productController");
const { protect, admin, shopApproved } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/shop/my", protect, shopApproved, getMyShopProducts);
router.post("/shop", protect, shopApproved, addShopProduct);
router.put("/shop/:id", protect, shopApproved, updateShopProduct);
router.delete("/shop/:id", protect, shopApproved, deleteShopProduct);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, addProductReview);
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
