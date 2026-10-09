import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetWishlistQuery,
  useAddRecentlyViewedMutation,
  useGetRecentlyViewedQuery,
} from "@/redux/api/apiSlice";
import { useWishlistApiMutation } from "@/redux/api/apiSlice";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";
const ProductQuickView = lazy(
  () => import("@/components/modals/ProductQuickViewModal"),
);
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import ProductCard from "@/features/products/components/catalog/ProductCard";
import ProductImage from "@/features/products/components/product-details/ProductImage";
import ProductImageSkeleton from "@/components/feedback/loading/ProductImageSkeleton";
import FadeIn from "@/components/common/FadeIn";
import ProductDetails from "@/features/products/components/product-details/ProductDetails";
import ProductDetailsSkeleton from "@/components/feedback/loading/ProductDetailsSkeleton";
import ProductTabSection from "@/features/products/components/product-details/ProductTabSection";
import ProductsLoadingState from "@/components/feedback/loading/ProductsLoadingState.jsx";
import ErrorState from "@/components/feedback/error/ErrorState.jsx";
import EmptyState from "@/components/feedback/empty-state/EmptyState.jsx";
import Skeleton from "@/components/ui/skeleton";

const Product = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const [size, setSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { data: wishlistData } = useGetWishlistQuery();
  const wishlist = wishlistData?.wishlist || [];

  const { data, isLoading, isError, refetch, isFetching } =
    useGetProductByIdQuery(id);
  const product = data?.product;
  const productDescription = data?.product?.description;
  const sizeData = product?.sizes?.find((s) => s.size === size);
  const maxStock = sizeData?.stock || 0;
  const returnPolicy = data?.returnPolicy;
  const shippingInfo = data?.shippingInfo;

  const sections = [
    {
      head: "PRODUCT INFO",
      content: product?.productInfo || [],
    },
    {
      head: "RETURN & REFUND POLICY",
      content: returnPolicy ? returnPolicy.split("\n") : [],
    },
    {
      head: "SHIPPING INFO",
      content: shippingInfo ? shippingInfo.split("\n") : [],
    },
  ];

  const {
    data: relatedProducts = [],
    isLoading: loadingRelatedProducts,
    isError: relatedProductsError,
    refetch: relatedProductsRefetch,
    isFetching: fetchingRelatedProducts,
  } = useGetRelatedProductsQuery(id);

  const displayedRelated = useMemo(
    () => relatedProducts.slice(0, 3),
    [relatedProducts],
  );

  const [toggleWishlist, { isLoading: loadingToggle }] =
    useWishlistApiMutation();
  const isInWishlist = wishlist.some((item) => item._id === product?._id);

  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);

  const [addRecentlyViewed] = useAddRecentlyViewedMutation();

  const {
    data: recentProducts,
    isLoading: loadingRecentlyViewed,
    isError: recentlyViewedError,
    refetch: refetchRecentlyViewed,
    isFetching: fetchingRecentlyViewed,
  } = useGetRecentlyViewedQuery();
  const filteredItems = useMemo(
    () => recentProducts?.filter((p) => p._id !== product?._id) ?? [],
    [recentProducts, product?._id],
  );

  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist]);

  useEffect(() => {
    if (size) {
      setQuantity(1);
    }
  }, [size]);

  useEffect(() => {
    if (!product?._id) return;

    addRecentlyViewed(product._id)
      .unwrap()
      .catch(() => {});
  }, [product?._id]);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
    }
  }, [product]);

  useEffect(() => {
    setSize("");
    setQuantity(1);
    setActiveImage(0);
  }, [product?._id]);

  const handleWishlist = async () => {
    if (loadingToggle) return;

    if (!token) {
      navigate("/auth", {
        state: { from: location.pathname },
      });
      return;
    }

    const previous = optimisticWishlist;

    setOptimisticWishlist(!previous);

    try {
      await toggleWishlist(product._id).unwrap();

      toast({
        description: previous ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (err) {
      setOptimisticWishlist(previous);

      toast({
        variant: "destructive",
        description: err?.data?.message || "Something went wrong. Try again.",
      });
    }
  };

  const handleAddToCart = (product) => {
    if (!size) {
      toast({
        variant: "destructive",
        description: "Select size first",
      });
      return;
    }

    const existingItem = cartItems.find(
      (item) => item._id === product._id && item.size === size,
    );
    const currentQty = existingItem?.qty || 0;

    if (currentQty + quantity > maxStock) {
      toast({
        variant: "destructive",
        title: "Stock limit reached",
        description: `Only ${maxStock} items available for this size`,
      });
      return;
    }
    dispatch(addToCart(product));
    toast({
      title: "Added to cart",
      description: `"${product.name}" added to cart.`,
      action: (
        <button
          onClick={() => navigate("/cart")}
          className="
        inline-flex
        items-center
        justify-center

        h-10
        min-w-[120px]
px-6

        rounded-none
        whitespace-nowrap

        border
        border-black

        bg-black
        text-white

        text-[11px]
        font-medium
        uppercase
        tracking-[0.18em]

        transition-colors
        duration-150

        hover-supported:hover:bg-white
        hover-supported:hover:text-black

        active:scale-[0.985]

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-black
        focus-visible:ring-offset-2
      "
        >
          VIEW CART
        </button>
      ),
    });

    if (open) {
      setOpen(false);
    }
    setSize("");
    setQuantity(1);
  };

  const showRecentlyViewed =
    token &&
    (loadingRecentlyViewed ||
      fetchingRecentlyViewed ||
      recentlyViewedError ||
      filteredItems.length > 0);

  if (isLoading || isFetching) {
    return (
      <div className="animate-fadeIn bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>
        <div className="max-w-[1400px] mx-auto pt-6 pb-10">
          <div className="grid md:grid-cols-2 gap-16 items-start px-4 sm:px-6">
            <ProductImageSkeleton />
            <ProductDetailsSkeleton />
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
        title="Unable to load product"
        description="Something went wrong while loading this product."
      />
    );
  }

  if (!product && !isLoading && !isError) {
    return (
      <EmptyState
        compact
        title="Product not found"
        description="This product may have been removed or is no longer available."
      />
    );
  }
  return (
    <>
      <div className="animate-fadeIn bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Breadcrumbs productName={product.name} />
        </div>
        <div className="max-w-[1400px] pt-6 pb-10 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start px-4 sm:px-6  ">
            <ProductImage
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              productDescription={productDescription}
            />
            <ProductDetails
              product={product}
              loadingToggle={loadingToggle}
              handleWishlist={handleWishlist}
              isInWishlist={optimisticWishlist}
              quantity={quantity}
              setQuantity={setQuantity}
              toast={toast}
              size={size}
              setSize={setSize}
              handleAddToCart={handleAddToCart}
              productDescription={productDescription}
              maxStock={maxStock}
              sections={sections}
            />
          </div>
        </div>

        <FadeIn>
          <ProductTabSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            productDescription={productDescription}
            id={id}
          />
        </FadeIn>

        <FadeIn>
          <div className="max-w-[1400px] mx-auto mt-10 flex flex-col  space-y-6 px-4 sm:px-6 ">
            <h2 className="text-xl font-light text-center tracking-wide">
              You May Also Like
            </h2>
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
              {loadingRelatedProducts || fetchingRelatedProducts ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductsLoadingState key={i} />
                ))
              ) : relatedProductsError ? (
                <ErrorState
                  compact
                  refetch={relatedProductsRefetch}
                  isFetching={fetchingRelatedProducts}
                  title={"Failed to load related products"}
                  description={
                    " Something went wrong while loading related products. Please try again later."
                  }
                />
              ) : displayedRelated.length === 0 ? (
                <EmptyState
                  compact
                  title="No related products"
                  description="We couldn't find similar items right now."
                />
              ) : (
                displayedRelated.map((product) => (
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
                      key={product._id}
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

        {showRecentlyViewed && (
          <FadeIn>
            <div className="max-w-[1400px] mx-auto mt-10 flex flex-col  space-y-6 px-4 sm:px-6 ">
              <h2 className="text-xl font-light text-center tracking-wide">
                Your Recently Viewed
              </h2>
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 overflow-x-auto sm:overflow-visible scrollbar-hide snap-x snap-mandatory sm:snap-none scroll-smooth pb-2 sm:pb-0">
                {loadingRecentlyViewed || fetchingRecentlyViewed ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductsLoadingState key={i} />
                  ))
                ) : recentlyViewedError ? (
                  <ProductsErrorState
                    compact
                    refetch={refetchRecentlyViewed}
                    isFetching={fetchingRecentlyViewed}
                    title="Failed to load recently viewed products"
                    description="We couldn't load your recently viewed products. Please try again."
                  />
                ) : (
                  filteredItems.slice(0, 8).map((product) => (
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
                        key={product._id}
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
      </div>
      <Suspense fallback={null}>
        <ProductQuickView
          open={open}
          product={previewProduct}
          setOpen={setOpen}
        />
      </Suspense>
    </>
  );
};

export default Product;
