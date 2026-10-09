import React, { memo } from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`
      relative
      overflow-hidden
      bg-black/[0.05]
      ${className}
    `}
    >
      <div
        className="
        absolute inset-0
        -translate-x-full
        animate-[shimmer_1.8s_infinite]
        bg-gradient-to-r
        from-transparent
        via-white/70
        to-transparent
      "
      />
    </div>
  );
};

export default memo(Skeleton);
