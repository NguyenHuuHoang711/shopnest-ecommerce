const mongoose = require("mongoose");
const Payment = require("../models/paymentDetails.js");

const addPayment = async (req, res, next) => {
  try {
    let { name, last4, month, year } = req.body;

    const sanitize = (str) => String(str || "").trim();

    name = sanitize(name);
    last4 = sanitize(last4);
    month = sanitize(month);
    year = sanitize(year);

    if (!name || !last4 || !month || !year) {
      const error = new Error("Missing fields");
      error.statusCode = 400;
      return next(error);
    }

    const last4Regex = /^[0-9]{4}$/;
    const monthRegex = /^(0[1-9]|1[0-2])$/;
    const yearRegex = /^[0-9]{4}$/;

    if (!last4Regex.test(last4)) {
      const error = new Error("Invalid card digits");
      error.statusCode = 400;
      return next(error);
    }

    if (!monthRegex.test(month)) {
      const error = new Error("Invalid month");
      error.statusCode = 400;
      return next(error);
    }

    if (!yearRegex.test(year)) {
      const error = new Error("Invalid year");
      error.statusCode = 400;
      return next(error);
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (
      Number(year) < currentYear ||
      (Number(year) === currentYear && Number(month) < currentMonth)
    ) {
      const error = new Error("Card expired");
      error.statusCode = 400;
      return next(error);
    }

    const existing = await Payment.findOne({
      userId: req.user._id,
      last4,
      month,
      year,
    });

    let paymentDetails;
    let isNew = false;

    if (!existing) {
      paymentDetails = await Payment.create({
        userId: req.user._id,
        name,
        last4,
        month,
        year,
      });

      isNew = true;
    } else {
      paymentDetails = existing;
    }

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? "Payment saved" : "Payment already exists",
      payment: {
        _id: paymentDetails._id,
        name: paymentDetails.name,
        last4: paymentDetails.last4,
        month: paymentDetails.month,
        year: paymentDetails.year,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSavedPayments = async (req, res, next) => {
  try {
    const savedPayments = await Payment.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      savedPayments,
    });
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid ID");
      error.statusCode = 400;
      return next(error);
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      const error = new Error("Payment not found");
      error.statusCode = 404;
      return next(error);
    }

    if (payment.userId.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 401;
      return next(error);
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Payment removed",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPayment,
  getSavedPayments,
  deletePayment,
};
