const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	updateUserPassword,
	getPendingShops,
	updateShopApprovalStatus,
	getAllShopsWithSales,
	deleteShop,
	getAllUsers,
	updateUserBlockStatus,
	deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile/password", protect, updateUserPassword);
router.get("/shops/pending", protect, admin, getPendingShops);
router.put("/shops/:id/approval", protect, admin, updateShopApprovalStatus);
router.get("/shops", protect, admin, getAllShopsWithSales);
router.put("/shops/:id/status", protect, admin, updateShopApprovalStatus);
router.delete("/shops/:id", protect, admin, deleteShop);
router.get("/admin/users", protect, admin, getAllUsers);
router.put("/admin/users/:id/block", protect, admin, updateUserBlockStatus);
router.delete("/admin/users/:id", protect, admin, deleteUser);

module.exports = router;
