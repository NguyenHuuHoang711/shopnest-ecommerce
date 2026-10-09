import React, { memo } from "react";

const OrderTimeline = ({
  i,
  isActive,
  isCancelled,
  isCurrent,
  step,
  order,
}) => {
  return (
    <div
      key={i}
      className="
            relative
            flex
            md:flex-col

            items-start
            md:items-center

            flex-1
          "
    >
      {i !== 0 && (
        <div
          className={`
                absolute

                md:hidden

                left-[13px]
                top-[-34px]

                w-[1.5px]
                h-8

                ${
                  isCancelled
                    ? "bg-red-300"
                    : isActive
                      ? "bg-black/80"
                      : "bg-black/10"
                }
              `}
        />
      )}

      {i !== 0 && (
        <div
          className={`
                hidden
                md:block

                absolute

                top-[14px]
                left-[-50%]

                w-full
                h-[1.5px]

                ${
                  isCancelled
                    ? "bg-red-300"
                    : isActive
                      ? "bg-black/80"
                      : "bg-black/10"
                }
              `}
        />
      )}

      <div
        className={`
              relative
              z-10

              flex
              items-center
              justify-center

              w-7
              h-7

              rounded-full

              shrink-0

              ${
                isCancelled
                  ? "bg-red-500"
                  : isCurrent
                    ? "bg-black shadow-[0_0_0_8px_rgba(0,0,0,0.05)]"
                    : isActive
                      ? "bg-black"
                      : "bg-black/10 border border-black/10"
              }
            `}
      >
        {isActive && !isCancelled && (
          <div className="w-2 h-2 rounded-full bg-white" />
        )}
      </div>

      <div
        className="
              ml-4
              md:ml-0

              md:mt-4

              text-left
              md:text-center
            "
      >
        <p
          className={`
                text-xs
                uppercase
                tracking-[0.12em]

                ${
                  isCurrent
                    ? "text-black font-medium"
                    : isActive
                      ? "text-black/70"
                      : "text-black/35"
                }
              `}
        >
          {step}
        </p>

        <p className="mt-1 text-[10px] text-black/30">
          {step === "Placed" &&
            new Date(order.createdAt).toLocaleDateString("en-IN")}

          {step === "Shipped" &&
            order.shippedAt &&
            new Date(order.shippedAt).toLocaleDateString("en-IN")}

          {step === "Delivered" &&
            order.deliveredAt &&
            new Date(order.deliveredAt).toLocaleDateString("en-IN")}
        </p>

        {isCurrent && order.status !== "Cancelled" && (
          <span
            className="
                  inline-block

                  mt-2

                  px-2.5
                  py-1

                  text-[9px]
                  uppercase
                  tracking-[0.15em]

                  bg-black
                  text-white

                  rounded-2xl
                "
          >
            Current
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(OrderTimeline);
