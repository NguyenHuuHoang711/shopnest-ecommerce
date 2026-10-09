import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetWishlistQuery,
  useWishlistApiMutation,
} from "@/redux/api/apiSlice";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star } from "lucide-react";
import { addToCart } from "../../redux/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Skeleton from "@/components/ui/skeleton";

const stars = [1, 2, 3, 4, 5];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const optimizeImage = (url, width = 400) =>
  `${url}&w=${width}&q=75&auto=format`;

const ProductQuickView = ({ product, open, setOpen }) => {
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const { data } = useGetWishlistQuery();
  const wishlist = data?.wishlist || [];

  const [toggleWishlist, { isLoading: loadingToggle }] =
    useWishlistApiMutation();
  const isInWishlist = wishlist.some((item) => item._id === product?._id);

  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const sizeData = product?.sizes?.find((s) => s.size === size);
  const maxStock = sizeData?.stock || 0;

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

  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSize("");
        setQuantity(1);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

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
    setOpen(false);
    setSize("");
    setQuantity(1);
  };

  useEffect(() => {
    if (size) {
      setQuantity(1);
    }
  }, [size]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      setQuantity(1);
      setSize("");
    };
  }, [open]);

  const baseUrl = product?.images?.[0];

  const img300 = optimizeImage(baseUrl, 300);
  const img400 = optimizeImage(baseUrl, 400);
  const img600 = optimizeImage(baseUrl, 600);

  return createPortal(
    <AnimatePresence>
      {open && product && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4
  bg-black/30 backdrop-blur-md cursor-pointer"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white/80 relative border border-black/[0.045] will-change-transform max-w-2xl dark:bg-background w-full max-h-[90dvh] overflow-y-auto
scrollbar-none p-6 sm:p-8 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.2)] cursor-default"
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <div
              className="
              absolute inset-0
              bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_34%)]
              pointer-events-none
            "
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="overflow-hidden relative">
                  {!loaded && (
                    <Skeleton className="absolute inset-0 h-full w-full" />
                  )}
                  <motion.img
                    src={img400}
                    srcSet={`${img300} 300w, ${img400} 400w, ${img600} 600w`}
                    sizes="(max-width: 640px) 100vw, 400px"
                    onLoad={() => setLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    width={400}
                    height={533}
                    decoding="async"
                    draggable="false"
                    loading="lazy"
                    alt={product.name}
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className={`w-full h-full object-cover will-change-transform ${loaded ? "opacity-100" : "opacity-0"}`}
                  />
                  <div className="absolute top-3 right-3 z-[200]">
                    <button
                      aria-label={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      disabled={loadingToggle}
                      onClick={handleWishlist}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:scale-110 hover:shadow-md active:scale-[0.985] transition-all duration-150 ease-out"
                    >
                      <Heart
                        className={`
        w-5 h-5 transition-all duration-150
        ${optimisticWishlist ? "fill-black stroke-black" : "stroke-black"}
      `}
                      />
                    </button>
                  </div>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col space-y-8"
                >
                  <div className="space-y-2">
                    <motion.h2
                      className="text-2xl font-light line-clamp-2"
                      variants={item}
                    >
                      {product.name}
                    </motion.h2>
                    <motion.div
                      variants={item}
                      className="flex items-center gap-2 mt-1"
                    >
                      <div className="flex gap-[1px]">
                        {stars.map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              product?.ratingsAverage >= star
                                ? "fill-black stroke-black"
                                : "stroke-black/20"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-[11px] tracking-[-0.01em] text-black/45">
                        {product?.ratingsAverage?.toFixed(1)} (
                        {product?.ratingsCount})
                      </p>
                    </motion.div>
                    <motion.div variants={item}>
                      <div className="text-lg font-light">
                        {formatCurrency(product.price)}
                      </div>
                    </motion.div>
                    <motion.div variants={item}>
                      {!size ? (
                        <p className="text-xs text-gray-400">Select a size</p>
                      ) : maxStock === 0 ? (
                        <p className="text-xs text-red-500">Out of stock</p>
                      ) : maxStock <= 3 ? (
                        <p className="text-xs text-orange-500">
                          Only {maxStock} left
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">In stock</p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div variants={item} className="space-y-3">
                    <label className="text-[12px] font-medium text-black/65">
                      Size *
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => {
                        const selected = size === s.size;
                        const disabled = s.stock === 0;

                        return (
                          <button
                            key={s.size}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSize(s.size)}
                            className={`min-w-[52px] h-11 px-4 border text-[11px] font-medium uppercase tracking-[0.12em] transition-colors  duration-150
            ${
              selected
                ? "border-black bg-black text-white"
                : "border-black/[0.08] bg-white text-black"
            }

            ${
              disabled
                ? "cursor-not-allowed border-black/[0.05] text-black/25"
                : `
                  hover-supported:hover:bg-black
                  hover-supported:hover:text-white
                  active:scale-[0.985]
                `
            }
          `}
                          >
                            {s.size}
                          </button>
                        );
                      })}
                    </div>

                    {!size && (
                      <p className="text-[11px] text-red-500">
                        Please select a size.
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={item} className="quantity ">
                    <div className="flex items-center justify-between border border-gray-500 px-1 py-1 w-[110px] select-none">
                      <button
                        disabled={quantity === 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center text-xl text-black/[60] hover-supported:hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.985]"
                      >
                        −
                      </button>

                      <span className="text-sm font-medium w-6 text-center">
                        {quantity}
                      </span>

                      <button
                        disabled={quantity >= maxStock || !size}
                        onClick={() => {
                          if (!size) {
                            toast({
                              variant: "destructive",
                              description: "Select size first",
                            });
                            return;
                          }
                          if (quantity >= maxStock) return;
                          setQuantity((q) => Math.min(maxStock, q + 1));
                        }}
                        className="w-8 h-8 flex items-center justify-center text-xl text-black/[60] hover-supported:hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.985]"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                  <motion.div variants={item} className="addToCart ">
                    <PrimaryButton
                      className="w-full"
                      disabled={!size || maxStock === 0}
                      onClick={() =>
                        handleAddToCart({ ...product, qty: quantity, size })
                      }
                    >
                      {" "}
                      {!size
                        ? "Select a size"
                        : maxStock === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </PrimaryButton>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default memo(ProductQuickView);
