import React, { memo } from "react";
import Skeleton from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const AdminUserDetailsSkeleton = ({ infoCard }) => {
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
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton
              className="
            w-16 h-16
            rounded-full
            
            shrink-0
          "
            />

            <div className="space-y-1">
              <Skeleton
                className="
              h-[34px]
              w-[220px]
              
              rounded-full
            "
              />

              <Skeleton
                className="
              h-[13px]
              w-[260px]
              max-w-[520px]
              
              rounded-full
              
            "
              />
            </div>
          </div>

          <Skeleton
            className="
          h-[32px]
          w-[74px]
          
          rounded-full
        "
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={infoCard}>
              <Skeleton
                className="
              mb-5
              h-[11px]
              w-[90px]
              
              rounded-full
              
            "
              />

              <div className="space-y-1.5">
                <Skeleton
                  className="
                h-[36px]
                w-[120px]
                
                rounded-2xl
              "
                />

                <Skeleton
                  className="
                h-[13px]
                w-[170px]
                
                rounded-full
                
              "
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="
        relative
        overflow-hidden
        rounded-[28px]
        border border-black/[0.045]
        bg-white/[0.86]
        backdrop-blur-xl
        shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
      "
        >
          <div
            className="
          absolute inset-0
          bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
          pointer-events-none
        "
          />

          <div
            className="
          absolute -top-32 left-1/2
          h-56 w-56
          -translate-x-1/2
          rounded-full
          bg-white/30
          blur-3xl
          pointer-events-none
        "
          />

          <div
            className="
          relative z-10
          flex items-center justify-between
          px-7
          py-6
        "
          >
            <div>
              <Skeleton
                className="
              h-[15px]
              w-[120px]
              
              rounded-full
            "
              />

              <Skeleton
                className="
              mt-[6px]
              h-[10px]
              w-[150px]
              
              rounded-full
              
            "
              />
            </div>

            <Skeleton
              className="
            h-[6px]
            w-[6px]
            rounded-full
            bg-black/18
          "
            />
          </div>

          <Skeleton
            className="
          h-px w-full
          bg-gradient-to-r
          from-transparent
          via-black/[0.05]
          to-transparent
        "
          />

          <div className="space-y-8 p-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="
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
                <Skeleton
                  className="
                absolute inset-0
                bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
                pointer-events-none
              "
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <Skeleton
                        className="
                      h-[15px]
                      w-[140px]
                      
                      rounded-full
                    "
                      />

                      <Skeleton
                        className="
                      mt-[7px]
                      h-[10px]
                      w-[90px]
                      
                      rounded-full
                      
                    "
                      />
                    </div>

                    <Skeleton
                      className="
                    h-[18px]
                    w-[90px]
                    
                    rounded-full
                  "
                    />
                  </div>

                  <Skeleton
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
                    w-[180px]
                    
                    rounded-full
                  "
                    />

                    <Skeleton
                      className="
                    mt-[7px]
                    h-[11px]
                    w-[220px]
                    
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
                    h-[11px]
                    w-[52px]
                    
                    rounded-full
                    
                  "
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminUserDetailsSkeleton);
