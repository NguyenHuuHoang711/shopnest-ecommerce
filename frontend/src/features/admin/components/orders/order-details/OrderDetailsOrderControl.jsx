import React, { memo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const OrderDetailsOrderControl = ({
  status,
  setStatus,
  handleUpdate,
  order,
  availableStatuses,
}) => {
  return (
    <div
      className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-6
  shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            Order Control
          </p>

          <p className="text-sm text-gray-500">
            Update order fulfillment status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative w-full sm:w-auto">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                className={`
          group

          h-12
          w-full sm:w-[190px]

          rounded-lg

          border
          shrink-0

          ${
            status !== ""
              ? "border-black/[0.08] bg-black/[0.03]"
              : "border-black/[0.045] bg-white/[0.88]"
          }
           px-4
              text-base sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
               shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              data-[state=open]:bg-white
              data-[state=open]:border-black/[0.08]
        `}
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                className="
          overflow-hidden
              rounded-lg
              border border-black/[0.05]
              bg-white/[0.92]
              backdrop-blur-2xl
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
               animate-in fade-in-0 zoom-in-95 duration-150
        "
              >
                {availableStatuses.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="
                h-12
            rounded-lg
            px-3
            text-base sm:text-sm
            font-medium
            tracking-[-0.01em]
            text-black/75
            transition-all
            duration-150
            hover-supported:hover:translate-x-[2px]
            hover-supported:hover:bg-black/[0.035]
            hover-supported:hover:text-black/90
            focus:translate-x-[2px]
            focus:bg-black/[0.035]
            focus:text-black/90
            data-[state=checked]:bg-black/[0.92]
            data-[state=checked]:text-white
            data-[state=checked]:hover:translate-x-0
            data-[state=checked]:focus:translate-x-0
            data-[state=checked]:hover:bg-black/[0.92]
            data-[state=checked]:focus:bg-black/[0.92]
            data-[state=checked]:hover:text-white
            data-[state=checked]:focus:text-white
            cursor-pointer
            "
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PrimaryButton
            onClick={handleUpdate}
            disabled={status === order?.status && order?.status === "Delivered"}
          >
            Update
          </PrimaryButton>
        </div>
      </div>

      <div className="pt-5 mt-5 border-t border-gray-100">
        <p className="text-[11px] tracking-wide text-gray-400">
          Last updated · {new Date(order?.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default memo(OrderDetailsOrderControl);
