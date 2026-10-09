const { default: mongoose } = require("mongoose");
const User = require("../models/user.js");
const Order = require("../models/orderDetails.js");
const Product = require("../models/product.js");
const cancelOrderLogic = require("../utils/orderUtils.js");

const getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenueData = await Order.find({ status: "Delivered" });

    const revenue = revenueData.reduce(
      (acc, order) => acc + order.finalAmount,
      0,
    );

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      revenue,
    });
  } catch (err) {
    next(err);
  }
};

const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const {
      search = "",
      statusFilter = "All",
      page = 1,
      limit = 8,
    } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 8;
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    });

    if (search.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { orderId: { $regex: search, $options: "i" } },
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (statusFilter !== "All") {
      pipeline.push({
        $match: { status: statusFilter },
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push({
      $facet: {
        orders: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              orderId: 1,
              finalAmount: 1,
              status: 1,
              createdAt: 1,
              "user.name": 1,
              "user.email": 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    const result = await Order.aggregate(pipeline);

    const orders = result[0].orders;
    const total = result[0].totalCount[0]?.count || 0;

    res.json({
      orders,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate("userId", "name email")
      .populate(
        "shippingAddressId",
        "fullName phone address1 address2 city state postalCode",
      )
      .populate("paymentId", "name last4 month year")
      .populate("items.productId", "name price images");

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, id } = req.body;

    const order = await Order.findOne({ orderId: id });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    const statusFlow = {
      Placed: 0,
      Processing: 1,
      Shipped: 2,
      "Out for Delivery": 3,
      Delivered: 4,
    };

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be updated",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled orders cannot be updated",
      });
    }

    if (
      status !== "Cancelled" &&
      statusFlow[status] < statusFlow[order.status]
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot move order backwards",
      });
    }

    if (status === "Cancelled") {
      await cancelOrderLogic(order);

      return res.json({
        success: true,
        message: "Order cancelled successfully",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 30, 50);
    const search = req.query.search;
    const gender = req.query.gender;
    const category = req.query.category;

    const skip = (page - 1) * limit;

    const filter = {};

    if (gender && gender !== "All") {
      filter.gender = gender;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search && search.trim() !== "") {
      filter.name = { $regex: search, $options: "i" };
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("name price category gender images sizes");

    res.json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById({ _id: productId });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 403;
      return next(error);
    }

    await Product.findByIdAndDelete({ _id: product._id });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const addProduct = async (req, res, next) => {
  try {
    let {
      name,
      price,
      description,
      productInfo,
      category,
      gender,
      sizes,
      isFeatured,
    } = req.body;

    if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    name = name?.trim();
    description = description?.trim();
    price = Number(price);

    try {
      if (typeof productInfo === "string")
        productInfo = JSON.parse(productInfo);
      if (typeof sizes === "string") sizes = JSON.parse(sizes);
      if (typeof isFeatured === "string") isFeatured = JSON.parse(isFeatured);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid structured data format",
      });
    }

    if (
      !name ||
      name.length < 2 ||
      isNaN(price) ||
      price <= 0 ||
      !description ||
      description.length < 10 ||
      !category ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid product information",
      });
    }

    const validCategories = ["T-shirt", "Hoodie", "Jacket", "Jeans", "Shoes"];
    const validGenders = ["Men", "Women"];

    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    if (!validGenders.includes(gender)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gender" });
    }

    if (!Array.isArray(productInfo) || productInfo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product details are required",
      });
    }

    const cleanedInfo = [];
    const seen = new Set();

    productInfo.forEach((info) => {
      if (typeof info !== "string") return;
      const trimmed = info.trim();
      if (!trimmed) return;
      const normalized = trimmed.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        cleanedInfo.push(trimmed);
      }
    });

    if (cleanedInfo.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product details" });
    }

    const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product sizes are required" });
    }

    const cleanedSizes = [];

    for (const item of sizes) {
      if (!validSizes.includes(item.size)) {
        return res.status(400).json({
          success: false,
          message: `Invalid size: ${item.size}`,
        });
      }

      const stock = Number(item.stock);

      if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({
          success: false,
          message: `Invalid stock for size ${item.size}`,
        });
      }

      if (stock > 0) {
        cleanedSizes.push({ size: item.size, stock, sold: 0 });
      }
    }

    if (cleanedSizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one size must have stock",
      });
    }

    const uploadedImages = req.body.images;

    const existingProduct = await Product.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingProduct) {
      return res
        .status(409)
        .json({ success: false, message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      price,
      description,
      productInfo: cleanedInfo,
      category,
      gender,
      images: uploadedImages,
      sizes: cleanedSizes,
      isFeatured: Boolean(isFeatured),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let {
      name,
      price,
      description,
      productInfo,
      category,
      gender,
      images,
      sizes,
      isFeatured,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    name = name?.trim();
    description = description?.trim();
    price = Number(price);

    if (
      !name ||
      name.length < 2 ||
      isNaN(price) ||
      price <= 0 ||
      !description ||
      description.length < 10 ||
      !category ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid product information",
      });
    }

    const validCategories = ["T-shirt", "Hoodie", "Jacket", "Jeans", "Shoes"];
    const validGenders = ["Men", "Women"];

    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    if (!validGenders.includes(gender)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gender" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const cleanedImages = [];

    for (const img of images) {
      if (typeof img !== "string") continue;
      const trimmed = img.trim();
      if (!trimmed) continue;
      try {
        new URL(trimmed);
        cleanedImages.push(trimmed);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid image URL detected",
        });
      }
    }

    if (cleanedImages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product images" });
    }

    if (!Array.isArray(productInfo) || productInfo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product details are required",
      });
    }

    const cleanedInfo = [];
    const seen = new Set();

    productInfo.forEach((info) => {
      if (typeof info !== "string") return;
      const trimmed = info.trim();
      if (!trimmed) return;
      const normalized = trimmed.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        cleanedInfo.push(trimmed);
      }
    });

    if (cleanedInfo.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product details" });
    }

    const validSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Sizes are required" });
    }

    const cleanedSizes = [];

    for (const item of sizes) {
      if (!validSizes.includes(item.size)) {
        return res.status(400).json({
          success: false,
          message: `Invalid size: ${item.size}`,
        });
      }

      const stock = Number(item.stock);

      if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({
          success: false,
          message: `Invalid stock for ${item.size}`,
        });
      }

      const existingSize = product.sizes.find((s) => s.size === item.size);

      cleanedSizes.push({
        size: item.size,
        stock,
        sold: existingSize?.sold || 0,
      });
    }

    if (!cleanedSizes.some((item) => item.stock > 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one size must have stock",
      });
    }

    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Another product with this name already exists",
      });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.productInfo = cleanedInfo;
    product.category = category;
    product.gender = gender;
    product.images = cleanedImages;
    product.sizes = cleanedSizes;
    product.isFeatured = Boolean(isFeatured);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const search = req.query.search;

    const filter = {};

    if (search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "All") {
      filter.role = role;
    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const [stats] = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, "$finalAmount", 0],
            },
          },
        },
      },
    ]);

    const orders = await Order.find({ userId: id })
      .select("orderId finalAmount status createdAt products")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalOrders = stats?.totalOrders || 0;
    const totalSpent = stats?.totalSpent || 0;

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        totalOrders,
        totalSpent,
        totalPages: Math.ceil(totalOrders / limit),
      },
      orders,
    });
  } catch (err) {
    next(err);
  }
};

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const products = await Product.find().lean();

    const lowStockProducts = [];

    products.forEach((product) => {
      product.sizes.forEach((sizeObj) => {
        if (sizeObj.stock > 0 && sizeObj.stock <= 5) {
          lowStockProducts.push({
            _id: product._id,
            name: product.name,
            image: product.images?.[0],
            size: sizeObj.size,
            stock: sizeObj.stock,
          });
        }
      });
    });

    lowStockProducts.sort((a, b) => a.stock - b.stock);

    const topProducts = await Product.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(5)
      .select("name sold images category price")
      .lean();

    res.status(200).json({
      success: true,
      lowStockProducts: lowStockProducts.slice(0, 5),
      topProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getRecentOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllProducts,
  deleteProduct,
  addProduct,
  editProduct,
  getAllUsers,
  getUserById,
  getDashboardAnalytics,
};
