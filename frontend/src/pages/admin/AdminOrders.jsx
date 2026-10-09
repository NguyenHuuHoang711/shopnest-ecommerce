import { useGetAdminOrdersQuery } from "@/redux/api/apiSlice";
import React, { useEffect, useState } from "react";
import AdminOrdersSkeleton from "@/components/feedback/loading/AdminOrdersSkeleton";
import AdminOrdersList from "@/features/admin/components/orders/AdminOrdersList";
import AdminOrdersFilter from "@/features/admin/components/orders/AdminOrdersFilter";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useSearchParams } from "react-router-dom";
import ErrorState from "@/components/feedback/error/ErrorState";
import AdminEmptyState from "@/components/feedback/empty-state/AdminEmptyState";

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

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());

    if (statusFilter !== "All") params.set("status", statusFilter);

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setSearchParams(params, { replace: true });
  }, [page, statusFilter, debouncedSearch, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, debouncedSearch, statusFilter]);

  const {
    data,
    isLoading: loadingOrders,
    isError: loadingError,
    refetch,
    isFetching,
  } = useGetAdminOrdersQuery({
    page,
    limit: 8,
    statusFilter: statusFilter,
    search: debouncedSearch,
  });
  const orders = data?.orders;
  const totalPages = data?.pages;

  const hasFilters = debouncedSearch.trim() !== "" || statusFilter !== "All";

  return (
    <div className="space-y-8 animate-fadeIn h-screen ">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div
              className="
          h-[6px]
          w-[6px]
          rounded-full
          bg-black/80
        "
            />

            <p
              className="
          text-[10px]
          font-medium
          tracking-[0.18em]
          uppercase
          text-black/35
        "
            >
              Dashboard
            </p>
          </div>

          <h1
            className="
        mt-4
        text-[32px]
        leading-none
        font-semibold
        tracking-[-0.06em]
        text-black/90
      "
          >
            Orders
          </h1>

          <p
            className="
        mt-3
        text-[13px]
        text-black/40
      "
          >
            Manage and track all customer orders
          </p>
        </div>

        <AdminOrdersFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

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
          ) : loadingError ? (
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
            <AdminEmptyState
              orders
              compact
              hasFilters={hasFilters}
              filtersTitle={"No matching orders"}
              filtersDescription={"Try adjusting your search or filters."}
              emptyTitle={"No orders yet"}
              emptyDescription={
                "Orders will appear here once customers begin purchasing."
              }
              setSearch={setSearch}
              setStatusFilter={setStatusFilter}
            />
          ) : (
            <div className="space-y-8 p-5">
              {orders?.map((order) => (
                <AdminOrdersList
                  key={order._id}
                  order={order}
                  statusStyles={statusStyles}
                  formatCurrency={formatCurrency}
                  debouncedSearch={debouncedSearch}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!debouncedSearch && totalPages > 1 && (
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages || 1}
        />
      )}
    </div>
  );
};

export default AdminOrders;
