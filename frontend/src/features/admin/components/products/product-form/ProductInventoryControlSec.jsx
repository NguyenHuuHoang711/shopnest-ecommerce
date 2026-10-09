import React, { memo } from "react";

const ProductInventoryControlSec = ({ sizes, handleStockChange }) => {
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
          motion-safe:hover:-translate-y-[2px]
        "
    >
      <p className="text-[11px] uppercase  text-gray-400 tracking-[0.2em]">
        Inventory & Sizes
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {sizes.map((item, index) => (
          <div
            id="inventory"
            tabIndex={-1}
            key={item.size}
            className="space-y-2.5"
          >
            <label
              htmlFor={`size-${index}`}
              className="text-xs tracking-wide text-gray-500"
            >
              {item.size}
            </label>

            <input
              id={`size-${index}`}
              type="number"
              min={0}
              value={item.stock}
              onChange={(e) => handleStockChange(item.size, e.target.value)}
              placeholder="5"
              className="
                   w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm
            focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductInventoryControlSec);
