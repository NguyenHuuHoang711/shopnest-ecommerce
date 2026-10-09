const express = require("express");
const rateLimit = require("express-rate-limit");

const protect = require("../middlewares/isAuth.js");

const {
  addShippingAddress,
  getUserAddresses,
  deleteAddress,
} = require("../controllers/shippingController.js");

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many attempts. Please try later.",
  },
});

router.post("/shipping/add", protect, rateLimiter, addShippingAddress);

router.get("/shipping/my-addresses", protect, getUserAddresses);

router.delete("/shipping/:id", protect, deleteAddress);

module.exports = router;
