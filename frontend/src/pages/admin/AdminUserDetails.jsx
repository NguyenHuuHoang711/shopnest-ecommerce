import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetAdminUserDetailsQuery } from "@/redux/api/apiSlice";
import AdminOrdersEmpty from "@/components/feedback/empty-state/AdminEmptyState";
import AdminOrdersList from "@/features/admin/components/orders/AdminOrdersList";
import AdminUserDetailsSkeleton from "@/components/feedback/loading/AdminUserDetailsSkeleton";
import PaginationComponent from "@/components/common/PaginationComponent";
import { ArrowLeft } from "lucide-react";
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

const infoCard =
  "rounded-[28px] border border-black/[0.045] bg-white/[0.78] backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-150 ease-out hover-supported:hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { data, isLoading, isError, refetch, isFetching } =
    useGetAdminUserDetailsQuery({
      id,
      page,
      limit: 8,
    });

  const user = data?.user;
  const orders = data?.orders || [];
  const totalSpent = data?.stats?.totalSpent;
  const totalPages = data?.stats?.totalPages;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", page.toString());
    }

    setSearchParams(params, { replace: true });
  }, [page, setSearchParams]);

  if (isLoading || isFetching) {
    return <AdminUserDetailsSkeleton infoCard={infoCard} />;
  }

  if (isError || !user) {
    return (
      <>
        <ErrorState
          refetch={refetch}
          isFetching={isFetching}
          title={"Unable to load user"}
          description={
            "The customer information could not be retrieved right now."
          }
        />
      </>
    );
  }

  return (
    <div className="animate-fadeIn">
      <button
        onClick={() => navigate(-1)}
        className="
        inline-flex
        items-center
        gap-2
    
        text-[13px]
        font-medium
    
        text-black/70
        active:scale-[0.985]
    
        transition-colors
        duration-150
    
        hover-supported:group-hover:text-black
        mb-3
      "
      >
        <ArrowLeft size={13} />
        Back
      </button>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="
                w-16 h-16
                rounded-full
                bg-black
                text-white
                flex items-center justify-center
                text-xl font-medium
                shrink-0
              "
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <div className="space-y-1">
              <h1
                className="
                        text-[34px]
        leading-none
        font-semibold
        tracking-[-0.06em]
        text-black/90"
              >
                {user.name}
              </h1>

              <p
                className="max-w-[520px]
        text-[13px]
        leading-relaxed
        text-black/45"
              >
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <span
              className={`
            inline-flex items-center justify-center
            px-3 py-1.5
            rounded-full
            text-[11px]
            font-medium
            tracking-wide
            whitespace-nowrap
            ${
              user.role === "Admin"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }
          `}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={infoCard}>
            <p
              className="mb-5
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35"
            >
              Total Orders
            </p>

            <div className="space-y-1.5">
              <p
                className="  text-3xl
          font-medium
          tracking-[-0.01em]
          text-black/85"
              >
                {orders.length}
              </p>

              <p
                className="text-[13px]
          text-black/35"
              >
                Orders placed by this user
              </p>
            </div>
          </div>

          <div className={infoCard}>
            <p
              className="mb-5
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35"
            >
              Total Spent
            </p>

            <div className="space-y-1.5">
              <p className="text-3xl font-medium tracking-[-0.01em] text-black/85">
                {formatCurrency(totalSpent)}
              </p>

              <p
                className="text-[13px]
          text-black/35"
              >
                Lifetime customer value
              </p>
            </div>
          </div>

          <div className={infoCard}>
            <p
              className="mb-5
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35"
            >
              Joined
            </p>

            <div className="space-y-1.5">
              <p className="text-3xl font-medium tracking-[-0.01em] text-black/85">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <p
                className="text-[13px]
          text-black/35"
              >
                Customer registration date
              </p>
            </div>
          </div>
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
                Order History
              </p>

              <p
                className="
                  mt-[6px]
                  text-[10px]
                  font-medium
                  tracking-[0.14em]
                  uppercase
                  text-black/32
                "
              >
                Customer Purchases
              </p>
            </div>

            <div
              className="
                h-[6px]
                w-[6px]
                rounded-full
                bg-black/18
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
            {orders?.length === 0 ? (
              <AdminOrdersEmpty
                compact
                search={""}
                emptyTitle="No orders yet"
                emptyDescription="This customer hasn't placed any orders yet."
              />
            ) : (
              <div className="space-y-8 p-5">
                {orders?.map((order) => (
                  <AdminOrdersList
                    key={order._id}
                    userName={user.name}
                    userEmail={user.email}
                    order={order}
                    statusStyles={statusStyles}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {!isError && totalPages > 1 && (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserDetails;
