const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: () => "ORD" + nanoid(),
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
      required: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },

          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
          },
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

          name: {
            type: String,
            required: true,
          },

          basePrice: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
          },

          taxRate: {
            type: Number,
            required: true,
            min: 0,
          },

          taxPrice: {
            type: Number,
            required: true,
            min: 0,
          },

          total: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],

      validate: [(val) => val.length > 0, "Order must have at least one item"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    coupon: {
      code: { type: String },
      discountAmount: { type: Number, default: 0 },
    },
    subtotalAmount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      min: [0, "Total amount cannot be negative"],
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },

    processedAt: Date,
    shippedAt: Date,
    outForDeliveryAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    deliveryDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

orderSchema.pre("save", function (next) {
  this.subtotalAmount = Number(
    this.items
      .reduce((sum, item) => sum + item.basePrice * item.quantity, 0)
      .toFixed(2),
  );

  this.totalAmount = Number(
    this.items.reduce((sum, item) => sum + item.total, 0).toFixed(2),
  );

  this.taxAmount = Number(
    this.items
      .reduce((sum, item) => sum + item.taxPrice * item.quantity, 0)
      .toFixed(2),
  );

  const discount = this.coupon?.discountAmount || 0;

  this.finalAmount = Number((this.totalAmount - discount).toFixed(2));

  next();
});

orderSchema.index({ userId: 1 });

module.exports = mongoose.model("Order", orderSchema);
