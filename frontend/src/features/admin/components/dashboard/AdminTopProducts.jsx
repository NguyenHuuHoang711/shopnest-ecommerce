import React, { memo } from "react";
import AdminTopProductsSkeleton from "@/components/feedback/loading/AdminProductsSkeleton";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import ErrorState from "@/components/feedback/error/ErrorState";

const AdminTopProducts = ({
  topProducts,
  analyticsLoading,
  isError,
  refetch,
  isFetching,
}) => {
  const hasTopProducts = topProducts?.some((p) => p.sold > 0);

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
            Top Selling
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
            Best Performers
          </p>
        </div>

        <p
          className="
          text-[12px]

          text-black/40
        "
        >
          Best Sellers
        </p>
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
            <AdminTopProductsSkeleton key={i} />
          ))
        ) : isError ? (
          <ErrorState
            refetch={refetch}
            isFetching={isFetching}
            title={"Failed to load top products"}
            description={
              "Something went wrong while loading top products data. Please try again later."
            }
          />
        ) : !hasTopProducts ? (
          <EmptyState
            title={" No sales yet"}
            description={
              " Sales analytics will appear here once products start generating orders."
            }
          />
        ) : (
          topProducts.map((product, index) => (
            <div
              key={product._id}
              className="
              group

              px-7
              py-6

              flex items-center gap-5

              hover-supported:hover:bg-black/[0.015]

              transition-all duration-150
            "
            >
              <div
                className="
                h-8 w-8

                shrink-0

                rounded-full

                bg-black/[0.92]

                flex items-center justify-center

                text-[11px]
                font-semibold

                text-white
              "
              >
                #{index + 1}
              </div>

              <div className="w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={`${product?.images?.[0]}&w=60&q=75&auto=format`}
                  srcSet={`
    ${product?.images?.[0]}&w=60&q=75&auto=format 1x,
    ${product?.images?.[0]}&w=120&q=75&auto=format 2x
  `}
                  sizes="56px"
                  alt={product.name}
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
                  {product.name}
                </p>

                <p
                  className="
                  mt-[7px]

                  text-[11px]

                  text-black/35
                "
                >
                  {product.category}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p
                  className="
                  text-[15px]
                  font-semibold
                  tracking-[-0.03em]

                  text-black/90
                "
                >
                  {product.sold}
                </p>

                <p
                  className="
                  mt-[5px]

                  text-[10px]
                  font-medium
                  tracking-[0.12em]

                  uppercase

                  text-black/30
                "
                >
                  Sold
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(AdminTopProducts);
