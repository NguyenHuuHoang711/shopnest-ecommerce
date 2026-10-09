import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import TextButton from "@/components/ui/buttons/TextButton";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-10 animate-fadeIn">
      <div
        className="
          relative
          w-full
          max-w-[560px]
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
              h-20
              w-20
              rounded-[24px]
              border border-black/[0.045]
              bg-black/[0.03]
              flex items-center justify-center
              shadow-[0_8px_24px_rgba(0,0,0,0.03)]
            "
          >
            <span className="text-[34px] font-light text-black/70">404</span>
          </div>

          <h1
            className="
              mt-8
              text-[30px]
              sm:text-[36px]
              font-medium
              tracking-[-0.04em]
              text-black/90
            "
          >
            Page Not Found
          </h1>

          <p
            className="
              mt-4
              max-w-[420px]
              text-[14px]
              leading-7
              text-black/45
            "
          >
            The page you're looking for doesn't exist, may have been moved, or
            the URL might be incorrect.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <PrimaryButton
              onClick={() => navigate("/")}
              className="sm:min-w-[180px]"
            >
              Back to Home
            </PrimaryButton>

            <TextButton
              onClick={() => navigate(-1)}
              className="sm:min-w-[180px]"
            >
              Go Back
            </TextButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
