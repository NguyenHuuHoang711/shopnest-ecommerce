import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const OrderDetailsSkeleton = () => {
  return (
    <div className="animate-fadeIn">
      <button
        disabled
        className="
        inline-flex
           items-center
           gap-2
           text-[13px]
           font-medium
           text-black/70
           active:scale-[0.985]
           transition-colors
           duration-150
           hover-supported:group-hover:text-black
           mb-3
        opacity-70
       cursor-default"
      >
        <ArrowLeft size={13} />
        Back
      </button>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 rounded-full" />

              <Skeleton className="h-3 w-24 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-9 w-48 rounded-full" />

              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>

          <Skeleton
            className="
          h-8
          w-24
          rounded-full
        "
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="
              rounded-[28px]
              border border-black/[0.045]
              bg-white/[0.78]
              backdrop-blur-xl
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.04)]
            "
              >
                <Skeleton className="h-3 w-20 rounded-full mb-5" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-36 rounded-full" />

                  <Skeleton className="h-3 w-52 rounded-full" />

                  <Skeleton className="h-3 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div
              className="
            overflow-hidden
            rounded-[28px]
            border border-black/[0.045]
            bg-white/[0.78]
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,0.04)]
          "
            >
              <div className="px-6 py-5 border-b border-black/[0.045]">
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>

              <div className="divide-y divide-black/[0.045]">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton
                        className="
                      h-16
                      w-16
                    "
                      />

                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-52 rounded-full" />

                          <Skeleton className="h-3 w-28 rounded-full" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                          {[1, 2, 3].map((x) => (
                            <div key={x} className="space-y-2">
                              <Skeleton className="h-2.5 w-10 rounded-full" />

                              <Skeleton className="h-3 w-16 rounded-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="
            rounded-[28px]
            border border-black/[0.045]
            bg-white/[0.78]
            backdrop-blur-xl
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.04)]
            space-y-5
          "
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-20 rounded-full" />

                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              ))}

              <div className="pt-5 border-t border-black/[0.045] flex justify-between items-center">
                <Skeleton className="h-4 w-16 rounded-full" />

                <Skeleton className="h-9 w-28 rounded-2xl" />
              </div>
            </div>

            <div
              className="
            rounded-[28px]
            border border-black/[0.045]
            bg-white/[0.78]
            backdrop-blur-xl
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.04)]
          "
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-full" />

                  <Skeleton className="h-3 w-40 rounded-full" />
                </div>

                <div className="flex gap-3">
                  <Skeleton
                    className="
                  h-12
                  w-[190px]
                  rounded-lg
                "
                  />

                  <Skeleton
                    className="
                  h-12
                  w-28
                "
                  />
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-black/[0.045]">
                <Skeleton className="h-3 w-44 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsSkeleton);
