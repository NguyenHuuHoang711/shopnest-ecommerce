import React from "react";
import {
  useGetDashboardAnalyticsQuery,
  useGetRecentOrdersQuery,
} from "@/redux/api/apiSlice";

import AdminStats from "@/features/admin/components/dashboard/AdminStats";
import AdminOrdersSkeleton from "@/components/feedback/loading/AdminOrdersSkeleton";
import AdminOrdersEmpty from "@/components/feedback/empty-state/AdminEmptyState";
import AdminOrdersList from "@/features/admin/components/orders/AdminOrdersList";
import AdminLowInventory from "@/features/admin/components/dashboard/AdminLowInventory";
import AdminTopProducts from "@/features/admin/components/dashboard/AdminTopProducts";
import ErrorState from "@/components/feedback/error/ErrorState";

const statusStyles = {
  Delivered: "bg-green-50 text-green-600 ring-green-500/10",
  Cancelled: "bg-red-50 text-red-600 ring-red-500/10",
  Shipped: "bg-blue-50 text-blue-600 ring-blue-500/10",
  "Out for Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
  Processing: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
  Placed: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
};

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const Admin = () => {
  const {
    data,
    isLoading: loadingOrders,
    isError: ordersError,
    refetch,
    isFetching,
  } = useGetRecentOrdersQuery();

  const orders = data?.orders;

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: analyticsRefetch,
    isFetching: fetchingAnalytics,
  } = useGetDashboardAnalyticsQuery();

  const lowStockProducts = analytics?.lowStockProducts || [];

  const topProducts = analytics?.topProducts || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <AdminStats formatCurrency={formatCurrency} />

      <div
        className="
        
    relative
    overflow-hidden
    rounded-[28px]
    border border-black/[0.045]
    bg-white/[0.86]
    backdrop-blur-xl
    shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
    transition-all duration-500
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
      absolute -top-32 left-1/2
      h-56 w-56
      -translate-x-1/2
      rounded-full
      bg-white/30
      blur-3xl
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
          text-[15px]
          font-medium
          tracking-[-0.025em]
          text-black/90
        "
            >
              Recent Orders
            </p>

            <p
              className="
          mt-[6px]
          text-[10px]
          font-medium
          tracking-[0.14em]
          uppercase
          text-black/30
        "
            >
              Latest Transactions
            </p>
          </div>

          <div
            className="
        h-[6px]
        w-[6px]
        rounded-full
        bg-black/20
      "
          />
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

        <div className="relative z-10">
          {loadingOrders || isFetching ? (
            <div className="space-y-8 p-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <AdminOrdersSkeleton key={i} />
              ))}
            </div>
          ) : ordersError ? (
            <ErrorState
              compact
              refetch={refetch}
              isFetching={isFetching}
              title={"Failed to load orders"}
              description={
                "Something went wrong while loading the order feed.Please try again later."
              }
            />
          ) : orders?.length === 0 ? (
            <AdminOrdersEmpty compact search={""} emptyTitle={"No Recent Orders"} emptyDescription={"Your Recent Orders Will Appear Here"} />
          ) : (
            <div className="space-y-8 p-5">
              {orders?.map((order) => (
                <AdminOrdersList
                  key={order._id}
                  order={order}
                  statusStyles={statusStyles}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AdminLowInventory
          lowStockProducts={lowStockProducts}
          analyticsLoading={analyticsLoading}
          isError={analyticsError}
          refetch={refetch}
          isFetching={fetchingAnalytics}
        />
        <AdminTopProducts
          topProducts={topProducts}
          analyticsLoading={analyticsLoading}
          isError={analyticsError}
          refetch={analyticsRefetch}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default Admin;
