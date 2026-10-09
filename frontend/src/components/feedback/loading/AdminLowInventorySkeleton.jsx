import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const AdminLowInventorySkeleton = () => {
  return (
    <div
      className="
        px-7
        py-6

        flex items-center gap-5
      "
    >
      <Skeleton
        className="
          h-14
          w-14

          shrink-0

          rounded-2xl

         
        "
      />

      <div className="min-w-0 flex-1">
        <Skeleton
          className="
            h-[14px]

            w-full
            max-w-40

            rounded-full

           
          "
        />

        <Skeleton
          className="
            mt-[9px]

            h-[11px]

            w-full
            max-w-20

            rounded-full

          "
        />
      </div>

      <Skeleton
        className="
          h-[30px]
          w-[84px]

          shrink-0

          rounded-full

         
        "
      />
    </div>
  );
};

export default memo(AdminLowInventorySkeleton);
