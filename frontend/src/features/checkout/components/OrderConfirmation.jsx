import React, { memo, useEffect } from "react";
import { useGetOrderByIdQuery } from "@/redux/api/apiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cart/cartSlice";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import ErrorState from "@/components/feedback/error/ErrorState";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Skeleton from "@/components/ui/skeleton";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const orderIdFromStorage = localStorage.getItem("lastOrderId");

  const { data, isLoading, isError, refetch, isFetching } =
    useGetOrderByIdQuery(orderIdFromStorage, {
      skip: !token || !orderIdFromStorage,
    });
  const userOrder = data?.order;
  const userAddress = userOrder?.shippingAddressId;
  const userPaymentDetails = userOrder?.paymentId;
  const orderId = userOrder?.orderId ?? "N/A";
  const orderDateRaw = userOrder?.createdAt;

  const formattedDate = orderDateRaw
    ? new Date(orderDateRaw).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const orderItems = userOrder?.items ?? [];
  const subtotalAmount = userOrder?.subtotalAmount ?? 0;
  const taxAmount = userOrder?.taxAmount ?? 0;
  const discountedAmount = userOrder?.coupon?.discountAmount ?? 0;
  const finalAmount = userOrder?.finalAmount ?? 0;

  useEffect(() => {
    const orderPlaced = localStorage.getItem("orderJustPlaced");

    if (orderPlaced !== "true") {
      navigate("/products");
      return;
    }

    if (!isLoading && userOrder) {
      dispatch(clearCart());
      localStorage.removeItem("cartItems");

      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("shippingAddressId");

      localStorage.removeItem("currentStep");
      localStorage.removeItem("orderJustPlaced");
      localStorage.removeItem("lastOrderId");

      localStorage.removeItem("coupon");
      localStorage.removeItem("orderNote");
    }
  }, [navigate, isLoading, userOrder]);

  useEffect(() => {
    if (userOrder) {
      const timer = setTimeout(() => {
        navigate("/products");
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [userOrder, navigate]);

  if (isLoading || isFetching) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 animate-pulse space-y-16">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Skeleton className="w-14 h-14 rounded-full" />
          </div>

          <div className="h-10 w-64 mx-auto rounded-full" />

          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-4 w-96 max-w-full rounded-full" />
            <Skeleton className="h-4 w-72 rounded-full" />
          </div>

          <Skeleton className="h-3 w-40 mx-auto rounded-full" />
          <Skeleton className="h-3 w-32 mx-auto rounded-full" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-4 w-32 rounded-full" />

          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 rounded-full" />
                  <Skeleton className="h-3 w-28 rounded-full" />
                </div>

                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          ))}

          <div className="flex justify-between pt-4 border-t">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-10">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-4 w-40 rounded-full" />
          </div>
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-12 w-52" />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load order"
        description="We couldn't retrieve your order details right now. Please try again."
      />
    );

  if (!isLoading && !isError && !userOrder) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find the order you're looking for."
        showAction
        actionText="Continue Shopping"
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-16 space-y-16">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white text-xl">
            ✓
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light tracking-wide">
          Order Confirmed
        </h1>

        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Thank you for your purchase. Your order has been successfully placed.
          You’ll receive a confirmation email shortly.
        </p>

        <p className="text-xs text-gray-400 tracking-wide">
          Order ID <span className="text-black/70 font-medium">{orderId}</span>
        </p>
        <p className="text-xs text-gray-400">Placed on {formattedDate}</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm tracking-[0.3em] uppercase text-gray-400">
          Order Details
        </h2>

        <div className="space-y-5">
          {orderItems.map((item) => (
            <div key={item._id} className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">
                  Qty {item.quantity} × {formatCurrency(item.basePrice)}
                </p>
              </div>

              <p className="text-sm font-medium">
                {formatCurrency(item.basePrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t pt-6 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotalAmount)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Tax</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>

        {discountedAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discountedAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>

        <div className="flex justify-between text-lg font-medium pt-4 border-t">
          <span>Total</span>
          <span>{formatCurrency(finalAmount)}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-10 text-sm">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            Delivery Address
          </p>

          <div className="text-gray-600 space-y-1">
            <p className="font-medium text-black">{userAddress?.fullName}</p>

            <p>
              {userAddress?.address1}
              {userAddress?.address2 && `, ${userAddress.address2}`}
            </p>

            {userAddress?.landmark && (
              <p className="text-gray-400">{userAddress.landmark}</p>
            )}

            <p>
              {userAddress?.city}, {userAddress?.state} -{" "}
              {userAddress?.postalCode}
            </p>

            <p className="text-gray-500">{userAddress?.phone}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            Payment Method
          </p>

          <p className="text-gray-600">
            Card ending in{" "}
            <span className="font-medium text-black">
              {userPaymentDetails?.last4}
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <PrimaryButton onClick={() => navigate("/products")}>
          Continue Shopping
        </PrimaryButton>
      </div>
    </div>
  );
};

export default memo(OrderConfirmation);
