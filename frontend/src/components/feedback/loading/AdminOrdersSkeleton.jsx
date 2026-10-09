import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const AdminOrdersSkeleton = () => {
  return (
    <div
      className="
        group
        relative
        min-h-[250px]

        overflow-hidden

        rounded-[28px]

        border border-black/[0.045]

        bg-white/[0.88]
        backdrop-blur-xl

        px-7 py-6

        shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
      "
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <Skeleton
              className="
                h-[15px]
                w-[130px]

                rounded-full

              "
            />

            <Skeleton
              className="
                mt-[7px]

                h-[10px]
                w-[92px]

                rounded-full

              "
            />
          </div>

          <Skeleton
            className="
              mt-[1px]

              h-[18px]
              w-[92px]

              rounded-full

            "
          />
        </div>

        <div
          className="
            my-6

            h-px w-full

            bg-gradient-to-r
            from-transparent
            via-black/[0.05]
            to-transparent
          "
        />

        <div className="min-w-0">
          <Skeleton
            className="
              h-[14px]
              w-[150px]

              rounded-full

            "
          />

          <Skeleton
            className="
              mt-[7px]

              h-[11px]
              w-[210px]

              rounded-full

            "
          />
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <Skeleton
            className="
              h-7
              w-[106px]

              rounded-full

            "
          />

          <Skeleton
            className="
              h-[13px]
              w-[52px]

              rounded-full

            "
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AdminOrdersSkeleton);
