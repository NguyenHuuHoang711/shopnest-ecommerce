const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Subscription", subscribeSchema);
