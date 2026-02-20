const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getShopProductIdSet = async (shopId) => {
  const products = await Product.find({ shop: shopId }).select("_id");
  return new Set(products.map((product) => product._id.toString()));
};

const buildShopScopedOrder = (order, shopProductIds) => {
  const source = order.toObject ? order.toObject() : order;

  const filteredItems = (source.items || []).filter(
    (item) => item.product && shopProductIds.has(item.product._id.toString())
  );

  if (filteredItems.length === 0) {
    return null;
  }

  const shopTotalPrice = filteredItems.reduce((sum, item) => {
    const unitPrice = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);
    return sum + unitPrice * quantity;
  }, 0);

  return {
    ...source,
    items: filteredItems,
    shopTotalPrice,
    shopItemCount: filteredItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  };
};

// 🧾 Place Order
exports.placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items: requestItems } = req.body;

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  let orderItems = [];

  if (Array.isArray(requestItems) && requestItems.length > 0) {
    const productIds = requestItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map(product => [product._id.toString(), product]));

    for (const item of requestItems) {
      const product = productMap.get(item.product);
      const quantity = Number(item.quantity || 0);

      if (!product) {
        return res.status(400).json({ message: "One or more products are invalid" });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      orderItems.push({
        product,
        quantity
      });
    }
  } else {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    orderItems = cart.items;

    cart.items = [];
    await cart.save();
  }

  // Calculate total
  const totalPrice = orderItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    totalPrice,
    shippingAddress,
    paymentMethod
  });

  res.status(201).json(order);
};

// 📄 Get User Orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// 📄 Admin - Get All Orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// ✏ Admin - Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// ❌ User - Cancel Order (only while Processing)
exports.cancelMyOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized for this order" });
  }

  if (order.orderStatus !== "Processing") {
    return res.status(400).json({ message: "Only processing orders can be cancelled" });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  const refreshedOrder = await Order.findById(order._id).populate("items.product");
  res.json(refreshedOrder);
};

exports.getShopOrders = async (req, res) => {
  const shopProductIds = await getShopProductIdSet(req.user._id);
  const productIds = Array.from(shopProductIds);

  const orders = await Order.find({ "items.product": { $in: productIds } })
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });

  const scopedOrders = orders
    .map((order) => buildShopScopedOrder(order, shopProductIds))
    .filter(Boolean);

  res.json(scopedOrders);
};

exports.updateShopOrderStatus = async (req, res) => {
  const shopProductIds = await getShopProductIdSet(req.user._id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const hasShopItem = order.items.some(
    (item) => item.product && shopProductIds.has(item.product._id.toString())
  );

  if (!hasShopItem) {
    return res.status(403).json({ message: "Not authorized for this order" });
  }

  const nextStatusByCurrent = {
    Processing: "Shipped",
    Shipped: "Delivered",
  };

  const expectedNextStatus = nextStatusByCurrent[order.orderStatus];

  if (!expectedNextStatus || status !== expectedNextStatus) {
    return res.status(400).json({
      message: `Invalid status transition. Allowed: ${order.orderStatus} -> ${expectedNextStatus || "N/A"}`,
    });
  }

  order.orderStatus = status;
  await order.save();

  const updated = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product");

  const scopedOrder = buildShopScopedOrder(updated, shopProductIds);
  res.json(scopedOrder);
};

exports.getShopSalesReport = async (req, res) => {
  const shopProductIds = await getShopProductIdSet(req.user._id);
  const productIds = Array.from(shopProductIds);

  const orders = await Order.find({ "items.product": { $in: productIds } })
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });

  const scopedOrders = orders
    .map((order) => buildShopScopedOrder(order, shopProductIds))
    .filter(Boolean);

  let totalSales = 0;
  let totalOrders = 0;
  let totalItemsSold = 0;

  for (const order of scopedOrders) {
    totalOrders += 1;
    totalSales += Number(order.shopTotalPrice || 0);
    totalItemsSold += Number(order.shopItemCount || 0);
  }

  res.json({
    totalSales,
    totalOrders,
    totalItemsSold,
    recentOrders: scopedOrders.slice(0, 10),
  });
};

// 🔍 Admin - View All Orders with Details
exports.getAllOrdersDetailed = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email phone")
    .populate("items.product", "title price")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// 🛑 Admin - Raise/Handle Dispute
exports.handleDispute = async (req, res) => {
  const { action, reason, description, resolution } = req.body;

  if (!["raise", "resolve", "close"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Must be 'raise', 'resolve', or 'close'." });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (action === "raise") {
    if (!reason || !description) {
      return res.status(400).json({ message: "Reason and description are required" });
    }
    order.dispute = {
      status: "raised",
      reason,
      description,
      raisedAt: new Date()
    };
  } else if (action === "resolve") {
    if (!resolution) {
      return res.status(400).json({ message: "Resolution is required" });
    }
    order.dispute = {
      ...order.dispute,
      status: "resolved",
      resolution,
      resolvedAt: new Date()
    };
  } else if (action === "close") {
    order.dispute = {
      ...order.dispute,
      status: "closed"
    };
  }

  await order.save();
  res.json(order);
};

// 💰 Admin - Process Refund (Advanced)
exports.processRefund = async (req, res) => {
  const { action, amount, reason, transactionId } = req.body;

  if (!["request", "approve", "reject", "process"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Must be 'request', 'approve', 'reject', or 'process'." });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (action === "request") {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid refund amount is required" });
    }
    if (amount > order.totalPrice) {
      return res.status(400).json({ message: "Refund amount cannot exceed order total" });
    }
    order.refund = {
      status: "requested",
      amount,
      reason: reason || "No reason provided",
      requestedAt: new Date()
    };
  } else if (action === "approve") {
    if (order.refund.status !== "requested") {
      return res.status(400).json({ message: "Only requested refunds can be approved" });
    }
    order.refund = {
      ...order.refund,
      status: "approved"
    };
  } else if (action === "reject") {
    if (order.refund.status !== "requested") {
      return res.status(400).json({ message: "Only requested refunds can be rejected" });
    }
    order.refund = {
      ...order.refund,
      status: "rejected"
    };
  } else if (action === "process") {
    if (order.refund.status !== "approved") {
      return res.status(400).json({ message: "Only approved refunds can be processed" });
    }
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required for processing" });
    }
    order.refund = {
      ...order.refund,
      status: "processed",
      processedAt: new Date(),
      transactionId
    };
  }

  await order.save();
  res.json(order);
};

