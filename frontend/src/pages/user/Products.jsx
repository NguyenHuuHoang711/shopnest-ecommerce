import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  useGetProductsQuery,
  useGetSearchSuggestionsQuery,
} from "@/redux/api/apiSlice.js";
import { lazy, Suspense } from "react";
const ProductQuickView = lazy(
  () => import("@/components/modals/ProductQuickViewModal"),
);
const FilterModal = lazy(() => import("@/components/modals/FilterModal"));
import Filter from "@/features/products/components/catalog/Filter";
import ToolbarSec from "@/features/products/components/catalog/ToolbarSec";
import ProductsLoadingState from "@/components/feedback/loading/ProductsLoadingState";
import ProductsErrorState from "@/components/feedback/error/ErrorState";
import ProductCard from "@/features/products/components/catalog/ProductCard";
import PaginationComponent from "@/components/common/PaginationComponent";
import {
  useFilter,
  GENDERS as genders,
  CATEGORIES as categories,
} from "@/context/FilterContext";
import { useSearchParams } from "react-router-dom";
import ProductsEmptyState from "@/components/feedback/empty-state/EmptyState";

const Products = () => {
  const { isOpen, setValues, setChecked, setCheckedCategories, setSortBy } =
    useFilter();

  const [searchParams, setSearchParams] = useSearchParams();

  const appliedSortBy = searchParams.get("sort") || "Recommended";

  const appliedValues = [
    Number(searchParams.get("min")) || 0,
    Number(searchParams.get("max")) || 500,
  ];

  const selectedGenders =
    searchParams.get("gender")?.split(",").filter(Boolean) || [];

  const selectedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) || [];

  const appliedChecked = genders.map((g) => selectedGenders.includes(g));

  const appliedCheckedCategories = categories.map((c) =>
    selectedCategories.includes(c),
  );

  const page = Number(searchParams.get("page")) || 1;
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = searchParams.get("search") || "";

  const activeFilterCount =
    appliedChecked.filter(Boolean).length +
    appliedCheckedCategories.filter(Boolean).length +
    (appliedValues[0] !== 0 || appliedValues[1] !== 500 ? 1 : 0) +
    (appliedSortBy !== "Recommended" ? 1 : 0);

  const [previewProduct, setPreviewProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery(
    {
      page,
      limit: 8,
      gender: selectedGenders.join(","),
      category: selectedCategories.join(","),
      sort: appliedSortBy,
      min: appliedValues[0],
      max: appliedValues[1],
      search: debouncedSearch,
    },
  );
  const products = data?.products || [];
  const totalProducts = data?.totalProducts;

  const { data: suggestionData, isLoading: isSuggestionsLoading } =
    useGetSearchSuggestionsQuery(
      {
        search: debouncedSearch,
        gender: selectedGenders.join(","),
        category: selectedCategories.join(","),
        min: appliedValues[0],
        max: appliedValues[1],
      },
      {
        skip: !debouncedSearch,
      },
    );

  const setPage = (newPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (newPage <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(newPage));
        }

        return next;
      },
      { replace: false },
    );
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, searchParams.toString()]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === debouncedSearch) return;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (search.trim()) {
            next.set("search", search);
          } else {
            next.delete("search");
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch, setSearchParams]);

  useEffect(() => {
    if (debouncedSearch) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".search-wrapper")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const isSearchActive = debouncedSearch.trim() !== "";
  const isEmpty = !isLoading && products.length === 0;

  const handleReset = () => {
    setSearch("");

    setValues([0, 500]);
    setChecked(new Array(genders.length).fill(false));
    setCheckedCategories(new Array(categories.length).fill(false));
    setSortBy("Recommended");

    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <div className=" bg-white text-black animate-fadeIn">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Breadcrumbs />
        </div>
        <div className="main max-w-[1600px] mx-auto flex flex-col">
          <ToolbarSec
            search={search}
            setSearch={setSearch}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            debouncedSearch={debouncedSearch}
            suggestionData={suggestionData}
            isLoading={isSuggestionsLoading}
            totalProducts={totalProducts}
            appliedSortBy={appliedSortBy}
            setSearchParams={setSearchParams}
          />
          <div className="box relative flex-1 flex min-h-0 pt-6">
            <Filter
              genders={genders}
              categories={categories}
              activeFilterCount={activeFilterCount}
              appliedValues={appliedValues}
              appliedChecked={appliedChecked}
              appliedCheckedCategories={appliedCheckedCategories}
              appliedSortBy={appliedSortBy}
              setSearchParams={setSearchParams}
            />
            <div className="flex flex-col flex-1">
              <div
                className="
    grid
    grid-cols-2
    lg:grid-cols-3
    gap-x-4
    gap-y-8
    sm:gap-x-5
    sm:gap-y-9
    lg:gap-x-6
    lg:gap-y-10
    xl:gap-x-8
    px-4
    pb-12
    sm:px-6
    lg:px-8
  "
              >
                {isLoading || isFetching ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductsLoadingState key={i} />
                  ))
                ) : isError ? (
                  <ProductsErrorState
                    refetch={refetch}
                    isFetching={isFetching}
                    title={"Unable to Load Products"}
                    description={
                      "We couldn't load the products right now. Please try again in a moment."
                    }
                  />
                ) : isEmpty? (
                  <ProductsEmptyState
                    title={
                      isSearchActive
                        ? "No matching products"
                        : "No products found"
                    }
                    description={
                      isSearchActive
                        ? "Try a different keyword."
                        : "Try adjusting your filters."
                    }
                    showAction
                    actionText="Reset Filters"
                    onAction={handleReset}
                  />
                ) : (
                  products?.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      setOpen={setOpen}
                      setPreviewProduct={setPreviewProduct}
                      debouncedSearch={debouncedSearch}
                    />
                  ))
                )}
              </div>

              {!isError &&
                !isLoading &&
                products?.length > 0 &&
                data?.totalPages > 1 && (
                  <PaginationComponent
                    page={page}
                    setPage={setPage}
                    totalPages={data?.totalPages}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <FilterModal
          genders={genders}
          categories={categories}
          appliedValues={appliedValues}
          appliedChecked={appliedChecked}
          appliedCheckedCategories={appliedCheckedCategories}
          appliedSortBy={appliedSortBy}
          setSearchParams={setSearchParams}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ProductQuickView
          product={previewProduct}
          open={open}
          setOpen={setOpen}
        />
      </Suspense>
    </>
  );
};

export default Products;
