import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const AdminProductsSkeleton = () => {
  return (
    <div
      className="
        flex flex-col
        gap-5
        px-5 sm:px-7
        py-5
      "
    >
      <div
        className="
          flex flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-5
        "
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Skeleton
            className="
              h-14
              w-14
              shrink-0
              rounded-none
            "
          />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton
              className="
                h-[14px]
                w-40
                rounded-full
              "
            />

            <Skeleton
              className="
                h-[11px]
                w-24
                rounded-full
              "
            />
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <Skeleton
            className="
              h-[11px]
              w-8
              rounded-full
            "
          />

          <Skeleton
            className="
              h-[11px]
              w-10
              rounded-full 
            "
          />
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-4
          xl:grid-cols-5
          gap-x-5
          gap-y-4
        "
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton
              className="
                h-[10px]
                w-16
                rounded-full
              "
            />

            <Skeleton
              className="
                h-[12px]
                w-20
                rounded-full 
              "
            />
          </div>
        ))}

        <div className="space-y-2 col-span-2 sm:col-span-4 xl:col-span-1">
          <Skeleton
            className="
              h-[10px]
              w-14
              rounded-full 
            "
          />

          <Skeleton
            className="
              h-7
              w-24
              rounded-full
            "
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AdminProductsSkeleton);
