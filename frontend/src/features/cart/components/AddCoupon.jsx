import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const AddCoupon = ({
  promoCode,
  setPromoCode,
  promoOpen,
  setPromoOpen,
  applyPromo,
  appliedCoupon,
}) => {
  return (
    <div className="space-y-4">
      <div
        className="text-[11px]
   font-medium
   uppercase
   tracking-[0.16em]
   text-black/40"
      >
        Offers
      </div>

      <div className="space-y-2 text-[12px] text-black/60">
        <button
          type="button"
          onClick={() => {
            setPromoCode("NOVA10");
            setPromoOpen(true);
          }}
          className="
      block
      text-left

      transition-colors
      duration-150

      hover-supported:hover:text-black

      active:scale-[0.985]
    "
        >
          • <span className="font-medium">NOVA10</span> – 10% off above $200
        </button>

        <button
          type="button"
          onClick={() => {
            setPromoCode("NOVA20");
            setPromoOpen(true);
          }}
          className="
      block
      text-left

      transition-colors
      duration-150

      hover-supported:hover:text-black

      active:scale-[0.985]
    "
        >
          • <span className="font-medium">NOVA20</span> – 20% off above $500
        </button>
      </div>

      <div className="flex justify-between items-center">
        <TextButton
          onClick={() => setPromoOpen((p) => !p)}
          className="text-[12px] tracking-[0.04em]"
        >
          {appliedCoupon ? "Edit promo code" : "Add promo code"}
        </TextButton>

        {promoOpen && (
          <TextButton
            onClick={() => setPromoOpen(false)}
            className="
       text-[12px]
       tracking-[0.12em] "
          >
            Close
          </TextButton>
        )}
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]
         ${promoOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
      >
        <div className="flex gap-3 items-end px-1 py-1">
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && promoCode.trim()) {
                applyPromo();
              }
            }}
            autoComplete="off"
            spellCheck={false}
            placeholder="Enter promo code"
            className="w-full border-b border-gray-300 py-2 text-base sm:text-sm
            focus:outline-none focus:border-black transition-all duration-150
px-2 h-12"
          />
          <PrimaryButton onClick={applyPromo} disabled={!promoCode.trim()}>
            Apply
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default memo(AddCoupon);
