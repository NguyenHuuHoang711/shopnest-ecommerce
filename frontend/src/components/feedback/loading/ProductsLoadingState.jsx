import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const ProductsLoadingState = () => {
  return (
    <div className="w-full relative">
      <Skeleton
        className="
      aspect-[4/5]
      sm:aspect-[5/6]
      lg:aspect-[3/4]
    "
      ></Skeleton>

      <div
        className="
      absolute top-2 left-2

      h-6
      w-[72px]

      rounded-none

      border border-black/[0.05]

      bg-black/[0.05]

      overflow-hidden

      sm:h-7
      sm:w-[82px]
    "
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

      <div
        className="
      absolute top-2 right-2 z-10

      h-7
      w-7

      sm:h-9
      sm:w-9

      rounded-full

      border border-black/[0.05]

      bg-white/80

      overflow-hidden
    "
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

      <div className="absolute inset-x-0 bottom-32 hidden justify-center sm:flex">
        <div
          className="
        h-11
        w-[85%]

        rounded-none

        border border-black/[0.05]

        bg-black/[0.05]

        overflow-hidden
        relative
      "
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
      </div>
      <div className="mt-3 min-w-0 text-left">
        <div className="space-y-1">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-2/3 rounded-full" />
        </div>

        <div className="mt-0.5">
          <div className="flex gap-[1px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="
            h-3.5
            w-3.5
            rounded-full
          "
              />
            ))}
          </div>

          <Skeleton
            className="
        mt-0.5
rounded-full
        h-[11px]
        w-14
      "
          />
        </div>

        <Skeleton
          className="
      mt-1
rounded-full
      h-5
      w-20
    "
        />
      </div>
    </div>
  );
};

export default memo(ProductsLoadingState);
