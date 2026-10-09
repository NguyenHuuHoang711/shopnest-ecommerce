const express = require("express");
const rateLimit = require("express-rate-limit");

const protect = require("../middlewares/isAuth.js");

const {
  addPayment,
  getSavedPayments,
  deletePayment,
} = require("../controllers/paymentController.js");

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many attempts. Please try later.",
  },
});

router.post("/payment/add", protect, rateLimiter, addPayment);

router.get("/payment/saved", protect, getSavedPayments);

router.delete("/payment/:id", protect, deletePayment);

module.exports = router;
