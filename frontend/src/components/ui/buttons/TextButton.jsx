import React, { memo } from "react";

const TextButton = ({
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      {...props}
      className={`
        inline-flex
        items-center
        justify-center

        text-[11px]
        font-medium
        uppercase


        text-black/80

        transition-colors
        duration-150

        hover-supported:hover:text-black

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

export default memo(TextButton);
