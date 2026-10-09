import React, { memo, useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetWishlistQuery,
  useWishlistApiMutation,
} from "@/redux/api/apiSlice";
import { toast } from "@/hooks/use-toast";

const stars = [1, 2, 3, 4, 5];

const highlightText = (text, query) => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, "gi");

  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={i}
        className="
          text-black
          bg-black/[0.05]
        "
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const optimizeImage = (url, width = 400) =>
  `${url}&w=${width}&q=75&auto=format`;

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const ProductCard = ({
  product,
  setOpen,
  setPreviewProduct,
  debouncedSearch,
}) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { data } = useGetWishlistQuery();
  const wishlist = data?.wishlist || [];

  const [toggleWishlist, { isLoading: loadingToggle }] =
    useWishlistApiMutation();

  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);

  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist]);

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

  const hasStock = product?.sizes?.some((s) => s.stock > 0);

  const baseUrl = product?.images?.[0];

  const img300 = optimizeImage(baseUrl, 300);
  const img400 = optimizeImage(baseUrl, 400);
  const img600 = optimizeImage(baseUrl, 600);
  return (
    <div className="w-full group relative">
      <div
        className=" aspect-[4/5]
        sm:aspect-[5/6]
        lg:aspect-[3/4] overflow-hidden bg-black/5"
      >
        <Link to={`/products/${product._id}`} aria-label={product.name}>
          <img
            src={img400}
            srcSet={`${img300} 300w, ${img400} 400w, ${img600} 600w`}
            sizes="(max-width: 640px) 100vw, 400px"
            loading="lazy"
            draggable="false"
            width={400}
            height={533}
            decoding="async"
            alt={product.name}
            className="
            w-full
            h-full
            object-cover
            active:scale-[0.985]
           transition-[transform,filter]
duration-150
ease-out

            hover-supported:group-hover:scale-[1.045]
            hover-supported:group-hover:brightness-[0.985]
          "
          />
        </Link>
      </div>

      <div
        className="
    absolute top-2 left-2

    rounded-none

    border border-white/10

    bg-black/80

    px-2.5
    py-1

    text-[9px]
    font-medium

    uppercase

    tracking-[0.16em]

    text-white

    shadow-[0_4px_14px_rgba(0,0,0,0.08)]

    sm:text-[10px]
  "
      >
        {hasStock ? "IN STOCK" : "OUT OF STOCK"}
      </div>

      <div
        className="
    absolute top-2 right-2 z-10

    opacity-100

    hover-supported:opacity-0
    hover-supported:group-hover:opacity-100

    transition-opacity
    duration-150
  "
      >
        <button
          disabled={loadingToggle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleWishlist();
          }}
          className="
    p-1.5
     sm:p-2

    rounded-full

    border border-black/5

    bg-white/80
    backdrop-blur-md

    shadow-[0_6px_18px_rgba(0,0,0,0.08)]

    transform-gpu

    transition-[transform,box-shadow]
    duration-150
    ease-out

    hover-supported:hover:scale-110
    hover-supported:hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]

    active:scale-[0.985]
    active:hover:scale-[0.985]
  "
        >
          <Heart
            className={`
            sm:w-5 sm:h-5
            w-4 h-4

            transition-all duration-150

            ${optimisticWishlist ? "fill-black stroke-black" : "stroke-black"}
          `}
          />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-32 flex justify-center pointer-events-none">
        <button
          onClick={(e) => {
            e.preventDefault();
            setPreviewProduct(product);
            setOpen(true);
          }}
          className="
          hidden
          hover-supported:block
      pointer-events-auto

      h-11
      w-[85%]

      border
      border-white

      rounded-none

      bg-white
      text-black

      text-[11px]
      font-medium
      uppercase
      tracking-[0.18em]
      leading-none

      opacity-0
      translate-y-2

      hover-supported:group-hover:opacity-100
      hover-supported:group-hover:translate-y-0

      transition-all
      duration-150

      hover-supported:hover:bg-black
      hover-supported:hover:text-white
      hover-supported:hover:border-black

      active:scale-[0.985]

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-white
      focus-visible:ring-offset-2
      focus-visible:ring-offset-black
    "
        >
          QUICK VIEW
        </button>
      </div>

      <div className="mt-3 min-w-0 text-left">
        <p
          className="
      min-h-[40px]

      line-clamp-2

      text-[13px]
      sm:text-[14px]

      font-medium

      leading-5

      tracking-[-0.01em]

      text-black/65

      transition-colors
      duration-150

      hover-supported:group-hover:text-black
    "
        >
          {debouncedSearch
            ? highlightText(product.name, debouncedSearch)
            : product.name}
        </p>

        <div className="mt-0.5">
          <div className="flex gap-0.5">
            {stars.map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  product?.ratingsAverage >= star
                    ? "fill-black stroke-black"
                    : "stroke-black/20"
                }`}
              />
            ))}
          </div>

          <p
            className="
        mt-0.5

        text-[11px]

        tracking-[-0.01em]

        text-black/45
      "
          >
            {product?.ratingsAverage?.toFixed(1)} ({product?.ratingsCount})
          </p>
        </div>

        <p
          className="
      mt-1

      text-[14px]
      sm:text-[15px]

      font-medium

      tracking-[-0.01em]

      text-black/90
    "
        >
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
};

export default memo(ProductCard);
