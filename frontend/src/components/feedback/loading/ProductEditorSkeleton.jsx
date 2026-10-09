import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";

function ProductEditorSkeleton() {
  return (
    <div className="animate-fadeIn space-y-8">
      <div
        className="
      inline-flex
      items-center
      gap-2
      mb-3
    "
      >
        <Skeleton className="h-[13px] w-[13px] rounded-sm" />
        <Skeleton className="h-[13px] w-10" />
      </div>

      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[6px] w-[6px] rounded-full" />

            <Skeleton className="h-[10px] w-24" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-[34px] w-72" />

            <Skeleton className="h-[13px] w-[520px] max-w-full" />
            <Skeleton className="h-[13px] w-[430px] max-w-full" />
          </div>
        </div>
      </div>

      <div
        className="
    relative overflow-hidden rounded-[30px]
    border border-black/[0.045]
    bg-white/[0.72]
    backdrop-blur-2xl
    p-6 sm:p-7
    shadow-[0_1px_2px_rgba(0,0,0,0.015),0_24px_80px_rgba(0,0,0,0.045)]
  "
      >
        <div
          className="
      absolute inset-0
      bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_34%)]
      pointer-events-none
    "
        />

        <div className="relative z-10 space-y-7">
          <div className="space-y-3">
            <Skeleton className="h-[10px] w-36" />

            <div className="space-y-2">
              <Skeleton className="h-[13px] w-[520px] max-w-full" />
              <Skeleton className="h-[13px] w-[430px] max-w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-24" />

              <Skeleton
                className="
            h-12
            w-full
            rounded-none
          "
              />
            </div>

            <div className="space-y-2.5">
              <Skeleton className="h-3 w-16" />

              <Skeleton
                className="
            h-12
            w-full
            rounded-none
          "
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-20" />

              <Skeleton
                className="
            h-12
            w-full
            rounded-lg
          "
              />
            </div>

            <div className="space-y-2.5">
              <Skeleton className="h-3 w-16" />

              <Skeleton
                className="
            h-12
            w-full
            rounded-lg
          "
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-3 w-24" />

            <Skeleton
              className="
          h-[92px]
          w-full
          rounded-none
        "
            />
          </div>
        </div>
      </div>

      <div
        className="
    relative overflow-hidden
    before:absolute before:inset-0
    before:rounded-[inherit]
    before:bg-white/[0.02]
    before:pointer-events-none
    bg-white/80
    backdrop-blur-xl
    border border-gray-100
    rounded-[30px]
    p-7
    space-y-7
    shadow-[0_10px_30px_rgba(0,0,0,0.03)]
  "
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-[11px] w-28" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        <div className="space-y-5">
          {[1].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-12 w-full rounded-none" />
              <Skeleton className="h-5 w-16 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="
    relative overflow-hidden
    before:absolute before:inset-0
    before:rounded-[inherit]
    before:bg-white/[0.02]
    before:pointer-events-none
    bg-white/80
    backdrop-blur-xl
    border border-gray-100
    rounded-[30px]
    p-7
    space-y-7
    shadow-[0_10px_30px_rgba(0,0,0,0.03)]
  "
      >
        <Skeleton className="h-[11px] w-32" />

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-6" />

              <Skeleton className="h-12 w-full rounded-none" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="
    relative overflow-hidden
    before:absolute before:inset-0
    before:rounded-[inherit]
    before:bg-white/[0.02]
    before:pointer-events-none
    bg-white/80
    backdrop-blur-xl
    border border-gray-100
    rounded-[30px]
    p-7
    space-y-7
    shadow-[0_10px_30px_rgba(0,0,0,0.03)]
  "
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-[11px] w-36" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        <div className="space-y-5">
          {[1].map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-10 w-full rounded-none" />
              <Skeleton className="h-5 w-16 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div
        className="
    relative
    overflow-hidden
    rounded-[30px]
    border border-black/[0.045]
    bg-white/[0.78]
    backdrop-blur-xl
    p-7
    shadow-[0_10px_30px_rgba(0,0,0,0.03)]
    flex items-center justify-between gap-6
  "
      >
        <div className="space-y-1">
          <Skeleton className="h-[14px] w-36" />

          <div className="space-y-1.5">
            <Skeleton className="h-[12px] w-72 max-w-full" />
            <Skeleton className="h-[12px] w-56 max-w-full" />
          </div>
        </div>

        <div
          className="
      relative
      h-8
      w-14
      shrink-0
      rounded-full
      border border-black/[0.05]
      bg-black/[0.06]
    "
        >
          <Skeleton
            className="
        absolute
        top-1
        left-1
        h-6
        w-6
        rounded-full
      "
          />
        </div>
      </div>

      <div className="flex justify-stretch sm:justify-end">
        <Skeleton
          className="
      h-12
      w-full
      sm:w-[190px]
      rounded-none
    "
        />
      </div>
    </div>
  );
}

export default memo(ProductEditorSkeleton);
