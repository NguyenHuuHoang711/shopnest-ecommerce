import Skeleton from "@/components/ui/skeleton";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const OrderSummary = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [savedNote, setSavedNote] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const coupon = localStorage.getItem("coupon");
    if (coupon) {
      const { code, discount } = JSON.parse(coupon);
      setAppliedCoupon(code);
      setDiscount(discount);
    }

    const note = localStorage.getItem("orderNote");
    if (note) {
      setSavedNote(note);
    }
  }, []);

  const estimateDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);

    if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }

    return `${date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}`;
  };

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );

  const discountedTotal = totalPrice - totalPrice * discount;

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-light tracking-wide">Order Summary</h2>

      <div className="space-y-5">
        {cartItems.map((item) => (
          <div key={item._id + item.size} className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-black/5">
              {!loaded && (
                <Skeleton className="absolute inset-0 h-full w-full" />
              )}
              <img
                src={`${item.images[0]}&w=80&q=75&auto=format`}
                alt={item.name}
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                loading="lazy"
                decoding="async"
                draggable="false"
                width={56}
                height={56}
                className={`
        h-12
        w-12
        shrink-0
        object-cover
        transition-transform
         ${loaded ? "opacity-100" : "opacity-0"}
        duration-300
        ease-out
      `}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="
              text-sm
              font-medium
              text-black/85
              leading-relaxed
              line-clamp-2
            "
              >
                {item.name}
              </p>

              <p className="mt-1 text-xs text-black/40">
                Size {item.size} • Qty {item.qty} × {formatCurrency(item.price)}
              </p>
            </div>

            <p className="text-sm font-medium text-black/85">
              {formatCurrency(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      {appliedCoupon && (
        <div className="rounded-md border border-black/5 bg-black/[0.02] p-3">
          <span className="text-green-600">Applied: {appliedCoupon}</span>
        </div>
      )}

      {savedNote && (
        <div className="rounded-md border border-black/5 bg-black/[0.02] p-3">
          <span>
            <span className="text-gray-400">Note:</span> {savedNote}
          </span>
        </div>
      )}

      <div className="space-y-5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Subtotal</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(totalPrice * discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-400">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div
          className="
        text-[11px]
        tracking-[0.04em]
        text-black/40
      "
        >
          Estimated delivery: {estimateDelivery()}
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Tax</span>
          <span>{formatCurrency(0.1 * totalPrice)}</span>
        </div>
      </div>

      <div className="flex justify-between border-t pt-6">
        <span className="text-lg font-light">Total</span>

        <span className="text-xl font-medium tracking-[-0.01em]">
          {formatCurrency(discountedTotal + 0.1 * totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default memo(OrderSummary);
