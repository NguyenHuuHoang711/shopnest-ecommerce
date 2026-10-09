const Product = require("../models/product");
const updateOrderStatus = require("./updateOrderStatus");

const cancelOrderLogic = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    product.sold = Math.max(0, product.sold - item.quantity);

    const size = product.sizes.find((s) => s.size === item.size);

    if (size) {
      size.stock += item.quantity;
      size.sold = Math.max(0, size.sold - item.quantity);
    }

    await product.save();
  }

  order.status = "Cancelled";
  updateOrderStatus(order, "Cancelled");
  await order.save();
};

module.exports = cancelOrderLogic;
