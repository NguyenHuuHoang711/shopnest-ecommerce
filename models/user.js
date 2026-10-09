const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    recentlyViewed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: { type: Date, default: null },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    role: { type: String, default: "User", enum: ["Admin", "User"] },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ wishlist: 1 });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
