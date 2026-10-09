const express = require("express");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests, try again later",
});

const {
  getReviews,
  myReviews,
  postReviews,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/products/:productId/reviews", getReviews);
router.get("/products/reviews/my", isAuth, myReviews);
router.post("/products/:productId/reviews", isAuth, reviewLimiter, postReviews);
router.delete(
  "/products/:productId/reviews/:reviewId",
  isAuth,
  reviewLimiter,
  deleteReview,
);

module.exports = router;
