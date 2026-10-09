import React, { memo } from "react";

const OrderDetailsItems = ({ item, formatCurrency }) => {
  return (
    <div
      className="
              group
              p-6
              transition-colors duration-150
              hover-supported:hover:bg-black/[0.015]"
    >
      <div className="flex items-start gap-4">
        <div
          className="
                  h-16
                  w-16
                  shrink-0
                  overflow-hidden
                  bg-black/[0.03]
                "
        >
          <img
            src={`${item.productId?.images?.[0]}&w=60&q=75&auto=format`}
            srcSet={`
                    ${item.productId?.images?.[0]}&w=60&q=75&auto=format 1x,
                    ${item.productId?.images?.[0]}&w=120&q=75&auto=format 2x
                  `}
            sizes="56px"
            alt={item.name}
            loading="lazy"
            decoding="async"
            draggable="false"
            fetchPriority="low"
            width={56}
            height={56}
            className="
        h-full
        w-full
        object-cover
        will-change-transform
        transition-transform duration-150 ease-out
        group-hover:scale-[1.04]
      "
          />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
                    truncate
                    text-[15px]
                    font-medium
                    tracking-[-0.01em]
                    text-black/85
                  "
          >
            {item.name}
          </p>

          <div
            className="
                    mt-2
                    flex flex-wrap items-center gap-2
                    text-[12px]
                    text-black/35
                  "
          >
            <span>Size {item.size}</span>
            <span className="h-1 w-1 rounded-full bg-black/20" />
            <span>Qty {item.quantity}</span>
          </div>

          <div
            className="
                    mt-5
                    grid grid-cols-3 gap-4
                  "
          >
            <div className="space-y-1">
              <p
                className="
                        text-[10px]
                        uppercase
                        tracking-[0.12em]
                        text-black/30
                      "
              >
                Price
              </p>

              <p
                className="
                        text-[13px]
                        text-black/75
                      "
              >
                {formatCurrency(item.basePrice)}
              </p>
            </div>

            <div className="space-y-1">
              <p
                className="
                        text-[10px]
                        uppercase
                        tracking-[0.12em]
                        text-black/30
                      "
              >
                Tax
              </p>

              <p
                className="
                        text-[13px]
                        text-black/45
                      "
              >
                {formatCurrency(item.taxPrice)}
              </p>
            </div>

            <div className="space-y-1 text-right">
              <p
                className="
                        text-[10px]
                        uppercase
                        tracking-[0.12em]
                        text-black/30
                      "
              >
                Total
              </p>

              <p
                className="
                        text-[15px]
                        font-medium
                        tracking-[-0.01em]
                        text-black/85
                      "
              >
                {formatCurrency(item.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsItems);
