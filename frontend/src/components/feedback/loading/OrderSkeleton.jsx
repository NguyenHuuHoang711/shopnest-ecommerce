import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const OrderSkeleton = () => {
  return (
    <div className="bg-white text-black min-h-[60vh] animate-fadeIn">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-8">
        <Skeleton className="h-4 w-40 rounded-full" />
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-6 pb-10">
        <Skeleton className="h-9 w-44 mb-8 rounded-full" />

        <div className="mb-10 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-22 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-22 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-7 min-w-[106px] rounded-full" />
            </div>
          </div>

          <div className="mt-10">
            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-start
                justify-between
                gap-8
                md:gap-0
                relative
              "
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    relative
                    flex
                    md:flex-col
                    items-start
                    md:items-center
                    flex-1
                  "
                >
                  {i !== 0 && (
                    <>
                      <Skeleton
                        className="
                          absolute
                          md:hidden
                          left-[13px]
                          top-[-34px]
                          w-[1.5px]
                          h-8
                          rounded-none
                        "
                      />

                      <Skeleton
                        className="
                          hidden
                          md:block
                          absolute
                          top-[14px]
                          left-[-50%]
                          w-full
                          h-[1.5px]
                          rounded-none
                        "
                      />
                    </>
                  )}

                  <Skeleton
                    className="
                      relative
                      z-10
                      w-7
                      h-7
                      rounded-full
                      shrink-0
                    "
                  />

                  <div
                    className="
                      ml-4
                      md:ml-0
                      md:mt-4
                      text-left
                      md:text-center
                    "
                  >
                    <Skeleton className="h-3 w-[72px] md:mx-auto rounded-full" />

                    <Skeleton
                      className="
                        mt-1
                        h-[10px]
                        w-[58px]
                        md:mx-auto rounded-full
                      "
                    />

                    <Skeleton
                      className="
                        mt-2
                        h-6
                        w-[62px]
                        rounded-full
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="mt-2 h-3 w-[260px] rounded-full" />

          <div className="space-y-2">
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>

            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[118px] rounded-full" />
              <Skeleton className="h-4 w-[82px] rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                gap-4
                rounded-lg
                border
                border-black/[0.05]
                bg-white
                p-4
                sm:p-5
              "
            >
              <Skeleton
                className="
                  shrink-0
                  w-16
                  h-20
                  sm:w-[72px]
                  sm:h-[92px]
                "
              />

              <div className="flex flex-1 flex-col min-w-0">
                <div>
                  <Skeleton className="h-[14px] w-[78%] rounded-full" />

                  <Skeleton
                    className="
                      mt-1.5
                      h-[14px]
                      w-[52%] rounded-full
                    "
                  />

                  <Skeleton
                    className="
                      mt-2
                      h-[11px]
                      w-[130px] rounded-full
                    "
                  />

                  <Skeleton
                    className="
                      mt-1
                      h-[11px]
                      w-[85px] rounded-full
                    "
                  />
                </div>

                <div className="mt-auto" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-6 space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[58px] rounded-full" />
            <Skeleton className="h-4 w-[82px] rounded-full" />
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[56px] rounded-full" />
            <Skeleton className="h-4 w-[76px] rounded-full" />
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[28px] rounded-full" />
            <Skeleton className="h-4 w-[70px] rounded-full" />
          </div>

          <div className="flex justify-between pt-2 border-t">
            <Skeleton className="h-5 w-[42px] rounded-full" />
            <Skeleton className="h-5 w-[95px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderSkeleton);
