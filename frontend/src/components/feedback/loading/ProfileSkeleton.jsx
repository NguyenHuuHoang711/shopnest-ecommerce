import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="bg-white text-black min-h-[60vh] animate-fadeIn">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 pb-8 animate-pulse">
        <Skeleton className="h-4 w-32 rounded-full mb-12" />

        <div className="space-y-8">
          <Skeleton className="h-3 w-20 rounded-full " />

          <div className="flex items-center gap-5">
            <Skeleton className="w-14 h-14 rounded-full shrink-0" />

            <div className="space-y-2">
              <Skeleton className="h-8 w-40 rounded-full" />
              <Skeleton className="h-4 w-56 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-4 w-24 rounded-full" />
        </div>

        <div className="mt-16 space-y-8">
          <Skeleton className="h-3 w-20 rounded-full" />

          <div className="border-t border-b divide-y divide-gray-100">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between py-5 px-2"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-3 w-40 rounded-full" />
                </div>

                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <Skeleton className="h-3 w-20 rounded-full" />

          <div className="border-t border-b">
            <div className="flex items-center justify-between py-5 px-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-full" />
                <Skeleton className="h-3 w-52 rounded-full" />
              </div>

              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileSkeleton);
