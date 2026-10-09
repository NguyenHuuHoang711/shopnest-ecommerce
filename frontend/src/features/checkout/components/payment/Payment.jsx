import React, {
  lazy,
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useAddPaymentDetailsMutation,
  useAddOrderDetailsMutation,
  useGetPaymentDetailsQuery,
  useDeletePaymentDetailsMutation,
} from "@/redux/api/apiSlice";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import SavedDetails from "../shared/SavedDetails";
import PaymentInputs from "./PaymentInputs";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import ErrorState from "@/components/feedback/error/ErrorState";
import SavedDetailsSkeleton from "@/components/feedback/loading/SavedDetailsSkeleton";
import { ArrowLeft } from "lucide-react";
const ConfirmModal = lazy(() => import("@/components/modals/ConfirmModal"));

const cardNumberRegex = /^[0-9]{16}$/;
const cvvRegex = /^[0-9]{3,4}$/;
const monthRegex = /^(0[1-9]|1[0-2])$/;
const yearRegex = /^[0-9]{4}$/;

const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};
const focusField = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus();
};
const formatCard = (value) =>
  value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
const capitalizeWords = (str = "") =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const normalizePayment = (data = {}) => ({
  name: data.name || "",
  cardNumber: data.cardNumber || "",
  month: data.month || "",
  year: data.year || "",
  cvv: data.cvv || "",
});
const Payment = ({ setCurrentStep }) => {
  const { toast } = useToast();

  const couponData = safeParse("coupon");
  const note = localStorage.getItem("orderNote");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const [open, setOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [usingSaved, setUsingSaved] = useState(false);
  const initialState = useMemo(
    () => ({
      name: "",
      cardNumber: "",
      month: "",
      year: "",
      cvv: "",
    }),
    [],
  );
  const [paymentValue, setPaymentValue] = useState({
    name: "",
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
  });

  const [addPaymentDetails] = useAddPaymentDetailsMutation();

  const [deletePayment, { isLoading: isDeleting }] =
    useDeletePaymentDetailsMutation();

  const [addOrderDetails, { isLoading }] = useAddOrderDetailsMutation();

  const token = localStorage.getItem("token");

  const {
    data,
    isLoading: loadingDetails,
    isError,
    isFetching,
    refetch,
  } = useGetPaymentDetailsQuery(undefined, {
    skip: !token,
  });

  const paymentDetails = data?.savedPayments || [];

  useEffect(() => {
    const savedId = localStorage.getItem("paymentId");
    const draft = localStorage.getItem("paymentDraft");

    if (savedId) {
      setSelectedPaymentId(savedId);
    } else if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setPaymentValue(normalizePayment(parsed));
        localStorage.removeItem("paymentId");
        toast({
          title: "Restored your previous progress",
        });
      } catch (e) {
        localStorage.removeItem("paymentDraft");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedPaymentId) {
      localStorage.setItem("paymentId", selectedPaymentId);
    } else {
      setUsingSaved(false);
    }
  }, [selectedPaymentId]);

  useEffect(() => {
    if (!selectedPaymentId) return;
    const payment = paymentDetails.find((pay) => pay._id === selectedPaymentId);
    if (payment) {
      setPaymentValue({
        name: payment.name,
        cardNumber: "",
        month: payment.month,
        year: payment.year,
        cvv: "",
      });
      setUsingSaved(true);
    } else {
      setUsingSaved(false);
    }
  }, [selectedPaymentId, paymentDetails]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (
      selectedPaymentId &&
      (id === "name" || id === "month" || id === "year")
    ) {
      setSelectedPaymentId(null);
      setUsingSaved(false);
      localStorage.removeItem("paymentId");
    }

    setPaymentValue((prev) => {
      const updated = {
        ...prev,
        [id]:
          id === "cardNumber"
            ? value.replace(/\D/g, "").slice(0, 16)
            : id === "cvv"
              ? value.replace(/\D/g, "").slice(0, 4)
              : id === "month"
                ? value.replace(/\D/g, "").slice(0, 2)
                : id === "year"
                  ? value.replace(/\D/g, "").slice(0, 4)
                  : value.trimStart(),
      };

      localStorage.setItem("paymentDraft", JSON.stringify(updated));

      return updated;
    });
  };

  const handleDelete = async (id) => {
    try {
      await deletePayment(id).unwrap();
      toast({
        title: "Payment details deleted successfully",
      });
      if (selectedPaymentId === id) {
        setSelectedPaymentId(null);
        localStorage.removeItem("paymentId");
      }
      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || "Failed to delete payment details",
      });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const nameVal = paymentValue.name.trim();
    const cardVal = paymentValue.cardNumber.trim();
    const monthVal = paymentValue.month.trim();
    const yearVal = paymentValue.year.trim();
    const cvvVal = paymentValue.cvv.trim();

    if (usingSaved && !selectedPaymentId) {
      toast({ title: "Invalid saved payment", variant: "destructive" });
      return;
    }

    if (!usingSaved) {
      if (!nameVal) {
        focusField("name");
        return toast({
          variant: "destructive",
          title: "Enter the name on the card",
        });
      }

      if (!cardVal) {
        focusField("cardNumber");
        return toast({
          variant: "destructive",
          title: "Enter your card number",
        });
      }

      if (!monthVal) {
        focusField("month");
        return toast({
          variant: "destructive",
          title: "Enter the expiry month",
        });
      }

      if (!yearVal) {
        focusField("year");
        return toast({
          variant: "destructive",
          title: "Enter the expiry year",
        });
      }

      if (!cvvVal) {
        focusField("cvv");
        return toast({
          variant: "destructive",
          title: "Enter the CVV",
        });
      }

      if (!monthRegex.test(monthVal)) {
        toast({ title: "Invalid month", variant: "destructive" });
        focusField("month");
        return;
      }
      if (!yearRegex.test(yearVal)) {
        toast({ title: "Invalid year", variant: "destructive" });
        focusField("year");
        return;
      }

      if (
        Number(yearVal) < currentYear ||
        (Number(yearVal) === currentYear && Number(monthVal) < currentMonth)
      ) {
        toast({
          title: "Card expired",
          variant: "destructive",
        });
        focusField("month");
        return;
      }
    }

    if (!cardNumberRegex.test(cardVal)) {
      toast({ title: "Invalid card number", variant: "destructive" });
      focusField("cardNumber");
      return;
    }

    if (!cvvRegex.test(cvvVal)) {
      toast({ title: "Invalid CVV", variant: "destructive" });
      focusField("cvv");
      return;
    }

    const cleanCard = cardVal.replace(/\s/g, "");
    const maskedCard = cleanCard.slice(-4);
    try {
      let paymentId;
      if (!usingSaved) {
        const saved = await addPaymentDetails({
          name: nameVal,
          last4: maskedCard,
          month: monthVal,
          year: yearVal,
        }).unwrap();
        paymentId = saved.payment._id;
      } else {
        paymentId = selectedPaymentId;
      }

      if (!paymentId) {
        toast({
          title: "Please fill the payment details first",
          variant: "destructive",
        });
        return;
      }

      const shippingAddressId = localStorage.getItem(`shippingAddressId`);

      const shippingAddress = JSON.parse(
        localStorage.getItem("shippingAddress") || "null",
      );

      if (!shippingAddressId && !shippingAddress) {
        toast({
          title: "No shipping address selected",
          variant: "destructive",
        });
        return;
      }

      if (!cartItems.length) {
        toast({
          title: "Your cart is empty",
          variant: "destructive",
        });
        return;
      }
      const items = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.qty,
        size: item.size,
      }));

      const order = await addOrderDetails({
        shippingAddressId,
        shippingAddress,
        paymentId,
        items,
        coupon: couponData ? { code: couponData.code } : undefined,
        note: note || undefined,
      }).unwrap();

      const orderId = order?.orderId || order?.order?._id;
      if (!orderId) {
        throw new Error("Order creation failed");
      }

      toast({
        title: "Order placed successfully!",
        description: "Thank you for shopping with us 🎉",
      });

      localStorage.setItem("orderJustPlaced", true);
      localStorage.setItem("lastOrderId", orderId);

      localStorage.removeItem("paymentDraft");

      setPaymentValue(initialState);

      setCurrentStep(3);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || err?.message || "Failed to place order",
      });
    }
  };

  return (
    <>
      <div className="space-y-10 w-full">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
            CARD INFORMATION
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-wide">
            Payment Details
          </h2>
        </div>

        {loadingDetails || isFetching ? (
          <SavedDetailsSkeleton />
        ) : isError ? (
          <ErrorState
            compact
            refetch={refetch}
            isFetching={isFetching}
            title="Unable to load payment details"
            description="You can still enter a new payment detail below."
          />
        ) : (
          paymentDetails.length > 0 && (
            <SavedDetails
              selectedId={selectedPaymentId}
              setSelectedId={setSelectedPaymentId}
              saved={paymentDetails}
              setOpen={setOpen}
            />
          )
        )}
        <form onSubmit={handleClick}>
          <PaymentInputs
            paymentValue={paymentValue}
            setPaymentValue={setPaymentValue}
            handleChange={handleChange}
            capitalizeWords={capitalizeWords}
            formatCard={formatCard}
          />

          <div className="mt-8 border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 text-center">
              🔒 Secure checkout — encrypted & protected
            </p>
          </div>

          <div className="flex justify-between items-center pt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-black/70 transition-colors duration-150 active:scale-[0.985] hover-supported:hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to Shipping
            </button>

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Place Order"}
            </PrimaryButton>
          </div>
        </form>
      </div>

      <Suspense fallback={null}>
        <ConfirmModal
          openModal={open}
          setOpenModal={setOpen}
          onConfirm={async () => {
            await handleDelete(selectedPaymentId);
            setOpen(false);
          }}
          isLoading={isDeleting}
          title="Delete this payment detail?"
          description="This action cannot be undone."
          confirmText="Delete"
        />
      </Suspense>
    </>
  );
};

export default memo(Payment);
