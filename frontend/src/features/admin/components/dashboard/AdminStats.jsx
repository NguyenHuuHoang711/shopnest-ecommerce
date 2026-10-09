import React, { memo } from "react";
import { useGetAdminStatsQuery } from "@/redux/api/apiSlice";
import Skeleton from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState";

const AdminStats = ({ formatCurrency }) => {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAdminStatsQuery();

  const revenue = data?.revenue;
  const totalOrders = data?.totalOrders;
  const totalUsers = data?.totalUsers;
  const totalProducts = data?.totalProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {isLoading || isFetching ? (
        [
          { title: "Revenue", width: "w-24" },
          { title: "Orders", width: "w-16" },
          { title: "Users", width: "w-20" },
          { title: "Products", width: "w-14" },
        ].map((item, i) => (
          <div
            key={i}
            className="
            relative
            overflow-hidden
            h-[132px]
            rounded-[28px]
            border border-black/[0.045]
            bg-white/[0.88]
            backdrop-blur-xl
            px-7
            py-6
            shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
            animate-pulse
          "
          >
            <div className="relative z-10">
              <Skeleton
                className="
                h-[10px]
                w-20
                rounded-full
                bg-black/[0.05]
              "
              />

              <Skeleton
                className={`
                mt-6
                rounded-full
                h-[30px]
                bg-black/[0.055]

                ${item.width}
              `}
              />
            </div>
          </div>
        ))
      ) : isError ? (
        <ErrorState
          compact
          refetch={refetch}
          isFetching={isFetching}
          title={"Unable to load dashboard"}
          description={
            "We couldn't load your dashboard statistics. Please try again."
          }
        />
      ) : (
        [
          { label: "Revenue", value: revenue },
          { label: "Orders", value: totalOrders },
          { label: "Users", value: totalUsers },
          { label: "Products", value: totalProducts },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
              group
              relative

              overflow-hidden

              h-[132px]

              rounded-[28px]

              border border-black/[0.045]

              bg-white/[0.88]
              hover-supported:hover:bg-white/[0.92]
              backdrop-blur-xl

              px-7
              py-6

              shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
              hover-supported:hover:shadow-[0_2px_6px_rgba(0,0,0,0.02),0_28px_80px_rgba(0,0,0,0.06)]

              transition-all duration-150 [transition-timing-function:cubic-bezier(.22,1,.36,1)]
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
                absolute inset-0

                opacity-0

                hover-supported:group-hover:opacity-100

                transition-opacity duration-500

                bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_62%)]

                pointer-events-none
              "
            />

            <div className="relative z-10">
              <p
                className="
                  text-[10px]
                  font-medium
                  tracking-[0.16em]

                  uppercase

                  text-black/32
                "
              >
                {stat.label}
              </p>

              <p
                className="
                  mt-7

                  text-[34px]
                  leading-none

                  font-semibold
                  tracking-[-0.055em]

                  text-black/90
                "
              >
                {stat.label === "Revenue"
                  ? `${formatCurrency(stat.value)}`
                  : stat.value}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default memo(AdminStats);
