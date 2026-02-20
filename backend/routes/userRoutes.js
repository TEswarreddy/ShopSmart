const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserProfile,
	updateUserProfile,
	updateUserPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile/password", protect, updateUserPassword);

module.exports = router;
