import React, { memo } from "react";

const EmptyState = ({
  compact = false,
  title,
  description,
  showAction = false,
  actionText,
  onAction,
}) => {
  return (
    <div className="col-span-full flex justify-center py-10 sm:py-14 animate-fadeIn">
      <div
        className={`
      relative

      w-full
   ${!compact ? "max-w-[420px] py-10" : "max-w-[360px] py-6"}

      overflow-hidden

      rounded-[28px]

      border border-black/[0.045]

      bg-white/[0.88]
      backdrop-blur-xl

      px-6 py-10

      shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]

      text-center
    `}
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
            className={`
          flex items-center justify-center

        ${compact ? "h-12 w-12" : "h-14 w-14"}

          rounded-2xl

          border border-black/[0.045]

          bg-black/[0.03]

          backdrop-blur-xl

          shadow-[0_8px_24px_rgba(0,0,0,0.03)]
        `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5 text-black/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>

          <p
            className={`
          mt-5

          ${compact ? "text-[14px]" : "text-[15px]"}
          font-medium

          tracking-[-0.01em]

          text-black/80
        `}
          >
            {title}
          </p>

          <p
            className="
          mt-2

          max-w-[300px]

          text-[13px]

          leading-relaxed

          text-black/40
        "
          >
            {description}
          </p>

          {showAction && (
            <button
              onClick={onAction}
              className="
          mt-6

    inline-flex
    items-center
    justify-center

    h-10
    px-6

    rounded-none

    border
    border-black

    bg-white
    text-black

    text-[11px]
    font-medium
    uppercase
    tracking-[0.18em]
    leading-none
    whitespace-nowrap

    transition-colors
    duration-150

    hover-supported:hover:bg-black
    hover-supported:hover:text-white

    active:scale-[0.985]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-black
    focus-visible:ring-offset-2

    disabled:pointer-events-none
    disabled:opacity-40
    "
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EmptyState);
