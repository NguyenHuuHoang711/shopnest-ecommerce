import React, { memo } from "react";
import AdminLowInventorySkeleton from "@/components/feedback/loading/AdminLowInventorySkeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";

const AdminLowInventory = ({
  lowStockProducts,
  analyticsLoading,
  isError,
  refetch,
  isFetching,
}) => {
  return (
    <div
      className="
      relative

      overflow-hidden

      rounded-[28px]

      border border-black/[0.045]

      bg-white/[0.88]
      backdrop-blur-xl

      shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
    "
    >
      <div
        className="
        absolute inset-0

        bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]

        pointer-events-none
      "
      />

      <div
        className="
        relative z-10

        flex items-center justify-between

        px-7
        py-6
      "
      >
        <div>
          <p
            className="
            text-[10px]
            font-medium
            tracking-[0.16em]

            uppercase

            text-black/30
          "
          >
            Low Inventory
          </p>

          <p
            className="
            mt-[6px]

            text-[14px]
            font-medium
            tracking-[-0.02em]

            text-black/90
          "
          >
            Stock Attention
          </p>
        </div>
        {!analyticsLoading && !isError && (
          <p
            className="
        text-[12px]
        tracking-[0.01em]
        text-black/35
        "
          >
            {lowStockProducts.length} Products
          </p>
        )}
      </div>

      <div
        className="
        h-px w-full

        bg-gradient-to-r
        from-transparent
        via-black/[0.05]
        to-transparent
      "
      />

      <div className="relative z-10 divide-y divide-black/[0.03]">
        {analyticsLoading || isFetching ? (
          Array.from({ length: 5 }).map((_, i) => (
            <AdminLowInventorySkeleton key={i} />
          ))
        ) : isError ? (
          <ErrorState
            refetch={refetch}
            isFetching={isFetching}
            title={" Failed to load inventory alerts"}
            description={
              "Something went wrong while loading low stock data. Please try again later."
            }
          />
        ) : lowStockProducts === 0 ? (
          <EmptyState
            title={" No low stock products"}
            description={
              "All inventory levels are healthy right now. Low stock alerts will appear here automatically."
            }
          />
        ) : (
          lowStockProducts.map((item) => (
            <div
              key={`${item._id}-${item.size}`}
              className="
              group

              px-7
              py-6

              flex items-center gap-5

              hover-supported:hover:bg-black/[0.015]

              transition-all duration-150
            "
            >
              <div className="w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={`${item.image}&w=60&q=75&auto=format`}
                  srcSet={`
    ${item.image}&w=60&q=75&auto=format 1x,
    ${item.image}&w=120&q=75&auto=format 2x
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

                  text-[14px]
                  font-medium
                  tracking-[-0.015em]

                  text-black/85
                "
                >
                  {item.name}
                </p>

                <p
                  className="
                  mt-[7px]

                  text-[11px]

                  text-black/35
                "
                >
                  Size {item.size}
                </p>
              </div>

              <div
                className="
                shrink-0

                rounded-full

                bg-red-500/[0.08]

                px-3
                py-[7px]

                text-[10px]
                font-semibold
                tracking-[0.08em]

                uppercase

                text-red-600
              "
              >
                {item.stock} Left
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(AdminLowInventory);
