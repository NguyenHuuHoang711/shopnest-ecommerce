import React, { memo } from "react";

const OrderStatus = ({ order, formatDate, statusStyles }) => {
  return (
    <div className="space-y-2">
      <p className="flex justify-between">
        <span className="text-black/40">Order ID</span>
        <span className="text-black/80">{order.orderId}</span>
      </p>

      <p className="flex justify-between">
        <span className="text-black/40">Placed On</span>
        <span className="text-black/80">{formatDate(order.createdAt)}</span>
      </p>

      {order.shippedAt && (
        <p className="flex justify-between">
          <span className="text-black/40">Shipped On</span>
          <span className="text-black/80">
            <span>{formatDate(order.shippedAt)}</span>
          </span>
        </p>
      )}

      {order.deliveredAt && (
        <p className="flex justify-between">
          <span className="text-black/40">Delivered On</span>
          <span className="text-black/80">
            <span>{formatDate(order.deliveredAt)}</span>
          </span>
        </p>
      )}

      {order.cancelledAt && (
        <p className="flex justify-between">
          <span className="text-black/40">Cancelled On</span>
          <span className="text-black/80">
            <span>{formatDate(order.cancelledAt)}</span>
          </span>
        </p>
      )}

      <p className="flex justify-between items-center">
        <span className="text-black/40">Status</span>
        <span
          className={`
            inline-flex
            items-center
            justify-center
            h-7
            min-w-[106px]
            rounded-full
            px-3
            text-[10px]
            font-semibold
            tracking-[0.12em]
            uppercase
            ring-1 ring-inset
            transition-all duration-150

            ${
              statusStyles[order.status] ||
              "bg-black/[0.03] text-black/60 ring-black/[0.05]"
            }
          `}
        >
          {order.status}
        </span>
      </p>
    </div>
  );
};

export default memo(OrderStatus);
