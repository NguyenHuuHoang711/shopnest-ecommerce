import React, { memo } from "react";
import { useGetProfileQuery } from "@/redux/api/apiSlice";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Skeleton from "@/components/ui/skeleton";

const Topbar = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProfileQuery();

  const user = data?.user;

  return (
    <header
      className="
   hidden
    sticky top-0 z-40
     h-16
       px-8
      lg:flex items-center justify-between
      border-b border-black/[0.04]
      bg-white/80
      backdrop-blur-md
    "
    >
      <div
        className="
        relative z-10
        w-full
        flex items-center justify-between
      "
      >
        <div className="flex items-center gap-3">
          <div
            className="
            h-[6px]
            w-[6px]
            rounded-full
            bg-black/80
          "
          />

          <p
            className="
            text-[10px]
            font-medium
            tracking-[0.18em]

            uppercase

            text-black/34
          "
          >
            Admin Dashboard
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="
        inline-flex
        items-center
        gap-2

        text-[11px]
        font-medium
        uppercase
        tracking-[0.18em]

        text-black/50

        transition-colors
        duration-150

        hover-supported:hover:text-black
        active:scale-[0.985]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black
        focus-visible:ring-offset-2
      "
          >
            <ArrowUpRight size={14} />
            View Store
          </button>

          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[11px] w-20 rounded-full" />

                <Skeleton className="h-[9px] w-14 rounded-full self-end" />
              </div>

              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ) : isError ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col leading-tight text-right">
                <span className="text-[14px] font-medium tracking-[-0.01em] text-black/80">
                  Admin
                </span>

                <span className="mt-[5px] text-[10px] font-medium tracking-[0.12em] uppercase text-red-500/70">
                  Offline
                </span>
              </div>

              <div className="h-9 w-9 rounded-full bg-black/[0.92] text-white flex items-center justify-center text-[12px] font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                A
              </div>
            </div>
          ) : (
            <div
              className="
            flex items-center gap-3
            cursor-default
          "
            >
              <div
                className="
              hidden sm:flex
              flex-col
              leading-tight
              text-right
            "
              >
                <span
                  className="
                text-[14px]
                font-medium
                tracking-[-0.01em]

                text-black/80
              "
                >
                  {user?.name || "Admin"}
                </span>

                <span
                  className="
                mt-[5px]
                text-[10px]
                font-medium
                tracking-[0.12em]
                uppercase
                text-black/32
              "
                >
                  Admin
                </span>
              </div>

              <div
                className="
              h-9 w-9
              rounded-full
              bg-black/[0.92]
              text-white
              flex items-center justify-center
              text-[12px]
              font-semibold
              shadow-[0_6px_20px_rgba(0,0,0,0.12)]
            "
              >
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(Topbar);
