import { AnimatePresence, motion } from "framer-motion";
import { useFilter } from "@/context/FilterContext";
import * as Slider from "@radix-ui/react-slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import TextButton from "@/components/ui/buttons/TextButton";

const sortOptions = [
  "Recommended",
  "Newest Arrivals",
  "Price: Low to High",
  "Price: High to Low",
];

const FilterModal = ({
  genders,
  categories,
  appliedValues,
  appliedChecked,
  appliedCheckedCategories,
  appliedSortBy,
  setSearchParams,
}) => {
  const {
    isOpen,
    setIsOpen,
    values,
    setValues,
    checked,
    setChecked,
    checkedCategories,
    setCheckedCategories,
    sortBy,
    setSortBy,
  } = useFilter();

  useEffect(() => {
    if (isOpen) {
      setValues(appliedValues);
      setChecked(appliedChecked);
      setCheckedCategories(appliedCheckedCategories);
      setSortBy(appliedSortBy);
    }
  }, [isOpen]);

  const activeFilterCount =
    checked.filter(Boolean).length +
    checkedCategories.filter(Boolean).length +
    (values[0] !== 0 || values[1] !== 500 ? 1 : 0) +
    (sortBy !== "Recommended" ? 1 : 0);

  const handleClose = () => {
    setValues(appliedValues);
    setChecked(appliedChecked);
    setCheckedCategories(appliedCheckedCategories);
    setSortBy(appliedSortBy);

    setIsOpen(false);
  };

  const hasChanges =
    JSON.stringify(values) !== JSON.stringify(appliedValues) ||
    JSON.stringify(checked) !== JSON.stringify(appliedChecked) ||
    JSON.stringify(checkedCategories) !==
      JSON.stringify(appliedCheckedCategories) ||
    sortBy !== appliedSortBy;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div>
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleClose}
            className={`fixed inset-0 bg-black/30 z-[200]
              `}
          />
          <motion.div
            key="menu"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="
                        fixed
  inset-0
  h-dvh
  z-[200]
  flex
  flex-col
  overflow-hidden
  bg-white/80
  backdrop-blur-md
                     "
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-gray-300 rounded-full" />
            <div className="relative px-6 py-5 border-b border-b-black/10 ">
              <div className="text-center">
                <div className="text-center">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/35">
                    Filters
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="
                           absolute right-6 top-1/2 -translate-y-1/2
                           w-9 h-9 flex items-center justify-center text-black/[60] hover-supported:hover:text-black
                           rounded-full  active:scale-[0.985] transition-all text-[22px]
                         "
              >
                ✕
              </button>
              {activeFilterCount > 0 && (
                <div className="text-[11px] uppercase tracking-[0.12em] text-black/40">
                  Selected Filters ({activeFilterCount})
                </div>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p
                    className="
        text-[11px]
        font-medium
        uppercase
        tracking-[0.14em]
        text-black/40
      "
                  >
                    Sort By
                  </p>

                  {sortBy !== "Recommended" && (
                    <TextButton
                      type="button"
                      onClick={() => setSortBy("Recommended")}
                      className="
          text-[10px]
          tracking-[0.12em]
        "
                    >
                      Reset
                    </TextButton>
                  )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white/[0.88] backdrop-blur-md">
                  {sortOptions.map((option, index) => {
                    const active = sortBy === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSortBy(option)}
                        className={`
            group
            flex
            w-full
            items-center
            justify-between
            px-4
            py-3
            text-left
            transition-all
            duration-150

            ${
              index !== sortOptions.length - 1
                ? "border-b border-black/[0.05]"
                : ""
            }

            ${
              active
                ? "bg-black/[0.03]"
                : "hover-supported:hover:bg-black/[0.02]"
            }

            active:scale-[0.995]
          `}
                      >
                        <span
                          className={`
               text-base sm:text-sm
              tracking-[-0.01em]
              transition-colors
              duration-150

              ${
                active
                  ? "font-medium text-black"
                  : "font-normal text-black/72 group-hover:text-black/90"
              }
            `}
                        >
                          {option}
                        </span>

                        <span
                          className={`
              text-[12px]
              transition-all
              duration-150

              ${
                active
                  ? "opacity-100 text-black"
                  : "opacity-0 group-hover:opacity-30"
              }
            `}
                        >
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="price">
                  <AccordionTrigger className="hover-supported:hover:no-underline text-xs tracking-[0.3em] uppercase text-gray-400 group-hover:text-black transition">
                    Price
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-2 px-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${values[0]}</span>
                      <span>${values[1]}</span>
                    </div>
                    <Slider.Root
                      className="relative flex items-center w-full h-6"
                      value={values}
                      onValueChange={(v) => {
                        if (v[0] !== v[1]) {
                          setValues(v);
                        }
                      }}
                      min={0}
                      max={500}
                      step={10}
                    >
                      <Slider.Track className="bg-gray-300 relative flex-grow rounded-full h-[3px]">
                        <Slider.Range
                          className="absolute bg-black h-[3px] rounded-full 
          shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                        />
                      </Slider.Track>

                      <Slider.Thumb
                        className="w-4 h-4 bg-white border border-black rounded-full 
        shadow-md hover:scale-125 active:scale-95 transition-all duration-150  "
                      />

                      <Slider.Thumb
                        className="w-4 h-4 bg-white border border-black rounded-full 
        shadow-md hover:scale-125 active:scale-95 transition-all duration-150  "
                      />
                    </Slider.Root>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="gender">
                  <AccordionTrigger className="hover-supported:hover:no-underline text-xs tracking-[0.3em] uppercase text-gray-400">
                    Gender
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {genders.map((gender, idx) => (
                      <label
                        key={idx}
                        className="flex items-center justify-between cursor-pointer group active:scale-[0.985] transition-transform px-3"
                      >
                        <span className="text-sm text-gray-600 group-hover:text-black transition">
                          {gender}
                        </span>

                        <div
                          className={`w-4 h-4 rounded-full border transition
              ${checked[idx] ? "bg-black border-black scale-110" : "border-gray-400"}`}
                        />

                        <input
                          type="checkbox"
                          checked={checked[idx] || false}
                          onChange={(e) => {
                            const updated = [...checked];
                            updated[idx] = e.target.checked;
                            setChecked(updated);
                          }}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="category">
                  <AccordionTrigger className="hover-supported:hover:no-underline text-xs tracking-[0.3em] uppercase text-gray-400">
                    Category
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-3">
                    {categories.map((category, idx) => (
                      <label
                        key={category}
                        className="flex items-center justify-between cursor-pointer group active:scale-[0.985] transition-transform px-3"
                      >
                        <span className="text-sm text-gray-600 group-hover:text-black transition">
                          {category}
                        </span>

                        <div
                          className={`w-4 h-4 rounded-full border transition
              ${checkedCategories[idx] ? "bg-black border-black scale-110" : "border-gray-400"}`}
                        />

                        <input
                          type="checkbox"
                          checked={checkedCategories[idx] || false}
                          onChange={(e) => {
                            const updated = [...checkedCategories];
                            updated[idx] = e.target.checked;
                            setCheckedCategories(updated);
                          }}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div
              className="
    shrink-0
    border-t
    border-black/10
    bg-white/80
    backdrop-blur-md
    px-5
    py-4
    sm:px-6
  "
            >
              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => {
                    const emptyChecked = new Array(genders.length).fill(false);
                    const emptyCategories = new Array(categories.length).fill(
                      false,
                    );

                    setValues([0, 500]);
                    setChecked(emptyChecked);
                    setCheckedCategories(emptyCategories);
                    setSortBy("Recommended");
                    setSearchParams({}, { replace: true });
                    setIsOpen(false);
                  }}
                  disabled={!hasChanges}
                  className="flex-1"
                >
                  Clear
                </SecondaryButton>

                <PrimaryButton
                  onClick={() => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);

                      if (values[0] === 0) next.delete("min");
                      else next.set("min", values[0]);

                      if (values[1] === 500) next.delete("max");
                      else next.set("max", values[1]);

                      const selectedGenders = genders.filter(
                        (_, i) => checked[i],
                      );

                      if (
                        selectedGenders.length === 0 ||
                        selectedGenders.length === genders.length
                      ) {
                        next.delete("gender");
                      } else {
                        next.set("gender", selectedGenders.join(","));
                      }

                      const selectedCategories = categories.filter(
                        (_, i) => checkedCategories[i],
                      );

                      if (
                        selectedCategories.length === 0 ||
                        selectedCategories.length === categories.length
                      ) {
                        next.delete("category");
                      } else {
                        next.set("category", selectedCategories.join(","));
                      }

                      if (sortBy === "Recommended") next.delete("sort");
                      else next.set("sort", sortBy);

                      next.delete("page");

                      return next;
                    });

                    setIsOpen(false);
                  }}
                  disabled={!hasChanges}
                  className="flex-1"
                >
                  Apply Filters
                </PrimaryButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default memo(FilterModal);
