const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    price: { type: Number, required: true },
    description: {
      type: String,
      required: true,
    },

    productInfo: {
      type: [String],
      default: [],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["T-shirt", "Hoodie", "Jacket", "Jeans", "Shoes"],
    },
    gender: { type: String, required: true, enum: ["Men", "Women"] },
    images: { type: Array, required: true },
    sizes: [
      {
        size: {
          type: String,
          required: true,
          enum: [
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL",

            "28",
            "30",
            "32",
            "34",
            "36",
            "38",

            "UK6",
            "UK7",
            "UK8",
            "UK9",
            "UK10",
            "UK11",
          ],
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
        },
        sold: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    sold: { type: Number, default: 0 },

    isFeatured: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
