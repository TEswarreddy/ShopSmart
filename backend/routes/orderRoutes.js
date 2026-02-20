const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  getShopOrders,
  updateShopOrderStatus,
  getShopSalesReport,
  getAllOrdersDetailed,
  handleDispute,
  processRefund
} = require("../controllers/orderController");

const { protect, admin, shopApproved } = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.patch("/:id/cancel", protect, cancelMyOrder);
router.get("/shop", protect, shopApproved, getShopOrders);
router.put("/shop/:id/status", protect, shopApproved, updateShopOrderStatus);
router.get("/shop/sales-report", protect, shopApproved, getShopSalesReport);
router.get("/admin/all", protect, admin, getAllOrdersDetailed);
router.post("/admin/:id/dispute", protect, admin, handleDispute);
router.post("/admin/:id/refund", protect, admin, processRefund);
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
