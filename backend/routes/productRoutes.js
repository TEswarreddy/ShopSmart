const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getAllProductsForAdmin,
  getMyShopProducts,
  addShopProduct,
  updateShopProduct,
  deleteShopProduct,
  uploadShopProductImage
} = require("../controllers/productController");
const { protect, admin, shopApproved } = require("../middleware/authMiddleware");
const { uploadProductImage } = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
router.get("/admin/all", protect, admin, getAllProductsForAdmin);
router.get("/shop/my", protect, shopApproved, getMyShopProducts);
router.post("/shop/upload-image", protect, shopApproved, uploadProductImage.single("image"), uploadShopProductImage);
router.post("/shop", protect, shopApproved, addShopProduct);
router.put("/shop/:id", protect, shopApproved, updateShopProduct);
router.delete("/shop/:id", protect, shopApproved, deleteShopProduct);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, addProductReview);
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
