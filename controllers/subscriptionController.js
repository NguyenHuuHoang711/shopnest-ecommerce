const Subscribe = require("../models/subscribe.js");

const subscribeUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      const error = new Error("Email field cannot be empty ❌");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error(
        "Invalid email format ❌, please enter a valid email",
      );
      error.statusCode = 400;
      return next(error);
    }

    const existingSubscriber = await Subscribe.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      return res.status(200).json({
        success: true,
        message: "Subscription successful.",
      });
    }

    await Subscribe.create({
      email: normalizedEmail,
    });

    res.status(201).json({
      success: true,
      message: "User subscription completed✅",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  subscribeUser,
};
