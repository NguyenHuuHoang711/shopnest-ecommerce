import React, { memo } from "react";

const SecondaryButton = ({
  type = "button",
  children,
  className = "",
  variant = "default",
  disabled = false,
  ...props
}) => {
  const variants = {
    default: `
      border-black
      bg-white
      text-black

      hover-supported:hover:bg-black
      hover-supported:hover:text-white

      focus-visible:ring-black
    `,

    destructive: `
      border-red-500
      bg-white
      text-red-500

      hover-supported:hover:bg-red-500
      hover-supported:hover:text-white

      focus-visible:ring-red-500
    `,
  };

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
        px-6

        border

        text-[11px]
        font-medium
        uppercase
        tracking-[0.18em]
        leading-none
        whitespace-nowrap
        select-none

        transition-colors
        duration-150

        active:scale-[0.985]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2

        disabled:pointer-events-none
        disabled:opacity-40

        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default memo(SecondaryButton);
