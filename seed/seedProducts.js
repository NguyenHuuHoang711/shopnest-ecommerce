const products = require("./product.js");
const { getDescription, getProductInfo } = require("./helper.js");
const Product = require("../models/product.js");

exports.seedProducts = async (req, res, next) => {
  try {
    await Product.insertMany(
      products.map((p) => ({
        ...p,
        description: getDescription(p.category, p.name),
        productInfo: getProductInfo(p.category),
      })),
    );
    console.log("Products inserted successfully");
    res.status(201).json({ message: "Products inserted successfully" });
  } catch (err) {
    next(err);
  }
};
