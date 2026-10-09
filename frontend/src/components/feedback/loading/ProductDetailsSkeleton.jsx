import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="space-y-10 sm:sticky sm:top-[76px] h-fit bg-white/70 backdrop-blur-md">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 pr-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-10 w-[80%] rounded-full" />
            <Skeleton className="h-10 w-[55%] rounded-full" />
          </div>

          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-[1px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
            ))}
          </div>

          <Skeleton className="h-[11px] w-14 rounded-full" />
        </div>

        <Skeleton className="h-7 w-24 rounded-full" />

        <Skeleton className="h-3 w-24 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-3 w-12 rounded-full" />

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-[58px]" />
          ))}
        </div>

        <Skeleton className="h-3 w-24 rounded-full" />
      </div>

      <Skeleton className="h-[50px] w-[140px]" />

      <Skeleton className="h-12 w-full" />

      <div className="sm:hidden space-y-2">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-[92%] rounded-full" />
        <Skeleton className="h-3 w-[80%] rounded-full" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-full">
            <Skeleton className="h-5 w-44 rounded-full" />
            <Skeleton className="h-px w-full  rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductDetailsSkeleton);
