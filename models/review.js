const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    content: { type: String },
    rating: { type: Number },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
