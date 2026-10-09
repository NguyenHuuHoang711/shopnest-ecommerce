import React, { memo } from "react";

const PrimaryButton = ({
  type = "button",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
    type={type}
      disabled={disabled}
      {...props}
      className={`
        inline-flex
        items-center
        justify-center

        h-12
        px-8

        border
        border-black

        bg-black
        text-white

        text-[11px]
        font-medium
        uppercase
        tracking-[0.18em]
        leading-none
        whitespace-nowrap
        select-none

        transition-colors
        duration-150

        hover-supported:hover:bg-white
        hover-supported:hover:text-black

        active:scale-[0.985]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black
        focus-visible:ring-offset-2

        disabled:pointer-events-none
        disabled:opacity-40

        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default memo(PrimaryButton);
