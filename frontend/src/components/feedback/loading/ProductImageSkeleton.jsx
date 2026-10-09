import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const ProductImageSkeleton = () => {
  return (
    <div>
      <div className="space-y-8">
        <Skeleton className="aspect-[3/4] w-full" />

        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-14 shrink-0" />
          ))}
        </div>

        <div className="hidden sm:block space-y-2">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-11/12 rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default memo(ProductImageSkeleton);
