const express = require("express");
const rateLimit = require("express-rate-limit");

const { sendContactMessage } = require("../controllers/contactController");

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many attempts. Please try later.",
  },
});

router.post("/contact", rateLimiter, sendContactMessage);

module.exports = router;
