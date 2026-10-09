const mongoose = require("mongoose");
const Product = require("../models/product.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

exports.postReviews = async (req, res, next) => {
  try {
    const { content, rating } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    if (!content || !rating) {
      return res.status(400).json({ message: "Content and rating required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1-5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let review = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (review) {
      review.content = content;
      review.rating = rating;
      await review.save();
    } else {
      review = await Review.create({
        content,
        rating,
        product: productId,
        user: userId,
      });
    }

    const stats = await Review.aggregate([
      {
        $match: { product: product._id },
      },
      {
        $group: {
          _id: "$product",
          avgRating: {
            $avg: "$rating",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0]?.avgRating || 0,
      ratingsCount: stats[0]?.count || 0,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      review.user.toString() !== userId.toString() ||
      review.product.toString() !== productId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0]?.avgRating || 0,
      ratingsCount: stats[0]?.count || 0,
    });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error(`Invalid product ID`);
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findById(productId).select(
      "ratingsAverage ratingsCount",
    );
    if (!product) {
      const error = new Error(`Product not found`);
      error.statusCode = 404;
      return next(error);
    }

    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const skip = (page - 1) * limit;

    const filter = {
      product: productId,
    };

    const totalReviews = await Review.countDocuments(filter);

    const distribution = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    distribution.forEach(({ _id, count }) => {
      ratingDistribution[_id] = count;
    });

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name");

    res.status(200).json({
      success: true,
      reviews,
      page,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
      ratingsAverage: product.ratingsAverage,
      ratingsCount: product.ratingsCount,
      ratingDistribution,
    });
  } catch (err) {
    next(err);
  }
};

exports.myReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};
