import React, { memo } from "react";
import * as Slider from "@radix-ui/react-slider";
import TextButton from "@/components/ui/buttons/TextButton";

const Filter = ({
  genders,
  categories,
  activeFilterCount,
  appliedValues,
  appliedChecked,
  appliedCheckedCategories,
  appliedSortBy,
  setSearchParams,
}) => {
  return (
    <div
      className="hidden lg:block z-30 min-w-[260px] max-w-[320px] px-6  
border-r border-black/5 bg-white/80 backdrop-blur-md sticky top-[149px] h-[calc(100vh-145px)] overflow-y-auto"
    >
      <div className="mb-10 space-y-3">
        <p className="text-[10px] tracking-[0.45em] uppercase text-gray-400">
          Filters
        </p>
        <h2 className="text-xl font-light tracking-wide">Refine Selection</h2>

        {activeFilterCount > 0 && (
          <div className="text-[11px] uppercase tracking-[0.12em] text-black/40">
            Filters Applied ({activeFilterCount})
          </div>
        )}
      </div>

      <div className="space-y-12">
        <div className="space-y-5 group">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 group-hover:text-black transition">
            Price
          </p>

          <div className="flex justify-between text-sm text-gray-500">
            <span className="tabular-nums">${appliedValues[0]}</span>
            <span className="tabular-nums">${appliedValues[1]}</span>
          </div>

          <Slider.Root
            className="relative flex items-center w-full h-6"
            value={appliedValues}
            onValueChange={(v) => {
              if (v[0] === v[1]) return;

              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (v[0] === 0) next.delete("min");
                else next.set("min", v[0]);

                if (v[1] === 500) next.delete("max");
                else next.set("max", v[1]);

                next.delete("page");

                return next;
              });
            }}
            min={0}
            max={500}
            step={10}
          >
            <Slider.Track className="bg-gray-200 relative flex-grow rounded-full h-[3px]">
              <Slider.Range
                className="absolute bg-black h-[3px] rounded-full 
          shadow-[0_0_10px_rgba(0,0,0,0.2)]"
              />
            </Slider.Track>

            <Slider.Thumb
              className="w-4 h-4 bg-white border border-black rounded-full 
        shadow-md hover:scale-125 active:scale-[0.985] transition-all duration-200 cursor-grab active:cursor-grabbing"
            />

            <Slider.Thumb
              className="w-4 h-4 bg-white border border-black rounded-full 
        shadow-md hover:scale-125 active:scale-[0.985] transition-all duration-200 cursor-grab active:cursor-grabbing"
            />
          </Slider.Root>
        </div>

        <div className="space-y-5">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            Gender
          </p>

          <div className="space-y-3">
            {genders.map((gender, idx) => (
              <label
                key={idx}
                className="flex items-center justify-between cursor-pointer group active:scale-[0.985] transition-transform"
              >
                <span className="text-sm text-gray-600 group-hover:text-black transition">
                  {gender}
                </span>

                <div
                  className={`w-4 h-4 rounded-full border transition
              ${appliedChecked[idx] ? "bg-black border-black scale-110" : "border-gray-400"}`}
                />

                <input
                  type="checkbox"
                  checked={appliedChecked[idx] || false}
                  onChange={(e) => {
                    const updated = [...appliedChecked];
                    updated[idx] = e.target.checked;
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);

                      const selected = genders.filter((_, i) => updated[i]);

                      if (
                        selected.length === 0 ||
                        selected.length === genders.length
                      ) {
                        next.delete("gender");
                      } else {
                        next.set("gender", selected.join(","));
                      }

                      next.delete("page");

                      return next;
                    });
                  }}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
            Category
          </p>

          <div className="space-y-3">
            {categories.map((category, idx) => (
              <label
                key={category}
                className="flex items-center justify-between cursor-pointer group active:scale-[0.985] transition-transform"
              >
                <span className="text-sm text-gray-600 group-hover:text-black transition">
                  {category}
                </span>

                <div
                  className={`w-4 h-4 rounded-full border transition
              ${appliedCheckedCategories[idx] ? "bg-black border-black scale-110" : "border-gray-400"}`}
                />

                <input
                  type="checkbox"
                  checked={appliedCheckedCategories[idx] || false}
                  onChange={(e) => {
                    const updated = [...appliedCheckedCategories];
                    updated[idx] = e.target.checked;

                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);

                      const selected = categories.filter((_, i) => updated[i]);

                      if (
                        selected.length === 0 ||
                        selected.length === categories.length
                      ) {
                        next.delete("category");
                      } else {
                        next.set("category", selected.join(","));
                      }

                      next.delete("page");

                      return next;
                    });
                  }}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {(appliedValues[0] !== 0 ||
        appliedValues[1] !== 500 ||
        appliedChecked.some(Boolean) ||
        appliedCheckedCategories.some(Boolean) ||
        appliedSortBy !== "Recommended") && (
        <TextButton
          onClick={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);

              next.delete("gender");
              next.delete("category");
              next.delete("min");
              next.delete("max");
              next.delete("sort");
              next.delete("page");

              return next;
            })
          }
          className="mt-5 tracking-[0.12em]"
        >
          Clear All Filters
        </TextButton>
      )}
    </div>
  );
};

export default memo(Filter);
