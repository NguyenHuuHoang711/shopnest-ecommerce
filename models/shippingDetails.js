const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, match: /^[0-9]{10}$/ },
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true },
    landmark: { type: String, trim: true },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/,
    },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

shippingSchema.index({ userId: 1 });
module.exports = mongoose.model("Shipping", shippingSchema);
