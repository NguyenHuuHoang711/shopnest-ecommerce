const express = require("express");
const protect = require("../middlewares/isAuth.js");
const adminOnly = require("../middlewares/isAdmin.js");

const {
  getStats,
  getRecentOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllProducts,
  deleteProduct,
  addProduct,
  editProduct,
  getAllUsers,
  getUserById,
  getDashboardAnalytics,
} = require("../controllers/adminController.js");

const router = express.Router();

router.get("/admin/stats", protect, adminOnly, getStats);

router.get("/admin/orders/recent", protect, adminOnly, getRecentOrders);
router.get("/admin/orders", protect, adminOnly, getAllOrders);
router.get("/admin/orders/:id", protect, adminOnly, getOrderById);
router.patch(
  "/admin/orders/status-update",
  protect,
  adminOnly,
  updateOrderStatus,
);

router.get("/admin/products", protect, adminOnly, getAllProducts);
router.post("/admin/products/add", protect, adminOnly, addProduct);
router.put("/admin/products/edit/:id", protect, adminOnly, editProduct);
router.delete("/admin/products/delete/:id", protect, adminOnly, deleteProduct);

router.get("/admin/users", protect, adminOnly, getAllUsers);
router.get("/admin/users/:id", protect, adminOnly, getUserById);

router.get(
  "/admin/dashboard/analytics",
  protect,
  adminOnly,
  getDashboardAnalytics,
);

module.exports = router;
