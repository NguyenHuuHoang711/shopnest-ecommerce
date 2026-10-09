const express = require("express");

const protect = require("../middlewares/isAuth.js");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController.js");

const router = express.Router();

router.post("/orders/place", protect, placeOrder);
router.get("/orders/my-orders", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);
router.patch("/orders/cancel/:id", protect, cancelOrder);

module.exports = router;
