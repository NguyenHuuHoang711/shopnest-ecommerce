import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const AdminTopProductsSkeleton = () => {
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
            h-8
            w-8

            shrink-0

            rounded-full

           
          "
      />

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
              w-full max-w-40

              rounded-full

             
            "
        />

        <Skeleton
          className="
              mt-[9px]

              h-[11px]
             w-full max-w-20

              rounded-full

             
            "
        />
      </div>

      <div className="shrink-0 flex flex-col items-end">
        <Skeleton
          className="
              h-[16px]
              w-10

              rounded-full

             
            "
        />

        <Skeleton
          className="
              mt-[8px]

              h-[10px]
              w-12

              rounded-full

            
            "
        />
      </div>
    </div>
  );
};

export default memo(AdminTopProductsSkeleton);
