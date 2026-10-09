import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetFeaturedProductsQuery,
  useGetRecentlyViewedQuery,
} from "../../redux/api/apiSlice.js";
import { lazy, Suspense } from "react";
import FadeIn from "@/components/common/FadeIn.jsx";
import HeroSection from "@/features/home/components/HeroSection.jsx";
import CategoriesSection from "@/features/home/components/CategoriesSection.jsx";
import ProductCard from "@/features/products/components/catalog/ProductCard.jsx";
const ProductQuickView = lazy(
  () => import("@/components/modals/ProductQuickViewModal.jsx"),
);
import EditorialSection from "@/features/home/components/EditorialSection.jsx";
import ErrorState from "@/components/feedback/error/ErrorState.jsx";
import ProductsLoadingState from "@/components/feedback/loading/ProductsLoadingState.jsx";
import EmptyState from "@/components/feedback/empty-state/EmptyState.jsx";
import TextButton from "@/components/ui/buttons/TextButton.jsx";

const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [previewProduct, setPreviewProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    useGetFeaturedProductsQuery();
  const products = data?.products || [];

  const {
    data: items,
    isLoading: loadingRecentlyViewed,
    error: recentlyViewedError,
    refetch: refetchRecentlyViewed,
    isFetching: fetchingRecentlyViewed,
  } = useGetRecentlyViewedQuery(undefined, {
    skip: !token,
  });

  const showRecentlyViewed =
    token &&
    (loadingRecentlyViewed ||
      fetchingRecentlyViewed ||
      recentlyViewedError ||
      items.length > 0);

  return (
    <>
      <div className="animate-fadeIn bg-white">
        <div className="space-y-20 sm:space-y-28">
          <HeroSection navigate={navigate} />
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-[1400px] mx-auto my-16 sm:my-20" />
          <FadeIn delay={100}>
            <CategoriesSection navigate={navigate} />
          </FadeIn>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-[1400px] mx-auto my-16 sm:my-20" />
          <FadeIn delay={200}>
            <div className="max-w-[1400px] mx-auto px-6 space-y-12 sm:space-y-16">
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
                  FEATURED COLLECTION
                </h2>
                <p className="text-gray-500 text-sm">
                  Handpicked styles for this season
                </p>
              </div>

              <div
                className="
    flex 
    sm:grid
    sm:grid-cols-2
    lg:grid-cols-3
    gap-6 sm:gap-8 lg:gap-10 
    overflow-x-auto 
    sm:overflow-visible
    scrollbar-hide 
    snap-x snap-mandatory sm:snap-none
    scroll-smooth
    pb-2 sm:pb-0
  "
              >
                {isLoading || isFetching ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductsLoadingState key={i} />
                  ))
                ) : isError ? (
                  <ErrorState
                    compact
                    refetch={refetch}
                    isFetching={isFetching}
                    title={"Failed to load featured products"}
                    description={
                      " Something went wrong while loading the featured collection. Please try again later."
                    }
                  />
                ) : products.length == 0 ? (
                  <EmptyState
                    compact
                    title={" No featured products available"}
                    description={
                      " New featured arrivals will appear here soon. Check back later for curated picks."
                    }
                  />
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="
                         
                          min-w-[220px]
                          w-[220px]
                        
                          sm:min-w-0
                          sm:w-auto
                          snap-start sm:snap-none
                        
                                  "
                    >
                      <ProductCard
                        product={product}
                        setOpen={setOpen}
                        setPreviewProduct={setPreviewProduct}
                      />
                    </div>
                  ))
                )}
              </div>
              {!isLoading && !isError && products.length > 0 && (
                <div className="flex justify-center pt-6">
                  <TextButton
                    className="tracking-[0.3em]"
                    onClick={() => navigate("/products")}
                  >
                    View All Products
                  </TextButton>
                </div>
              )}
            </div>
          </FadeIn>
          {showRecentlyViewed && (
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-[1400px] mx-auto my-16 sm:my-20" />
          )}
          {showRecentlyViewed && (
            <FadeIn delay={300}>
              <div className="max-w-[1400px] mx-auto px-6 space-y-12 sm:space-y-16">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
                    CONTINUE BROWSING
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Based on your recent activity
                  </p>
                </div>

                <div
                  className="
     flex 
    sm:grid
    sm:grid-cols-2
    lg:grid-cols-3
    gap-6 sm:gap-8 lg:gap-10 
    overflow-x-auto 
    sm:overflow-visible
    scrollbar-hide 
    snap-x snap-mandatory sm:snap-none
    scroll-smooth
    pb-2 sm:pb-0
  "
                >
                  {loadingRecentlyViewed || fetchingRecentlyViewed ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <ProductsLoadingState key={i} />
                    ))
                  ) : recentlyViewedError ? (
                    <ErrorState
                      compact
                      refetch={refetchRecentlyViewed}
                      isFetching={fetchingRecentlyViewed}
                      title="Failed to load recently viewed products"
                      description="We couldn't load your recently viewed products. Please try again."
                    />
                  ) : (
                    items.slice(0, 8).map((product) => (
                      <div
                        key={product._id}
                        className="
                         
                          min-w-[220px]
                          w-[220px]
                        
                          sm:min-w-0
                          sm:w-auto
                          snap-start sm:snap-none"
                      >
                        <ProductCard
                          product={product}
                          setOpen={setOpen}
                          setPreviewProduct={setPreviewProduct}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FadeIn>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-[1400px] mx-auto my-16 sm:my-20" />
          <FadeIn delay={400}>
            <EditorialSection navigate={navigate} />
          </FadeIn>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-[1400px] mx-auto my-16 sm:my-20" />
          <FadeIn delay={500}>
            <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28 text-center space-y-6">
              <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase">
                Nova Stone & Co.
              </p>

              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-gray-900">
                Designed with purpose, crafted with precision
              </h2>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
                A modern approach to everyday essentials — refined for comfort,
                movement, and simplicity.
              </p>
            </div>
          </FadeIn>
        </div>

        <Suspense fallback={null}>
          <ProductQuickView
            open={open}
            product={previewProduct}
            setOpen={setOpen}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
