import React, { memo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TextButton from "@/components/ui/buttons/TextButton";

const SavedDetails = ({
  selectedId,
  setSelectedId,
  saved,
  setOpen,
  address = false,
}) => {
  const selectedItem = saved.find((item) => item._id === selectedId);

  return (
    <div className="space-y-3 p-4 border border-gray-100 rounded-lg bg-gray-50/40 shadow-sm ">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {address ? "Saved Addresses" : "Saved Payment Methods"}
      </p>

      <Select
        value={selectedId || ""}
        onValueChange={(val) => setSelectedId(val)}
      >
        <SelectTrigger
          className={`
                 h-12
                 w-full
                 shrink-0
                 rounded-lg
                 border
   
                 ${
                   selectedId
                     ? "border-black/[0.08] bg-black/[0.03]"
                     : "border-black/[0.05] bg-white/[0.92]"
                 }
   
                 px-4
                 text-[13px]
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
          {selectedItem ? (
            <span className="block truncate">
              {address
                ? `${selectedItem.fullName} • ${selectedItem.city}`
                : `${selectedItem.name.toUpperCase()} • •••• ${selectedItem.last4}`}
            </span>
          ) : (
            <span className="text-black/40">
              {address ? "Select saved address" : "Select saved payment method"}
            </span>
          )}
        </SelectTrigger>

        <SelectContent
          className="
                 overflow-y-auto
                  w-[var(--radix-select-trigger-width)]
       max-w-full
                 rounded-lg
                 border border-black/[0.05]
                 bg-white/[0.92]
                 backdrop-blur-2xl
                 p-1.5
                 shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  animate-in
           fade-in-0
           zoom-in-95
           duration-150
               "
        >
          {address
            ? saved.map((addr) => (
                <SelectItem
                  key={addr._id}
                  value={addr._id}
                  className="
    h-12

    rounded-lg

    px-3

    text-[13px]
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
                  <span className="truncate">
                    {addr.fullName} • {addr.city}
                  </span>
                </SelectItem>
              ))
            : saved.map((pay) => (
                <SelectItem
                  key={pay._id}
                  value={pay._id}
                  className="
               h-12
               rounded-lg
               px-3
               text-[13px]
               font-medium
               truncate
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
                  <span className="truncate">
                    {pay.name.toUpperCase()} • •••• {pay.last4}
                  </span>
                </SelectItem>
              ))}
        </SelectContent>
      </Select>

      {selectedId && (
        <div
          className="
       mt-2
       text-[12px]
       leading-relaxed
       text-black/45
     "
        >
          {address
            ? (() => {
                return selectedItem ? (
                  <div className="mt-3 rounded-md border border-black/5 bg-black/[0.02] p-4">
                    <p className="text-[13px] font-medium text-black/80">
                      {selectedItem.fullName}
                    </p>

                    <p className="mt-2 text-[12px] leading-relaxed text-black/55">
                      {selectedItem.address1}
                    </p>

                    {selectedItem.address2 && (
                      <p className="text-[12px] leading-relaxed text-black/55">
                        {selectedItem.address2}
                      </p>
                    )}

                    <p className="text-[12px] leading-relaxed text-black/55">
                      {selectedItem.city}, {selectedItem.state}{" "}
                      {selectedItem.pincode}
                    </p>

                    <p className="mt-2 text-[12px] text-black/45">
                      {selectedItem.phone}
                    </p>
                    <p
                      className="
                      mt-3
   text-[12px]
   font-medium
   text-green-600
   "
                    >
                      ✓ Using saved address
                    </p>
                  </div>
                ) : null;
              })()
            : (() => {
                return selectedItem ? (
                  <div className="mt-3 rounded-md border border-black/5 bg-black/[0.02] p-4">
                    <p className="text-[13px] font-medium text-black/80">
                      {selectedItem.name.toUpperCase()}
                    </p>

                    <p className="mt-2 text-[12px] text-black/55">
                      •••• {selectedItem.last4}
                    </p>

                    <p className="text-[12px] text-black/55">
                      Expires {selectedItem.month}/{selectedItem.year}
                    </p>
                    <p
                      className="
                      mt-3
   text-[12px]
   font-medium
   text-green-600
   "
                    >
                      ✓ Using saved payment details
                    </p>
                  </div>
                ) : null;
              })()}
        </div>
      )}

      {selectedId && (
        <div className="mt-3 flex justify-end">
          <TextButton
            onClick={() => setOpen(true)}
            className="
      text-black/40
      hover-supported:hover:text-red-500
      focus-visible:ring-red-500
    "
          >
            DELETE
          </TextButton>
        </div>
      )}
    </div>
  );
};

export default memo(SavedDetails);
