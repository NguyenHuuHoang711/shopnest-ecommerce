import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "@/redux/api/apiSlice";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PaginationComponent from "@/components/common/PaginationComponent";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import Skeleton from "@/components/ui/skeleton";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const statusStyles = {
  Delivered: "bg-green-50 text-green-600 ring-green-500/10",
  Cancelled: "bg-red-50 text-red-600 ring-red-500/10",
  Shipped: "bg-blue-50 text-blue-600 ring-blue-500/10",
  "Out for Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
  Processing: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
  Placed: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
};

const Orders = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const setPage = (newPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (newPage === 1) next.delete("page");
        else next.set("page", String(newPage));

        return next;
      },
      { replace: true },
    );
  };

  const {
    data,
    isLoading: loadingOrders,
    isError,
    refetch,
    isFetching,
  } = useGetOrderDetailsQuery(
    { page, limit: 8 },
    {
      skip: !token,
    },
  );
  const orders = data?.orders || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="bg-white text-black min-h-[60vh] animate-fadeIn">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-8">
        <Breadcrumbs />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-10 pt-6">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide mb-8">
          Orders
          {!loadingOrders && <span> ({data?.totalOrders})</span>}
        </h1>

        <div className="space-y-6">
          {loadingOrders || isFetching ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="
            border border-gray-100
            rounded-xl
            p-5
          "
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16 rounded-full " />
                      <Skeleton className="h-4 w-36 rounded-full " />
                    </div>

                    <div className="space-y-2 flex flex-col items-end">
                      <Skeleton className="h-3 w-10  rounded-full " />
                      <Skeleton className="h-4 w-24  rounded-full " />
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-hidden pb-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="
                  w-14 h-14
                  shrink-0 rounded-full
                "
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-24 rounded-full " />

                    <Skeleton
                      className="
                h-7
                w-[106px]
                rounded-full
              "
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              refetch={refetch}
              isFetching={isFetching}
              title="Unable to load orders"
              description="We couldn't load your orders right now. Please try again."
            />
          ) : !loadingOrders && !orders.length ? (
            <EmptyState
              title="No orders yet"
              description="Your orders will appear here once you make a purchase."
              showAction
              actionText="Start Shopping"
              onAction={() => navigate("/products")}
            />
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order.orderId}`)}
                className="border border-black/[0.05] rounded-lg p-5 cursor-pointer 
hover-supported:hover:border-black/[0.08]
hover-supported:hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]
transition-all duration-150 group active:scale-[0.995]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-sm font-medium">{order.orderId}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p
                      className="text-[15px]
font-medium
tracking-[-0.01em]
text-black/90"
                    >
                      {formatCurrency(order.finalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item, i) => {
                    const img =
                      item.productId?.images?.[0] || "/placeholder.png";

                    return (
                      <div
                        key={i}
                        className="w-14 h-14 shrink-0 overflow-hidden "
                      >
                        <img
                          src={`${img}&w=60&q=75&auto=format`}
                          srcSet={`
                        ${img}&w=60&q=75&auto=format 1x,
                        ${img}&w=120&q=75&auto=format 2x
                        `}
                          sizes="56px"
                          loading="lazy"
                          decoding="async"
                          draggable="false"
                          fetchPriority="low"
                          width={56}
                          height={56}
                          alt={item.productId?.name || "Product image"}
                          className="
    h-full
    w-full
    object-cover
    will-change-transform
    transition-transform duration-150 ease-out
    hover-supported:group-hover:scale-[1.04]
  "
                        />
                      </div>
                    );
                  })}

                  {order.items?.length > 4 && (
                    <div
                      className="w-14 h-16 flex items-center justify-center text-xs text-gray-500 border border-black/5
bg-black/[0.02]
rounded-none"
                    >
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="text-black/45">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>

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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!isError &&
        !loadingOrders &&
        orders?.length > 0 &&
        data?.totalPages > 1 && (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={data?.totalPages || 1}
          />
        )}
    </div>
  );
};

export default Orders;
