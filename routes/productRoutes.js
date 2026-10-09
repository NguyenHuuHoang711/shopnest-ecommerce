const express = require("express");
const router = express.Router();

const {
  getProducts,
  getSearchSuggestions,
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
} = require("../controllers/productController");

router.get("/products", getProducts);
router.get("/products/search-suggestions", getSearchSuggestions);
router.get("/featured-products", getFeaturedProducts);
router.get("/products/:id", getProductById);
router.get("/products/:id/related", getRelatedProducts);

module.exports = router;
