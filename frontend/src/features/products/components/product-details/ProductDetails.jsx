import React, { memo } from "react";
import { Heart, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const stars = [1, 2, 3, 4, 5];

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const ProductDetails = ({
  product,
  loadingToggle,
  handleWishlist,
  isInWishlist,
  quantity,
  setQuantity,
  toast,
  size,
  setSize,
  handleAddToCart,
  productDescription,
  maxStock,
  sections,
}) => {
  return (
    <div className="space-y-10 sm:sticky sm:top-[76px]  h-fit bg-white/70 backdrop-blur-md  rounded-xl">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4 pr-2">
          <h1 className="text-3xl line-clamp-2 sm:text-4xl font-light tracking-wide">
            {product.name}
          </h1>

          <button
            disabled={loadingToggle}
            onClick={handleWishlist}
            className="
     p-2 rounded-full 
     bg-white/80 backdrop-blur-md
     shadow-[0_6px_18px_rgba(0,0,0,0.08)]
     hover:scale-110 hover:shadow-md active:scale-95
     transition-all duration-150 ease-out"
          >
            <Heart
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              className={`
       w-5 h-5 transition-all duration-300
       ${isInWishlist ? "fill-black stroke-black" : "stroke-black"}
     `}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-[1px]">
            {stars.map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  product?.ratingsAverage >= star
                    ? "fill-black stroke-black"
                    : "stroke-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-[11px] text-gray-500">
            {product?.ratingsAverage?.toFixed(1)} ({product?.ratingsCount})
          </p>
        </div>

        <p className="text-xl font-light">{formatCurrency(product.price)}</p>

        {!size ? (
          <p className="text-xs text-gray-400">Select a size</p>
        ) : maxStock === 0 ? (
          <p className="text-xs text-red-500">Out of stock</p>
        ) : maxStock <= 3 ? (
          <p className="text-xs text-orange-500">Only {maxStock} left</p>
        ) : (
          <p className="text-xs text-gray-400">In stock</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          className="
    text-[12px]
    font-medium
    text-black/65
  "
        >
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
                className={`
            min-w-[52px]
            h-11
            px-4

            border

            text-[11px]
            font-medium
            uppercase
            tracking-[0.12em]

            transition-colors
            duration-150

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

        {!size.length && (
          <p className="text-red-500 text-xs">Please select a size</p>
        )}
      </div>
      <div className="flex items-center  justify-between border border-gray-500 px-3 py-2 w-[140px] select-none">
        <button
          disabled={quantity === 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center text-xl 
    text-black/[60] hover-supported:hover:text-black
    disabled:opacity-30 disabled:cursor-not-allowed 
    transition-all active:scale-[0.985]"
        >
          −
        </button>

        <span className="text-sm font-medium w-6 text-center">{quantity}</span>

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
          className="w-8 h-8 flex items-center justify-center text-xl text-black/[60] hover-supported:hover:text-black
    disabled:opacity-30 disabled:cursor-not-allowed
    transition-all active:scale-[0.985]"
        >
          +
        </button>
      </div>
      <PrimaryButton
        className="w-full"
        disabled={!size || maxStock === 0}
        onClick={() => handleAddToCart({ ...product, qty: quantity, size })}
      >
        {" "}
        {!size
          ? "Select Size"
          : maxStock === 0
            ? "Out of Stock"
            : "Add to Cart"}
      </PrimaryButton>
      <p className="sm:hidden text-sm text-gray-500 leading-relaxed">
        {productDescription}
      </p>

      <Accordion type="single" collapsible>
        {sections.map((section, idx) => (
          <AccordionItem key={idx} value={`Item-${idx}`}>
            <AccordionTrigger className="font-light text-sm tracking-wide hover-supported:hover:no-underline">
              {section.head}
            </AccordionTrigger>

            <AccordionContent className="text-gray-500 text-sm space-y-2 leading-relaxed">
              {section.content.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default memo(ProductDetails);
