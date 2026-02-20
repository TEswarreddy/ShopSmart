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

module.exports = router;
