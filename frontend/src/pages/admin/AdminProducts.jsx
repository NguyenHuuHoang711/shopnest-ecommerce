import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import AdminProductsFilter from "@/features/admin/components/products/AdminProductsFilter";
import AdminProductsSkeleton from "@/components/feedback/loading/AdminProductsSkeleton";
import AdminProductsList from "@/features/admin/components/products/AdminProductsList";
import PaginationComponent from "@/components/common/PaginationComponent";
const ConfirmDialog = lazy(() => import("@/components/modals/ConfirmModal"));
import { toast } from "@/hooks/use-toast";
import {
  useDeleteAdminProductMutation,
  useGetAdminProductsQuery,
} from "@/redux/api/apiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorState from "@/components/feedback/error/ErrorState";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import AdminEmptyState from "@/components/feedback/empty-state/AdminEmptyState";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "All",
  );
  const [genderFilter, setGenderFilter] = useState(
    searchParams.get("gender") || "All",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [selectedItem, setSelectedItem] = useState(null);

  const {
    data,
    isLoading: loadingProducts,
    isError: productsError,
    refetch,
    isFetching,
  } = useGetAdminProductsQuery({
    page,
    limit: 8,
    gender: genderFilter,
    category: categoryFilter,
    search: debouncedSearch,
  });

  const products = data?.products || [];

  const [deleteAdminProducts, { isLoading: deleting }] =
    useDeleteAdminProductMutation();

  const handleDelete = async (id) => {
    if (deleting) {
      return;
    }
    try {
      const res = await deleteAdminProducts(id).unwrap();

      toast({
        description: res.message || "Product deleted",
      });

      setSelectedItem(null);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Unable to delete product",
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());

    if (categoryFilter !== "All") params.set("category", categoryFilter);

    if (genderFilter !== "All") params.set("gender", genderFilter);

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    setSearchParams(params, { replace: true });
  }, [page, categoryFilter, genderFilter, debouncedSearch, setSearchParams]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, genderFilter]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, debouncedSearch, genderFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const getInventoryData = (product) => {
    const totalStock = product?.sizes?.reduce(
      (acc, size) => acc + size.stock,
      0,
    );

    let label = "In Stock";
    let styles = "bg-green-50 text-green-700 ring-green-100";

    if (totalStock === 0) {
      label = "Out of Stock";
      styles = "bg-red-50 text-red-700 ring-red-100";
    } else if (totalStock < 10) {
      label = "Low Stock";
      styles = "bg-yellow-50 text-yellow-700 ring-yellow-100";
    }

    return {
      totalStock,
      label,
      styles,
    };
  };

  const totalProducts = useMemo(() => {
    return data?.total || products.length;
  }, [data, products]);

  const hasFilters =
    debouncedSearch.trim() !== "" ||
    categoryFilter !== "All" ||
    genderFilter !== "All";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
        <div className="flex flex-col">
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
          text-black/35
        "
            >
              Inventory
            </p>
          </div>

          <h1
            className="
        mt-4

        text-[32px]
        leading-none

        font-semibold
        tracking-[-0.06em]

        text-black/90
      "
          >
            Products
          </h1>

          <p
            className="
        mt-3

        text-[13px]

        text-black/40
      "
          >
            Manage your catalog, inventory and product visibility
          </p>
        </div>

        <PrimaryButton onClick={() => navigate("/admin/products/new")}>
          Add Product
        </PrimaryButton>
      </div>

      <AdminProductsFilter
        search={search}
        setSearch={setSearch}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <div
        className="
    relative

    overflow-hidden

    rounded-[30px]

    border border-black/[0.045]

    bg-white/[0.72]
    backdrop-blur-2xl

    shadow-[0_1px_2px_rgba(0,0,0,0.015),0_24px_80px_rgba(0,0,0,0.045)]
  "
      >
        <div
          className="
      absolute inset-0

      bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_34%)]

      pointer-events-none
    "
        />

        <div className="relative z-10">
          <div
            className="
        flex items-center justify-between

        px-7 py-5

        border-b border-black/[0.045]
      "
          >
            <p
              className="
        text-[11px]
        uppercase
        tracking-[0.18em]
        text-black/35
        "
            >
              Product Catalog
            </p>

            {!loadingProducts && !productsError && (
              <div
                className="
               text-[11px]
               font-medium
               
               tracking-[0.08em]
               
               text-black/35
               "
              >
                {totalProducts} Products
              </div>
            )}
          </div>

          <div>
            {loadingProducts || isFetching ? (
              <div className=" divide-y divide-black/[0.04] ">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AdminProductsSkeleton key={i} />
                ))}
              </div>
            ) : productsError ? (
              <ErrorState
                compact
                refetch={refetch}
                isFetching={isFetching}
                title={" Failed to load products"}
                description={
                  " Something went wrong while loading the catalog. Please try again later."
                }
              />
            ) : products?.length === 0 ? (
              <AdminEmptyState
                products
                compact
                hasFilters={hasFilters}
                filtersTitle={"No matching products"}
                filtersDescription={"Try adjusting your search or filters."}
                emptyTitle={"No products yet"}
                emptyDescription={
                  "Start building your storefront by adding your first product."
                }
                setSearch={setSearch}
                setCategoryFilter={setCategoryFilter}
                setGenderFilter={setGenderFilter}
              />
            ) : (
              products.map((product) => {
                const inventory = getInventoryData(product);

                return (
                  <AdminProductsList
                    key={product._id}
                    product={product}
                    debouncedSearch={debouncedSearch}
                    inventory={inventory}
                    navigate={navigate}
                    setSelectedItem={setSelectedItem}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {!loadingProducts &&
        !productsError &&
        products?.length > 0 &&
        data?.totalPages > 1 && (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={data.totalPages || 1}
          />
        )}

      <Suspense fallback={null}>
        <ConfirmDialog
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onConfirm={handleDelete}
          isLoading={deleting}
          title="Delete product?"
          description="This action cannot be undone."
          confirmText="Delete"
        />
      </Suspense>
    </div>
  );
};

export default AdminProducts;
