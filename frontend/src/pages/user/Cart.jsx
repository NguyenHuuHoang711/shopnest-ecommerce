import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  clearCart,
  increaseQty,
  decreaseQty,
} from "../../redux/cart/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CartItem from "@/features/cart/components/CartItem";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import AddCoupon from "@/features/cart/components/AddCoupon";
import AddNote from "@/features/cart/components/AddNote";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import TextButton from "@/components/ui/buttons/TextButton";

const COUPONS = {
  NOVA10: {
    discount: 0.1,
    minAmount: 200,
  },
  NOVA20: {
    discount: 0.2,
    minAmount: 500,
  },
};

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );
  const discountedTotal = totalPrice - totalPrice * discount;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      toast({ description: "Enter a promo code" });
      return;
    }
    const coupon = COUPONS[code];
    if (!coupon) {
      toast({ variant: "destructive", description: "Invalid code" });
      return;
    }
    if (appliedCoupon === code) {
      toast({ description: "Coupon already applied" });
      return;
    }
    if (totalPrice < coupon.minAmount) {
      toast({
        variant: "destructive",
        description: `Minimum order of $${coupon.minAmount} required`,
      });
      return;
    }
    setDiscount(coupon.discount);
    setAppliedCoupon(code);
    localStorage.setItem(
      "coupon",
      JSON.stringify({ code, discount: coupon.discount }),
    );
    toast({
      title: "Applied",
      description:
        appliedCoupon && appliedCoupon !== code
          ? "Coupon updated"
          : `${coupon.discount * 100}% discount added`,
    });
    setPromoOpen(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setPromoCode("");

    if (promoOpen) {
      setPromoOpen(false);
    }

    localStorage.removeItem("coupon");

    toast({
      description: "Coupon removed",
    });
  };

  const removeNote = () => {
    setSavedNote("");
    setNoteValue("");
    if (noteOpen) {
      setNoteOpen(false);
    }

    localStorage.removeItem("orderNote");

    toast({
      description: "Note removed",
    });
  };

  const handleSubmit = () => {
    const trimmed = noteValue.trim();

    if (!trimmed) {
      toast({ description: "Enter a note first" });
      return;
    }

    if (trimmed === savedNote) {
      toast({ description: "No changes made" });
      setNoteOpen(false);
      return;
    }

    setSavedNote(trimmed);
    localStorage.setItem("orderNote", trimmed);

    toast({
      title: "Saved",
      description: savedNote ? "Note updated" : "Note added",
    });

    setNoteOpen(false);
  };

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

  const handleIncrease = useCallback(
    (item) => dispatch(increaseQty(item)),
    [dispatch],
  );

  const handleDecrease = useCallback(
    (item) => dispatch(decreaseQty(item)),
    [dispatch],
  );

  const handleRemove = useCallback(
    (item) => dispatch(removeFromCart(item)),
    [dispatch],
  );

  useEffect(() => {
    const saved = localStorage.getItem("coupon");

    if (saved) {
      const { code, discount } = JSON.parse(saved);

      setAppliedCoupon(code);
      setDiscount(discount);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("orderNote");
    if (saved) {
      setNoteValue(saved);
      setSavedNote(saved);
    }
  }, []);

  const hasInvalidItem = cartItems.some((item) => {
    const sizeData = item.sizes?.find((s) => s.size === item.size);
    return !sizeData || sizeData.stock === 0;
  });

  if (!cartItems.length) {
    return (
      <EmptyState
        title={"Your cart is empty"}
        description={" Looks like you haven't added anything to your cart yet."}
        showAction
        actionText={"Continue shopping"}
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="animate-fadeIn bg-white text-black">
      <div className="max-w-[1200px]  mx-auto px-3 sm:px-4 pt-6 pb-10 flex flex-col lg:flex-row gap-12 xl:gap-20">
        <div className="space-y-16 flex-1 min-w-0">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase">
                Cart
              </p>
              <h1 className="text-4xl font-light tracking-wide mt-2">
                Shopping Bag
              </h1>
            </div>

            <TextButton
              onClick={() => dispatch(clearCart())}
              className="tracking-[0.12em]"
            >
              Clear Cart
            </TextButton>
          </div>

          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <CartItem
                key={`${item._id}-${item.size}`}
                item={item}
                increaseQty={handleIncrease}
                decreaseQty={handleDecrease}
                removeFromCart={handleRemove}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>

          <div className="pt-14 space-y-10 border-t border-gray-100">
            <AddCoupon
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoOpen={promoOpen}
              setPromoOpen={setPromoOpen}
              applyPromo={applyPromo}
              appliedCoupon={appliedCoupon}
            />
            <AddNote
              noteOpen={noteOpen}
              setNoteOpen={setNoteOpen}
              noteValue={noteValue}
              setNoteValue={setNoteValue}
              savedNote={savedNote}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 ">
          <div className="lg:sticky lg:top-20  space-y-10 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-10 xl:pl-14 pt-10 lg:pt-0">
            <h2 className="text-xl font-light tracking-wide">Order Summary</h2>

            <div className="space-y-5 text-sm">
              {appliedCoupon && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600">
                    Applied: {appliedCoupon}
                  </span>

                  <TextButton
                    onClick={removeCoupon}
                    className="text-xs 
      tracking-[0.12em]"
                  >
                    Remove
                  </TextButton>
                </div>
              )}

              {savedNote && (
                <div className="flex flex-col gap-1 text-sm text-gray-500">
                  <span>
                    <span className="text-gray-400">Note:</span> {savedNote}
                  </span>

                  <TextButton
                    onClick={removeNote}
                    className="self-start text-xs
      tracking-[0.12em]"
                  >
                    Remove
                  </TextButton>
                </div>
              )}
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

              <div
                className="text-[11px]
tracking-[0.04em]
text-black/40"
              >
                Estimated delivery: {estimateDelivery()}
              </div>
            </div>

            <div className="flex justify-between text-lg font-light border-t pt-6">
              <span>Total</span>
              <span>{formatCurrency(discountedTotal)}</span>
            </div>
            <PrimaryButton
              disabled={hasInvalidItem}
              onClick={() => {
                if (!isLoggedIn) {
                  navigate("/auth", {
                    state: { from: "/checkout" },
                  });
                } else {
                  navigate("/checkout");
                }
              }}
              className="w-full"
            >
              {hasInvalidItem ? "FIX CART ISSUES" : "CHECKOUT"}
            </PrimaryButton>

            {hasInvalidItem && (
              <p className="text-sm text-red-500 text-center">
                Some items are out of stock. Please update your cart.
              </p>
            )}

            <p
              className="text-[11px]
tracking-[0.08em]
uppercase
text-black/35 text-center"
            >
              Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
