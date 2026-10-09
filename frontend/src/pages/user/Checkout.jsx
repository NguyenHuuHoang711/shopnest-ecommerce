import React, { useState, useEffect, lazy, Suspense } from "react";
import Shipping from "@/features/checkout/components/shipping/Shipping";
import Payment from "@/features/checkout/components/payment/Payment";
import OrderConfirmation from "@/features/checkout/components/OrderConfirmation";
import OrderSummary from "@/features/checkout/components/shared/OrderSummary";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextButton from "@/components/ui/buttons/TextButton";
const ConfirmDialog = lazy(() => import("@/components/modals/ConfirmModal"));

const steps = ["Shipping", "Payment", "Confirmation"];

const Checkout = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = Number(localStorage.getItem("currentStep"));

    return savedStep >= 1 && savedStep <= 3 ? savedStep : 1;
  });
  const [checked, setChecked] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    localStorage.setItem(`currentStep`, currentStep);
  }, [currentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    const shippingAddressId = localStorage.getItem("shippingAddressId");
    const shippingAddress = localStorage.getItem("shippingAddress");

    const orderJustPlaced = localStorage.getItem("orderJustPlaced");
    const lastOrderId = localStorage.getItem("lastOrderId");

    let nextStep = currentStep;

    if (currentStep >= 2 && !shippingAddress && !shippingAddressId) {
      nextStep = 1;
    } else if (currentStep === 3 && !orderJustPlaced && !lastOrderId) {
      nextStep = 2;
    }

    if (nextStep !== currentStep) {
      setCurrentStep(nextStep);
    } else {
      setChecked(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 3) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, navigate, currentStep]);

  const handleCancelCheckout = () => {
    localStorage.removeItem("shippingAddressId");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("shippingDraft");
    localStorage.removeItem("paymentId");
    localStorage.removeItem("paymentDraft");
    localStorage.removeItem("currentStep");

    navigate("/cart");
  };

  if (!checked) {
    return null;
  }

  return (
    <>
      <div className="animate-fadeIn pt-6 pb-10 bg-white text-black min-h-screen">
        <div className="max-w-[1000px] mx-auto px-4 mt-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-[1px] bg-gray-200 z-0" />

            {steps.map((step, index) => {
              const active = currentStep >= index + 1;

              return (
                <div
                  key={step}
                  className="relative z-10 flex flex-col items-center flex-1 transition-transform duration-300"
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs border 
transition-all duration-300 ease-out
${
  active
    ? "bg-black text-white border-black scale-110"
    : "bg-white border-gray-300 text-gray-400 scale-95"
}`}
                  >
                    {index + 1}
                  </div>

                  <span
                    className={`mt-2 text-[11px] sm:text-xs tracking-wide transition-all duration-300
                  ${active ? "text-black" : "text-gray-400"}`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 mt-10 flex flex-col lg:flex-row gap-10 lg:gap-14">
          <div className={`${currentStep === 3 ? "w-full" : "flex-1 min-w-0"}`}>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
                  Checkout
                </p>

                <h1 className="text-2xl sm:text-3xl font-light tracking-wide mt-2">
                  {steps[currentStep - 1]}
                </h1>
              </div>
              {currentStep !== 3 && (
                <TextButton
                  className="
    text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
  "
                  onClick={() => setCancelOpen(true)}
                >
                  CANCEL CHECKOUT
                </TextButton>
              )}
            </div>
            <div className="relative  ">
              <div key={currentStep} className="animate-step">
                {currentStep === 1 && (
                  <Shipping setCurrentStep={setCurrentStep} />
                )}

                {currentStep === 2 && (
                  <Payment setCurrentStep={setCurrentStep} />
                )}

                {currentStep === 3 && (
                  <OrderConfirmation setCurrentStep={setCurrentStep} />
                )}
              </div>
            </div>
          </div>

          {currentStep !== 3 && (
            <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
              <div className="lg:sticky lg:top-32 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-10 xl:pl-14 pt-10 lg:pt-0">
                <OrderSummary />
              </div>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <ConfirmDialog
          openModal={cancelOpen}
          setOpenModal={setCancelOpen}
          onConfirm={handleCancelCheckout}
          isLoading={false}
          title="Cancel checkout?"
          description="Your entered details and progress will be lost."
          confirmText="Cancel Checkout"
        />
      </Suspense>
    </>
  );
};

export default Checkout;
