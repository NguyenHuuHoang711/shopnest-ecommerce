const updateOrderStatus = (order, newStatus) => {
  order.status = newStatus;

  const now = new Date();

  if (newStatus === "Processing") order.processedAt = now;
  if (newStatus === "Shipped") order.shippedAt = now;
  if (newStatus === "Out for Delivery") order.outForDeliveryAt = now;
  if (newStatus === "Delivered") order.deliveredAt = now;
  if (newStatus === "Cancelled") order.cancelledAt = now;
};

module.exports = updateOrderStatus