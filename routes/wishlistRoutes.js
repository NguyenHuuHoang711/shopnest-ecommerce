const express = require("express");

const protect = require("../middlewares/isAuth.js");

const {
  getWishlist,
  toggleWishlist,
} = require("../controllers/wishlistController.js");

const router = express.Router();

router.get("/wishlist", protect, getWishlist);

router.post("/wishlist/:productId", protect, toggleWishlist);

module.exports = router;
