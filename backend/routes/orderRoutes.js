const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
