const mongoose = require("mongoose");
const Shipping = require("../models/shippingDetails.js");

const addShippingAddress = async (req, res, next) => {
  try {
    let {
      fullName,
      phone,
      address1,
      address2,
      landmark,
      postalCode,
      city,
      state,
    } = req.body;

    const sanitize = (str) => str?.trim();
    const format = (str) =>
      sanitize(str)?.replace(/\b\w/g, (c) => c.toUpperCase());
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    fullName = sanitize(fullName);
    phone = sanitize(phone);
    address1 = sanitize(address1);
    address2 = address2 ? format(address2) : undefined;
    landmark = landmark ? format(landmark) : undefined;
    postalCode = sanitize(postalCode);
    city = format(city);
    state = format(state);

    if (!fullName || !phone || !address1 || !postalCode || !city || !state) {
      const error = new Error("Please fill all required fields");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      const error = new Error("Phone must be 10 digits");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^[1-9][0-9]{5}$/.test(postalCode)) {
      const error = new Error("Postal code must be 6 digits");
      error.statusCode = 400;
      return next(error);
    }

    const existing = await Shipping.findOne({
      userId: req.user._id,
      address1,
      city: new RegExp(`^${escapeRegex(city)}$`, "i"),
      state,
      postalCode,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Address already exists",
        shippingDetails: existing,
      });
    }

    const shippingDetails = await Shipping.create({
      userId: req.user._id,
      fullName,
      phone,
      address1,
      address2,
      landmark,
      postalCode,
      city,
      state,
    });

    res.status(201).json({
      success: true,
      message: "Shipping address saved successfully",
      shippingDetails,
    });
  } catch (err) {
    next(err);
  }
};

const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Shipping.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      addresses,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid ID");
      error.statusCode = 400;
      return next(error);
    }

    const address = await Shipping.findById(req.params.id);

    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.statusCode = 401;
      return next(error);
    }

    await address.deleteOne();

    res.status(200).json({
      success: true,
      message: "Address removed",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addShippingAddress,
  getUserAddresses,
  deleteAddress,
};
