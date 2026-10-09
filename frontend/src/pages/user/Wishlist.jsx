import React, { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductCard from "@/features/products/components/catalog/ProductCard";
const ProductQuickView = lazy(
  () => import("@/components/modals/ProductQuickViewModal"),
);
import { useGetWishlistQuery } from "@/redux/api/apiSlice";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import ProductsLoadingState from "@/components/feedback/loading/ProductsLoadingState";

const Wishlist = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWishlistQuery();

  const wishlist = data?.wishlist ?? [];

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="bg-white text-black animate-fadeIn min-h-[60vh]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Breadcrumbs />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-10">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide mb-8">
            Wishlist
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductsLoadingState key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load wishlist"
        description="We couldn't load your saved items right now. Please try again."
      />
    );
  }

  if (wishlist.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save your favorite products and keep them all in one place."
        showAction
        actionText="Explore Products"
        onAction={() => navigate("/products")}
      />
    );
  }
  return (
    <>
      <AnimatePresence mode="popLayout">
        <div className="bg-white text-black animate-fadeIn min-h-[60vh]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-8">
            <Breadcrumbs />
          </div>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-10">
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide mb-8">
              Wishlist ({wishlist.length})
            </h1>
            <div className=" grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="h-full"
                  >
                    <ProductsLoadingState />
                  </motion.div>
                ))
              ) : (
                <AnimatePresence>
                  {wishlist.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="h-full"
                    >
                      <ProductCard
                        product={item}
                        setOpen={setOpen}
                        setPreviewProduct={setPreviewProduct}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </AnimatePresence>

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

export default Wishlist;
