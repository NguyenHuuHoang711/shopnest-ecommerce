const mongoose = require("mongoose");
const express = require("express");
const Order = require("../models/orderDetails.js");
const ShippingDetail = require("../models/shippingDetails.js");
const PaymentDetail = require("../models/paymentDetails.js");
const Product = require("../models/product.js");
const updateOrderStatus = require("../utils/updateOrderStatus.js");
const cancelOrderLogic = require("../utils/orderUtils.js");

exports.placeOrder = async (req, res, next) => {
  try {
    const {
      shippingAddressId,
      shippingAddress,
      paymentId,
      items,
      coupon,
      note,
    } = req.body;

    let shipping;

    if (shippingAddressId) {
      shipping = await ShippingDetail.findOne({
        _id: shippingAddressId,
        userId: req.user._id,
      });

      if (!shipping) {
        const error = new Error(`Invalid shipping address`);
        error.statusCode = 400;
        return next(error);
      }
    } else if (shippingAddress) {
      const requiredFields = [
        "fullName",
        "phone",
        "address1",
        "postalCode",
        "city",
        "state",
      ];

      const emptyField = requiredFields.find(
        (field) => !shippingAddress[field]?.trim(),
      );

      if (emptyField) {
        const error = new Error(`Missing field: ${emptyField}`);
        error.statusCode = 400;
        return next(error);
      }

      shipping = await ShippingDetail.findOne({
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address1: shippingAddress.address1,
        postalCode: shippingAddress.postalCode,
        city: shippingAddress.city,
        state: shippingAddress.state,
        userId: req.user._id,
      });

      if (!shipping) {
        const error = new Error(`Invalid shipping address`);
        error.statusCode = 400;
        return next(error);
      }
    } else {
      const error = new Error(`Shipping information required`);
      error.statusCode = 400;
      return next(error);
    }

    if (!shipping || !paymentId || !items || !items.length) {
      const error = new Error(
        `All fields (shipping, payment, items) are required`,
      );
      error.statusCode = 400;
      return next(error);
    }

    const payment = await PaymentDetail.findOne({
      _id: paymentId,
      userId: req.user._id,
    });

    if (!payment) {
      const error = new Error(`Invalid payment information`);
      error.statusCode = 400;
      return next(error);
    }

    const updatedProducts = new Map();

    const orderItems = await Promise.all(
      items.map(async (item) => {
        if (!item.quantity || item.quantity < 1) {
          throw new Error("Invalid quantity");
        }

        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const sizeData = product.sizes.find((s) => s.size === item.size);

        if (!sizeData) {
          throw new Error(`Size not available`);
        }

        if (sizeData.stock < item.quantity) {
          throw new Error(`Only ${sizeData.stock} left for size ${item.size}`);
        }

        sizeData.stock -= item.quantity;
        sizeData.sold += item.quantity;
        product.sold += item.quantity;

        updatedProducts.set(product._id.toString(), product);

        const basePrice = product.price;
        const taxRate = 0.1;
        const taxPrice = Number((basePrice * taxRate).toFixed(2));
        const total = (basePrice + taxPrice) * item.quantity;

        return {
          productId: product._id,
          quantity: item.quantity,
          size: item.size,
          name: product.name,
          basePrice,
          taxRate,
          taxPrice,
          total,
        };
      }),
    );

    await Promise.all([...updatedProducts.values()].map((p) => p.save()));

    let couponData;
    let discountAmount = 0;

    if (coupon?.code) {
      const totalBeforeDiscount = orderItems.reduce(
        (sum, item) => sum + item.total,
        0,
      );

      const COUPONS = {
        NOVA10: { discount: 0.1, minAmount: 200 },
        NOVA20: { discount: 0.2, minAmount: 500 },
      };

      const selectedCoupon = COUPONS[coupon.code];

      if (!selectedCoupon) {
        throw new Error("Invalid coupon code");
      }

      if (totalBeforeDiscount < selectedCoupon.minAmount) {
        throw new Error(
          `Minimum $${selectedCoupon.minAmount} required for ${coupon.code}`,
        );
      }

      discountAmount = totalBeforeDiscount * selectedCoupon.discount;

      couponData = {
        code: coupon.code,
        discountAmount: Number(discountAmount.toFixed(2)),
      };
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const order = new Order({
      userId: req.user._id,
      shippingAddressId: shipping._id,
      paymentId,
      items: orderItems,
      note: note || undefined,
      coupon: couponData || undefined,
      deliveryDate,
      isPaid: true,
      paidAt: Date.now(),
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order.orderId,
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 30, 50);

    const skip = (page - 1) * limit;

    const filter = {
      userId: req.user._id,
    };

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .populate(
        "shippingAddressId",
        "fullName phone address1 address2 city state postalCode",
      )
      .populate("paymentId", "name last4 month year")
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })

      .populate(
        "shippingAddressId",
        "fullName phone address1 address2 city state postalCode",
      )
      .populate("paymentId", "name last4 month year")
      .populate("items.productId", "name price images");

    if (!order) {
      const error = new Error(`Order not found`);
      error.statusCode = 404;
      return next(error);
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      const error = new Error(`Not authorized to view this order`);
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      return next(err);
    }

    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.status)) {
      throw new Error("Order cannot be cancelled");
    }

    if (order.status === "Cancelled") {
      throw new Error("Order already cancelled");
    }

    await cancelOrderLogic(order);

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    next(err);
  }
};
