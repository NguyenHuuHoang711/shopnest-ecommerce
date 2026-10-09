import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@/components/ui/skeleton";
import TextButton from "@/components/ui/buttons/TextButton";

const optimizeImage = (url, width = 150) =>
  `${url}&w=${width}&q=70&auto=format`;

const CartItem = ({
  item,
  increaseQty,
  decreaseQty,
  removeFromCart,
  formatCurrency,
}) => {
  const [loaded, setLoaded] = useState(false);

  const sizeData = item.sizes?.find((s) => s.size === item.size);
  const maxStock = sizeData?.stock || 0;

  return (
    <div className="grid grid-cols-[120px_1fr_auto] gap-3 py-10 group">
      <Link to={`/products/${item._id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}

          <img
            src={optimizeImage(item.images[0], 150)}
            alt={item.name || "Product image"}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            loading="lazy"
            decoding="async"
            draggable="false"
            width={150}
            height={200}
            className={`
        h-full
        w-full
        object-cover

        transition-all
        duration-150
        ease-out

        ${loaded ? "opacity-100" : "opacity-0"}

        hover-supported:hover:scale-[1.04]
      `}
          />
        </div>
      </Link>

      <div className="flex flex-col justify-between">
        <div className="space-y-3">
          <Link to={`/products/${item._id}`}>
            <p
              className="
        text-[15px]
        font-medium
        tracking-[-0.01em]
           text-black/65
 hover-supported:hover:text-black
        transition-opacity
        duration-150
      "
            >
              {item.name}
            </p>
          </Link>

          <div
            className="
      space-y-1

      text-[11px]

      tracking-[0.04em]

      text-black/45
    "
          >
            <p>Size — {item.size}</p>

            <p>
              Qty {item.qty} × {formatCurrency(item.price)}
            </p>
          </div>
        </div>

        {maxStock === 0 ? (
          <p className="text-xs mt-1 text-red-500">
            This item is now out of stock
          </p>
        ) : maxStock <= 3 ? (
          <p className="text-xs mt-1 text-orange-500">Only {maxStock} left</p>
        ) : null}

        <div className="flex items-center  justify-between border border-gray-500 px-1 py-1 w-[100px] select-none">
          <button
            disabled={item.qty === 1}
            className="w-8 h-8 flex items-center justify-center text-xl 
  text-black/[60] hover-supported:hover:text-black active:scale-[0.985]
  disabled:opacity-30 disabled:cursor-not-allowed
  transition-all"
            onClick={() => decreaseQty(item)}
          >
            −
          </button>
          <span>{item.qty}</span>
          <button
            disabled={item.qty >= maxStock}
            className="w-8 h-8 flex items-center justify-center text-xl 
 text-black/[60] hover-supported:hover:text-black active:scale-[0.985]
 disabled:opacity-30 disabled:cursor-not-allowed
 transition-all"
            onClick={() => increaseQty(item)}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex  flex-col justify-between items-end">
        <p>{formatCurrency(item.price * item.qty)}</p>

        <TextButton
          className="tracking-[0.12em]"
          onClick={() => removeFromCart(item)}
        >
          Remove
        </TextButton>
      </div>
    </div>
  );
};

export default memo(CartItem);
