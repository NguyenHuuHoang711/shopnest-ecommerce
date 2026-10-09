import React, { memo } from "react";

const OrderDetailsCards = ({ order, infoCard }) => {
  return (
    <div className="space-y-8">
      <div className={infoCard}>
        <p
          className="
        mb-5

        text-[11px]

        uppercase

        tracking-[0.18em]

        text-black/35
      "
        >
          Customer
        </p>

        <div className="space-y-1.5">
          <p
            className="
          text-[14px]
          font-medium

          tracking-[-0.01em]

          text-black/85
        "
          >
            {order?.userId?.name}
          </p>

          <p
            className="
          text-[13px]

          text-black/35
        "
          >
            {order?.userId?.email}
          </p>
        </div>
      </div>

      <div className={infoCard}>
        <p
          className="
        mb-5

        text-[11px]

        uppercase

        tracking-[0.18em]

        text-black/35
      "
        >
          Shipping
        </p>

        <div className="space-y-1.5">
          <p
            className="
          text-[14px]

          leading-relaxed

          text-black/85
        "
          >
            {order?.shippingAddressId?.address1}
          </p>

          <p
            className="
          text-[13px]

          text-black/40
        "
          >
            {order?.shippingAddressId?.city},{" "}
            {order?.shippingAddressId?.postalCode}
          </p>
        </div>
      </div>

      <div className={infoCard}>
        <p
          className="
        mb-5
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35
      "
        >
          Payment
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <p
              className="
            text-[14px]
            font-medium
            tracking-[-0.01em]
            text-black/85
          "
            >
              {order?.paymentId?.name}
            </p>

            <p
              className="
            text-[13px]
            text-black/45"
            >
              **** **** **** {order?.paymentId?.last4}
            </p>

            <p
              className="
            text-[12px]
            text-black/35
          "
            >
              Expires {order?.paymentId?.month}/{order?.paymentId?.year}
            </p>
          </div>

          <div>
            <span
              className={`
            inline-flex items-center justify-center

            rounded-full

            border

            px-3
            py-1.5

            text-[11px]
            font-medium

            tracking-[0.08em]

            ${
              order?.isPaid
                ? "border-black/[0.06] bg-black/[0.06] text-black/72"
                : "border-black/[0.045] bg-black/[0.03] text-black/42"
            }
          `}
            >
              {order?.isPaid ? "Paid" : "Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsCards);
