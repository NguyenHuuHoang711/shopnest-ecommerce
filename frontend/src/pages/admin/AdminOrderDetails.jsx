import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAdminOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/apiSlice";
import { toast } from "@/hooks/use-toast";
import OrderDetailsSkeleton from "@/components/feedback/loading/OrderDetailsSkeleton";
import OrderDetailsCards from "@/features/admin/components/orders/order-details/OrderDetailsCards";
import OrderDetailsHeader from "@/features/admin/components/orders/order-details/OrderDetailsHeader";
import OrderDetailsItems from "@/features/admin/components/orders/order-details/OrderDetailsItems";
import OrderDetailsOrderControl from "@/features/admin/components/orders/order-details/OrderDetailsOrderControl";
import ErrorState from "@/components/feedback/error/ErrorState";
import { ArrowLeft } from "lucide-react";

const infoCard =
  "rounded-[28px] border border-black/[0.045] bg-white/[0.78] backdrop-blur-xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-150 ease-out hover-supported:hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError, refetch, isFetching } =
    useGetAdminOrderDetailsQuery(id);
  const order = data?.order;

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const [updateStatus, { isLoading: updatingStatus }] =
    useUpdateOrderStatusMutation();

  const handleUpdate = async () => {
    if (updatingStatus || !order) return;

    const allowedStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    const statusFlow = {
      Placed: 0,
      Processing: 1,
      Shipped: 2,
      "Out for Delivery": 3,
      Delivered: 4,
    };

    try {
      if (!allowedStatuses.includes(status)) {
        toast({
          variant: "destructive",
          title: "Invalid status selected",
        });

        return;
      }

      if (status === order.status) {
        toast({
          title: "Order already has this status",
        });

        return;
      }

      if (order.status === "Delivered") {
        toast({
          variant: "destructive",
          title: "Delivered orders cannot be updated",
        });

        return;
      }

      if (order.status === "Cancelled") {
        toast({
          variant: "destructive",
          title: "Cancelled orders cannot be updated",
        });

        return;
      }

      if (
        status !== "Cancelled" &&
        statusFlow[status] < statusFlow[order.status]
      ) {
        toast({
          variant: "destructive",
          title: "Cannot move order backwards",
        });

        return;
      }

      if (
        status === "Cancelled" &&
        ["Shipped", "Out for Delivery", "Delivered"].includes(order.status)
      ) {
        toast({
          variant: "destructive",
          title: "This order can no longer be cancelled",
        });

        return;
      }

      await updateStatus({
        id,
        status,
      }).unwrap();

      toast({
        title: "Status updated",
      });
      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
      });
    }
  };

  const orderFlow = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const currentIndex = orderFlow.indexOf(order?.status);
  const availableStatuses = [...orderFlow.slice(currentIndex), "Cancelled"];

  if (isLoading || isFetching) {
    return <OrderDetailsSkeleton />;
  }

  if (isError || !order) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title={"Failed to load order"}
        description={
          "Something went wrong while loading the order details. Please try again later."
        }
      />
    );
  }

  return (
    <div className="animate-fadeIn ">
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
      <div className="space-y-8 ">
        <OrderDetailsHeader order={order} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <OrderDetailsCards order={order} infoCard={infoCard} />

          <div className="lg:col-span-2 space-y-8">
            <div
              className="
    overflow-hidden
    rounded-[28px]
    border border-black/[0.045]
    bg-white/[0.78]
    backdrop-blur-xl
    shadow-[0_20px_60px_rgba(0,0,0,0.04)]
  "
            >
              <div
                className="
      border-b border-black/[0.045]
      px-6
      py-5
      text-[11px]
      uppercase
      tracking-[0.18em]
      text-black/35
    "
              >
                Order Items
              </div>

              <div className="divide-y divide-black/[0.045]">
                {order?.items?.map((item) => (
                  <OrderDetailsItems
                    key={item._id}
                    item={item}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            </div>

            <div
              className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 
        shadow-[0_20px_60px_rgba(0,0,0,0.04)] space-y-4"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span className="text-gray-900">
                  {formatCurrency(order?.subtotalAmount)}
                </span>
              </div>

              {order?.coupon?.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>

                  <span className="text-green-600 font-medium">
                    - {formatCurrency(order?.coupon?.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>

                <span className="text-gray-900">
                  {formatCurrency(order?.taxAmount)}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">Total</span>

                <span className="text-[34px] font-[650] tracking-[-0.03em] leading-none text-gray-900">
                  {formatCurrency(order?.finalAmount)}
                </span>
              </div>
            </div>

            <OrderDetailsOrderControl
              status={status}
              setStatus={setStatus}
              handleUpdate={handleUpdate}
              order={order}
              availableStatuses={availableStatuses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
