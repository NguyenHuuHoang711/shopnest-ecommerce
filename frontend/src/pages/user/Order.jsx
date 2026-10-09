import React, { lazy, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useDeleteReviewMutation,
  useGetMyReviewsQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/redux/api/apiSlice";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { toast } from "@/hooks/use-toast";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import OrderSkeleton from "@/components/feedback/loading/OrderSkeleton";
import OrderCard from "@/features/orders/components/OrderCard";
import OrderTimeline from "@/features/orders/components/OrderTimeline";
import OrderStatus from "@/features/orders/components/OrderStatus";
import TextButton from "@/components/ui/buttons/TextButton";
const ConfirmModal = lazy(() => import("@/components/modals/ConfirmModal"));
const ReviewModal = lazy(() => import("@/components/modals/ReviewModal"));
const DeleteReviewDialog = lazy(
  () => import("@/components/modals/DeleteReviewDialog"),
);

const statusStyles = {
  Delivered: "bg-green-50 text-green-600 ring-green-500/10",
  Cancelled: "bg-red-50 text-red-600 ring-red-500/10",
  Shipped: "bg-blue-50 text-blue-600 ring-blue-500/10",
  "Out for Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
  Processing: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
  Placed: "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
};

const orderSteps = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const Order = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [content, setContent] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    useGetOrderByIdQuery(id, {
      skip: !token || !id,
    });
  const order = data?.order;
  let discountAmount = order?.coupon?.discountAmount;

  const groupedProducts = Object.values(
    (order?.items || []).reduce((acc, item) => {
      const key = item.productId._id;

      if (!acc[key]) {
        acc[key] = {
          productId: item.productId,
          totalQuantity: 0,
          sizes: [],
          items: [],
        };
      }

      acc[key].totalQuantity += item.quantity;

      acc[key].sizes.push({
        size: item.size,
        quantity: item.quantity,
      });

      acc[key].items.push(item);

      return acc;
    }, {}),
  );

  const { data: reviews } = useGetMyReviewsQuery(undefined, {
    skip: !token,
  });
  const myReviews = reviews?.reviews || [];

  const openReview = (product) => {
    const existing = myReviews.find((r) => r.product._id === product._id);

    if (existing) {
      setRating(existing.rating);
      setContent(existing.content);
    } else {
      setRating(0);
      setContent("");
    }

    setReviewProduct({
      ...product,
      existingReview: existing || null,
    });
  };

  const [deleteReview, { isLoading: deletingReview }] =
    useDeleteReviewMutation();

  const handleDelete = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteReview({
        productId: reviewToDelete.product._id,
        reviewId: reviewToDelete._id,
      }).unwrap();

      toast({ title: "Review deleted" });

      setReviewToDelete(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to delete review",
      });
    }
  };

  const [cancelOrder, { isLoading: cancellingOrder }] =
    useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (cancellingOrder) {
      return;
    }
    try {
      await cancelOrder(id).unwrap();

      toast({ title: "Order cancelled" });
      setCancelOpen(false);
    } catch (err) {
      console.log("CANCEL ERROR:", err);

      toast({
        variant: "destructive",
        title: "Failed to cancel order",
      });
    }
  };

  if (isLoading || isFetching) {
    return <OrderSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load order"
        description="We couldn't load this order right now. Please try again."
      />
    );
  }

  if (!isLoading && !isError && !order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find the order you're looking for."
        showAction
        actionText="View Orders"
        onAction={() => navigate("/orders")}
      />
    );
  }

  return (
    <>
      <div className="bg-white text-black min-h-[60vh] animate-fadeIn">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Breadcrumbs />
        </div>

        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-10">
          <h1 className="text-2xl sm:text-3xl font-light mb-8">
            Order Details
          </h1>
          <div className="mb-10 text-sm">
            <OrderStatus
              order={order}
              formatDate={formatDate}
              statusStyles={statusStyles}
            />
            <div className="mt-10">
              <div
                className="
      flex
      flex-col
      md:flex-row

      md:items-start
      justify-between

      gap-8
      md:gap-0

      relative
    "
              >
                {[
                  "Placed",
                  "Processing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                ].map((step, i) => {
                  const currentIndex = orderSteps.indexOf(order.status);

                  const isActive = currentIndex >= i;
                  const isCurrent = currentIndex === i;
                  const isCancelled = order.status === "Cancelled";

                  return (
                    <OrderTimeline
                      key={i}
                      i={i}
                      isActive={isActive}
                      isCancelled={isCancelled}
                      isCurrent={isCurrent}
                      step={step}
                      order={order}
                    />
                  );
                })}
              </div>
            </div>
            {order.status === "Cancelled" && (
              <p className="text-xs text-red-500 mt-2">
                This order was cancelled and items were restocked
              </p>
            )}
            <div className="space-y-2">
              {![
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
              ].includes(order.status) && (
                <div className="mt-4 flex justify-end">
                  <TextButton
                    className="
    text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
  "
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancel Order
                  </TextButton>
                </div>
              )}

              {order.status !== "Delivered" &&
                order.status !== "Cancelled" &&
                order.deliveryDate && (
                  <p className="flex justify-between">
                    <span className="text-black/40">
                      {order.status === "Delivered"
                        ? "Delivered On"
                        : "Estimated Delivery"}
                    </span>

                    <span className="font-medium">
                      {new Date(order.deliveryDate).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        },
                      )}
                    </span>
                  </p>
                )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {groupedProducts.map((item) => {
              const existingReview = myReviews.find(
                (r) => r.product._id === item.productId._id,
              );

              const img = item.productId?.images?.[0] || "/placeholder.png";

              return (
                <OrderCard
                  key={item.productId._id}
                  item={item}
                  img={img}
                  order={order}
                  openReview={openReview}
                  setReviewToDelete={setReviewToDelete}
                  existingReview={existingReview}
                />
              );
            })}
          </div>

          <div className="mt-12 border-t pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-black/40">Subtotal</span>
              <span>{formatCurrency(order.subtotalAmount)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-black/40">Tax</span>
              <span className="text-black/80">
                {formatCurrency(order.taxAmount)}
              </span>
            </div>

            <div className="flex justify-between text-base font-medium pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <ReviewModal
          reviewProduct={reviewProduct}
          setReviewProduct={setReviewProduct}
          rating={rating}
          setRating={setRating}
          hover={hover}
          setHover={setHover}
          content={content}
          setContent={setContent}
        />
      </Suspense>

      <Suspense fallback={null}>
        <DeleteReviewDialog
          reviewToDelete={reviewToDelete}
          setReviewToDelete={setReviewToDelete}
          onConfirm={handleDelete}
          isLoading={deletingReview}
          title={"Delete Review"}
          description={"Your review will be deleted"}
          confirmText={"Delete Review"}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ConfirmModal
          openModal={cancelOpen}
          setOpenModal={setCancelOpen}
          onConfirm={handleCancelOrder}
          isLoading={cancellingOrder}
          title={"Cancel Order?"}
          description={"Your order will be cancelled."}
          confirmText={"Cancel Order"}
        />
      </Suspense>
    </>
  );
};

export default Order;
