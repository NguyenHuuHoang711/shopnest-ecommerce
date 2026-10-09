const express = require("express");
require("dotenv").config();
const protect = require("../middlewares/isAuth.js");

const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updateUserPassword,
  addRecentlyViewed,
  getRecentlyViewed,
} = require("../controllers/userController.js");

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many attempts. Please try later.",
    });
  },
});

router.post("/user/register", rateLimiter, registerUser);
router.post("/user/login", rateLimiter, loginUser);
router.post("/user/forgot-password", rateLimiter, forgotPassword);
router.post("/user/reset-password/:token", rateLimiter, resetPassword);
router.get("/user/profile", protect, getProfile);
router.put("/user/update-password", protect, updateUserPassword);
router.put("/user/profile", protect, updateProfile);
router.post("/user/recently-viewed/:productId", protect, addRecentlyViewed);
router.get("/user/recently-viewed", protect, getRecentlyViewed);

module.exports = router;
