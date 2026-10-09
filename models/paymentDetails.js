const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    last4: { type: String, required: true, trim: true, match: /^[0-9]{4}$/ },
    month: {
      type: String,
      required: true,
      trim: true,
      match: /^(0[1-9]|1[0-2])$/,
    },
    year: { type: String, required: true, trim: true, match: /^[0-9]{4}$/ },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ userId: 1, last4: 1 });
module.exports = mongoose.model("Payment", paymentSchema);
