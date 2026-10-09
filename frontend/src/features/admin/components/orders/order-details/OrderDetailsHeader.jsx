import React, { memo } from "react";

const statusStyles = {
  Delivered: "bg-green-50 text-green-600 ring-green-500/10",
  Cancelled: "bg-red-50 text-red-600 ring-red-500/10",
  Shipped: "bg-blue-50 text-blue-600 ring-blue-500/10",
  "Out for Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
  Processing: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
  Placed: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
};

const OrderDetailsHeader = ({ order }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-[6px] w-[6px] rounded-full bg-black/80" />

          <p
            className="text-[10px]
              font-medium
        tracking-[0.18em]
        uppercase
        text-black/35
            "
          >
            Order Details
          </p>
        </div>

        <div className="space-y-3">
          <h1
            className="
              text-[34px]
        leading-none
        font-semibold
        tracking-[-0.06em]
        text-black/90"
          >
            #{order?.orderId}
          </h1>

          <p
            className="
             max-w-[520px]
        text-[13px]
        leading-relaxed
        text-black/45"
          >
            {new Date(order?.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div
        className={`
          inline-flex
          w-fit
          items-center justify-center
          rounded-full
          border border-white/40
          px-3.5
          py-1.5
          text-[11px]
          font-medium
          tracking-[0.08em]
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
          ring-1 ring-inset
          backdrop-blur-xl
          ${statusStyles[order?.status]}`}
      >
        {order?.status}
      </div>
    </div>
  );
};

export default memo(OrderDetailsHeader);
