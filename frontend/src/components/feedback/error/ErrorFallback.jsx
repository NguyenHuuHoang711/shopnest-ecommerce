import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import TextButton from "@/components/ui/buttons/TextButton";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorFallback = ({ resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10 animate-fadeIn">
      <div
        className="
          relative
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[32px]
          border border-black/[0.045]
          bg-white/[0.88]
          backdrop-blur-xl
          px-8
          py-12
          text-center
          shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
        "
      >
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
            pointer-events-none
          "
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="
              flex
              items-center
              justify-center
              h-16
              w-16
              rounded-2xl
              border border-black/[0.045]
              bg-black/[0.03]
              shadow-[0_8px_24px_rgba(0,0,0,0.03)]
            "
          >
            <span className="text-[26px] text-black/55">!</span>
          </div>

          <h1
            className="
              mt-7
              text-[30px]
              sm:text-[34px]
              font-medium
              tracking-[-0.04em]
              text-black/90
            "
          >
            Something Went Wrong
          </h1>

          <p
            className="
              mt-4
              max-w-[360px]
              text-[14px]
              leading-7
              text-black/45
            "
          >
            An unexpected error occurred while rendering this page. Please try
            again or return to the home page.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <PrimaryButton onClick={handleRetry} className="sm:min-w-[180px]">
              Retry
            </PrimaryButton>

            <TextButton
              onClick={() => navigate("/")}
              className="sm:min-w-[180px]"
            >
              Back to Home
            </TextButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorFallback;
