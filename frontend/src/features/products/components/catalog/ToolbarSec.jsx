import React, { memo, useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/context/FilterContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  GENDERS as genders,
  CATEGORIES as categories,
} from "@/context/FilterContext";
import Skeleton from "@/components/ui/skeleton";

const sortOptions = [
  "Recommended",
  "Newest Arrivals",
  "Price: Low to High",
  "Price: High to Low",
];

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const ToolbarSec = ({
  search,
  setSearch,
  showSuggestions,
  setShowSuggestions,
  debouncedSearch,
  suggestionData,
  isLoading,
  totalProducts,
  appliedSortBy,
  setSearchParams,
}) => {
  const { setIsOpen, setValues, setChecked, setCheckedCategories, setSortBy } =
    useFilter();

  const [searchParams] = useSearchParams();

  const appliedValues = [
    Number(searchParams.get("min")) || 0,
    Number(searchParams.get("max")) || 500,
  ];

  const appliedChecked = genders.map((g) =>
    (searchParams.get("gender")?.split(",") || []).includes(g),
  );

  const appliedCheckedCategories = categories.map((c) =>
    (searchParams.get("category")?.split(",") || []).includes(c),
  );

  const openFilterModal = () => {
    setValues([...appliedValues]);
    setChecked([...appliedChecked]);
    setCheckedCategories([...appliedCheckedCategories]);
    setSortBy(appliedSortBy);

    setIsOpen(true);
  };

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="
      sticky top-14 z-40
      border-b border-black/[0.04]
      bg-white/95
      backdrop-blur-sm
    "
    >
      <div
        className="
        flex flex-col gap-4
        px-4 py-3
        sm:px-6
        lg:flex-row lg:items-center lg:justify-between
      "
      >
        <div className="shrink-0">
          <div
            className={`
    ${
      scrolled
        ? "text-[13px] tracking-[0.18em] text-black/35"
        : "text-[18px] tracking-[0.14em] text-black/45"
    }
    uppercase
    font-medium
    transition-all
    duration-150
    ease-out
  `}
          >
            {!totalProducts ? "Results" : `Results (${totalProducts})`}
          </div>
        </div>

        <div
          className="
          flex min-w-0 items-center gap-2 sm:gap-3
        "
        >
          <div className="relative flex-1 lg:flex-none group">
            <input
              type="text"
              autoComplete="off"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowSuggestions(false);
                }
              }}
              className={`
              relative h-12
              w-full lg:w-[260px]
              rounded-lg
              border
              ${
                search.trim()
                  ? "border-black/[0.08] bg-black/[0.03]"
                  : "border-black/[0.05] bg-white/[0.92]"
              }
              pl-11
              pr-4
              text-base
              sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
              placeholder:text-black/40
              outline-none
              shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              [transition-timing-function:cubic-bezier(.22,1,.36,1)]
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              focus:shadow-[0_8px_40px_rgba(0,0,0,0.05)]
            `}
            />

            <span
              className={`
              absolute left-4 top-1/2
              z-20
              -translate-y-1/2
              text-[12px]
              transition-colors
              duration-150

              ${
                search.trim()
                  ? "text-black/55"
                  : "text-black/30 group-focus-within:text-black/50"
              }
            `}
            >
              <Search size={16} strokeWidth={2} />
            </span>

            {showSuggestions && debouncedSearch?.trim().length >= 2 && (
              <div
                className="
                absolute left-0 top-full z-50 mt-2
                w-full overflow-hidden

                rounded-2xl
                border border-black/[0.06]

                bg-white/90
                backdrop-blur-md
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
              "
              >
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="
                      flex items-center gap-3
                      px-3 py-3
                      animate-pulse
                    "
                    >
                      <Skeleton className="h-12 w-12 bg-black/5" />

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-3/4 bg-black/5" />
                        <Skeleton className="h-2.5 w-1/3 bg-black/5" />
                      </div>
                    </div>
                  ))
                ) : suggestionData?.products?.length > 0 ? (
                  <>
                    {suggestionData.products.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => {
                          navigate(`/products/${p._id}`);
                          setShowSuggestions(false);
                        }}
                        className="
      group/suggestion
      flex items-start gap-3
      cursor-pointer
      px-3 py-3
      overflow-hidden
      transition-colors
      duration-150
      hover-supported:hover:bg-black/[0.03]
    "
                      >
                        <img
                          src={`${p.images[0]}&w=80&q=75&auto=format`}
                          alt={p.name}
                          loading="lazy"
                          width={56}
                          height={56}
                          className="
        h-12
        w-12
        shrink-0    
        object-cover
        transition-transform
        duration-150
        ease-out
        group-hover/suggestion:scale-[1.04]
      "
                        />

                        <div className="min-w-0 flex-1 pt-[1px]">
                          <p
                            className="
          line-clamp-2
          text-sm
          leading-5
          tracking-[-0.01em]
          text-black/80
        "
                          >
                            {p.name}
                          </p>

                          <p
                            className="
          mt-1
          text-[11px]
          tracking-[0.01em]
          text-black/40
        "
                          >
                            {formatCurrency(p.price)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div
                      aria-label="button"
                      onClick={() => setShowSuggestions(false)}
                      className="
                      border-t border-black/[0.05]
                      py-3
                      text-center
                      text-[11px]
                      uppercase
                      tracking-[0.03em]
                      text-black/80
                      transition-colors
                      duration-150
                      hover-supported:hover:bg-black/[0.03]
                      hover-supported:hover:text-black
                      cursor-pointer
                    "
                    >
                      View all results
                    </div>
                  </>
                ) : (
                  <div
                    className="
                    px-4 py-4
                    text-[12px]
                    text-black/40
                  "
                  >
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={openFilterModal}
            className="flex lg:hidden shrink-0 items-center justify-center h-12 px-6 border border-black bg-white text-black text-[11px] font-medium uppercase tracking-[0.18em] leading-none whitespace-nowrap transition-colors duration-150 hover-supported:hover:bg-black hover-supported:hover:text-white
    active:scale-[0.985]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-black
    focus-visible:ring-offset-2
  "
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            FILTERS
          </button>

          <Select
            value={appliedSortBy}
            onValueChange={(value) => {
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (value === "Recommended") {
                  next.delete("sort");
                } else {
                  next.set("sort", value);
                }

                next.delete("page");

                return next;
              });
            }}
          >
            <SelectTrigger
              className={`
                hidden
                lg:flex
              h-12
              w-[160px] sm:w-[180px]
              shrink-0
              rounded-lg
              border

              ${
                appliedSortBy !== "Recommended"
                  ? "border-black/[0.08] bg-black/[0.03]"
                  : "border-black/[0.05] bg-white/[0.92]"
              }

              px-4
              text-sm
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
              {sortOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
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
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default memo(ToolbarSec);
