const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

exports.registerUser = async (req, res, next) => {
  try {
    const { name, phone, email, password, confirmPassword } = req.body;

    if (!password || !email || !name || !phone || !confirmPassword) {
      const error = new Error(
        "Missing information, please fill in all the fields",
      );
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const nameClean = name.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error(
        "Invalid email format ❌, please enter a valid email",
      );
      error.statusCode = 400;
      return next(error);
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      const error = new Error("Please enter a valid 10-digit mobile number");
      error.statusCode = 400;
      return next(error);
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }

    if (password.length < 8) {
      const error = new Error("Minimum 8 characters required");
      error.statusCode = 400;
      return next(error);
    }
    if (password.length > 64) {
      const error = new Error("Maximum 64 characters");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[A-Z]/.test(password)) {
      const error = new Error("Add at least 1 uppercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[a-z]/.test(password)) {
      const error = new Error("Add at least 1 lowercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/\d/.test(password)) {
      const error = new Error("Add at least 1 number");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[@$!%*?&]/.test(password)) {
      const error = new Error("Add at least 1 special character");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      const error = new Error("User already exists with this email or phone");
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: nameClean,
      phone: normalizedPhone,
      email: normalizedEmail,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      message: "Registration successfull ✅",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Invalid email or password ❌");
      error.statusCode = 401;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error("Invalid email or password ❌");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      const error = new Error("Invalid email or password ❌");
      error.statusCode = 401;
      return next(error);
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const error = new Error("Account locked. Try again later.");
      error.statusCode = 403;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await user.save();

      const error = new Error("Invalid email or password ❌");
      error.statusCode = 401;
      return next(error);
    }
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      message: "Login successful ✅",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error(
        "Missing information, please fill in the email field",
      );
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error("Invalid email or password ❌");
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    const message = `Click the link to reset your password:\n\n${resetURL}\n\nThis link is valid for 10 minutes.`;

    await sendEmail(user.email, "Reset Password", message);

    res.status(200).json({
      message: "Reset link sent to email ✅",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Token invalid or expired");
      error.statusCode = 401;
      return next(error);
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }
    if (password.length < 8) {
      const error = new Error("Minimum 8 characters required");
      error.statusCode = 400;
      return next(error);
    }
    if (password.length > 64) {
      const error = new Error("Maximum 64 characters");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[A-Z]/.test(password)) {
      const error = new Error("Add at least 1 uppercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[a-z]/.test(password)) {
      const error = new Error("Add at least 1 lowercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/\d/.test(password)) {
      const error = new Error("Add at least 1 number");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[@$!%*?&]/.test(password)) {
      const error = new Error("Add at least 1 special character");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful ✅",
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email isAdmin role",
    );

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      const error = new Error(
        "Missing information, please fill in all the fields",
      );
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      const error = new Error("User does not exist ❌");
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      const error = new Error("Invalid password ❌");
      error.statusCode = 401;
      return next(error);
    }

    if (newPassword !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }

    if (newPassword.length < 8) {
      const error = new Error("Minimum 8 characters required");
      error.statusCode = 400;
      return next(error);
    }
    if (newPassword.length > 64) {
      const error = new Error("Maximum 64 characters");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[A-Z]/.test(newPassword)) {
      const error = new Error("Add at least 1 uppercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[a-z]/.test(newPassword)) {
      const error = new Error("Add at least 1 lowercase letter");
      error.statusCode = 400;
      return next(error);
    }
    if (!/\d/.test(newPassword)) {
      const error = new Error("Add at least 1 number");
      error.statusCode = 400;
      return next(error);
    }
    if (!/[@$!%*?&]/.test(newPassword)) {
      const error = new Error("Add at least 1 special character");
      error.statusCode = 400;
      return next(error);
    }

    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      const error = new Error("New password must be different");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedPassword = await User.findByIdAndUpdate(
      {
        _id: req.user._id,
      },
      {
        password: hashedPassword,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "Password updated successful ✅",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      const error = new Error("Name and email are required");
      error.statusCode = 400;
      return next(error);
    }

    const nameVal = name.trim();
    const emailVal = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (nameVal.length < 2) {
      const error = new Error("Name must be at least 2 characters");
      error.statusCode = 400;
      return next(error);
    }

    if (!emailRegex.test(emailVal)) {
      const error = new Error("Invalid email address");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const existing = await User.findOne({ email: emailVal });

    if (existing && existing._id.toString() !== req.user._id.toString()) {
      const error = new Error("Email already in use");
      error.statusCode = 400;
      return next(error);
    }

    if (user.name === nameVal && user.email === emailVal) {
      return res.status(200).json({
        success: true,
        message: "No changes made",
        user: {
          name: user.name,
          email: user.email,
        },
      });
    }

    user.name = nameVal;
    user.email = emailVal;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.addRecentlyViewed = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.recentlyViewed = [
      productId,
      ...user.recentlyViewed.filter((id) => id.toString() !== productId),
    ].slice(0, 10);

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          recentlyViewed: user.recentlyViewed,
        },
      },
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "recentlyViewed",
    });

    res.json(user.recentlyViewed);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recently viewed" });
  }
};
