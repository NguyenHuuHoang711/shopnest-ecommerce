import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const SavedDetailsSkeleton = ({ address = false }) => {
  return (
    <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/40 p-4 shadow-sm">
      <Skeleton className="h-3 w-32 rounded-full" />

      <Skeleton className="h-12 w-full rounded-lg" />

      <div className="mt-3 rounded-md border border-black/5 bg-black/[0.02] p-4">
        <Skeleton className="h-4 w-40 rounded-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />

          {address && <Skeleton className="h-3 w-5/6 rounded-full" />}

          <Skeleton className="h-3 w-3/4 rounded-full" />

          {address && <Skeleton className="h-3 w-32 rounded-full" />}
        </div>

        <Skeleton className="mt-4 h-3 w-36 rounded-full" />
      </div>

      <div className="mt-3 flex justify-end">
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
};

export default memo(SavedDetailsSkeleton);
