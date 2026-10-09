import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";

const ProductAdditionalDetailsSec = ({
  productInfo,
  handleInfoChange,
  addInfoField,
  removeInfoField,
}) => {
  return (
    <div
      className="
          relative overflow-hidden
          before:absolute before:inset-0 before:rounded-[inherit]
          before:bg-white/[0.02] before:pointer-events-none
          bg-white/80 backdrop-blur-xl
          border border-gray-100
          rounded-[30px]
          p-7
          space-y-7
          shadow-[0_10px_30px_rgba(0,0,0,0.03)]
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]
          transition-all duration-500
          motion-safe:hover:-translate-y-[2px]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Additional Details
        </p>

        <TextButton type="button" onClick={addInfoField}>
          Add Detail
        </TextButton>
      </div>

      <div className="space-y-5">
        {productInfo.map((info, index) => (
          <div key={index} className="flex gap-4 items-center">
            <input
              id={`info-${index}`}
              type="text"
              placeholder="Enter product detail"
              value={info}
              onChange={(e) => handleInfoChange(index, e.target.value)}
              className="
                  w-full border-b border-gray-300 py-2 text-base sm:text-sm focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />

            {productInfo.length > 1 && (
              <TextButton
                type="button"
                onClick={() => removeInfoField(index)}
                className="
    text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
  "
              >
                REMOVE
              </TextButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductAdditionalDetailsSec);
