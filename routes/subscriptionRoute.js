const express = require("express");
const rateLimit = require("express-rate-limit");

const { subscribeUser } = require("../controllers/subscriptionController.js");

const router = express.Router();

const subscribeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many subscription attempts. Please try later.",
  },
});

router.post("/subscribe", subscribeLimiter, subscribeUser);

module.exports = router;
