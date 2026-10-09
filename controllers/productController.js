const mongoose = require("mongoose");
const Product = require("../models/product");
const { SHIPPING_INFO, RETURN_POLICY } = require("../utils/constant");

exports.getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const search = req.query.search?.trim() || "";

    const sort = req.query.sort;

    let min = Number(req.query.min) || 0;
    let max = Number(req.query.max) || 500;

    const gender = req.query.gender;
    const category = req.query.category;

    const skip = (page - 1) * limit;

    if (min >= max) {
      min = 0;
      max = 500;
    }

    const filter = {
      price: { $gte: min, $lte: max },
    };

    if (gender) {
      filter.gender = { $in: gender.split(",") };
    }

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.name = {
        $regex: `\\b${escapedSearch}`,
        $options: "i",
      };
    }

    let sortOption;

    switch (sort) {
      case "Recommended":
        sortOption = { sold: -1, _id: -1 };
        break;

      case "Newest Arrivals":
        sortOption = { createdAt: -1, _id: -1 };
        break;

      case "Price: Low to High":
        sortOption = { price: 1, _id: 1 };
        break;

      case "Price: High to Low":
        sortOption = { price: -1, _id: -1 };
        break;

      default:
        sortOption = { createdAt: -1, _id: -1 };
    }

    const totalProducts = await Product.countDocuments(filter);

    let query = Product.find(filter).skip(skip).limit(limit);

    if (sortOption) {
      query = query.sort(sortOption);
    }

    const products = await query;

    res.json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();

    if (!search || search.length < 2) {
      return res.json({ products: [] });
    }

    let min = Number(req.query.min) || 0;
    let max = Number(req.query.max) || 500;

    const gender = req.query.gender;
    const category = req.query.category;

    if (min >= max) {
      min = 0;
      max = 500;
    }

    const filter = {
      price: { $gte: min, $lte: max },
    };

    if (gender) {
      filter.gender = { $in: gender.split(",") };
    }

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.name = {
        $regex: `\\b${escapedSearch}`,
        $options: "i",
      };
    }

    const products = await Product.find(filter)
      .select("name images price")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: featuredProducts.length,
      products: featuredProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid product ID");
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      product,
      shippingInfo: SHIPPING_INFO,
      returnPolicy: RETURN_POLICY,
    });
  } catch (err) {
    next(err);
  }
};
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid product ID");
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const related = await Product.find({
      category: product.category,
      gender: product.gender,
      _id: { $ne: id },
    }).limit(3);

    res.json(related);
  } catch (err) {
    next(err);
  }
};
