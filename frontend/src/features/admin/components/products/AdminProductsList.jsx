import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";

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

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num || 0);

const AdminProductsList = ({
  product,
  debouncedSearch,
  inventory,
  navigate,

  setSelectedItem,
}) => {
  return (
    <div
      className="
    
    group

    flex flex-col

    gap-5

    px-5 sm:px-7
    py-5

    border-b border-black/[0.04]

    transition-all duration-150

    hover-supported:hover:bg-black/[0.018]


  "
    >
      <div
        className="
      flex flex-col
      sm:flex-row

      sm:items-center
      sm:justify-between

      gap-5
    "
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="group  w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={`${product.images?.[0]}&w=60&q=75&auto=format`}
              srcSet={`
    ${product.images?.[0]}&w=60&q=75&auto=format 1x,
    ${product.images?.[0]}&w=120&q=75&auto=format 2x
  `}
              sizes="56px"
              alt={product.name}
              loading="lazy"
              decoding="async"
              draggable="false"
              fetchPriority="low"
              width={56}
              height={56}
              className="
    h-full
    w-full

    rounded-none

    object-cover

    will-change-transform

    transition-transform duration-150 ease-out

    hover-supported:group-hover:scale-[1.04]
  "
            />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
            truncate

            text-[14px]
            font-medium

            tracking-[-0.01em]

            text-black/90
          "
            >
              {debouncedSearch
                ? highlightText(product.name, debouncedSearch)
                : product.name}
            </p>

            <p
              className="
            mt-[6px]

            text-[11px]

            text-black/35
          "
            >
              {product.sizes.length} sizes available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <TextButton
            onClick={() => navigate(`/admin/products/${product._id}/edit`)}
            className="
          text-[11px]
          font-medium
          tracking-[0.05em]
        "
          >
            Edit
          </TextButton>

          <TextButton
            onClick={() => {
              setSelectedItem(product._id);
            }}
            className="
          text-[11px]
          tracking-[0.05em]
           text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
        "
          >
            Delete
          </TextButton>
        </div>
      </div>

      <div
        className="
      grid

      grid-cols-2
      sm:grid-cols-4
      xl:grid-cols-5

      gap-x-5
      gap-y-4
    "
      >
        <div className="space-y-1">
          <p
            className="
          text-[10px]
          font-medium

          tracking-[0.14em]

          uppercase

          text-black/30
        "
          >
            Category
          </p>

          <p
            className="
          text-[13px]

          text-black/70
        "
          >
            {product.category}
          </p>
        </div>

        <div className="space-y-1">
          <p
            className="
          text-[10px]
          font-medium

          tracking-[0.14em]

          uppercase

          text-black/30
        "
          >
            Gender
          </p>

          <p
            className="
          text-[13px]

          text-black/70
        "
          >
            {product.gender}
          </p>
        </div>

        <div className="space-y-1">
          <p
            className="
          text-[10px]
          font-medium

          tracking-[0.14em]

          uppercase

          text-black/30
        "
          >
            Price
          </p>

          <p
            className="
          text-[13px]
          font-medium

          tracking-[-0.01em]

          text-black/90
        "
          >
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="space-y-1">
          <p
            className="
          text-[10px]
          font-medium

          tracking-[0.14em]

          uppercase

          text-black/30
        "
          >
            Stock
          </p>

          <p
            className="
          text-[13px]

          text-black/70
        "
          >
            {inventory.totalStock}
          </p>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-4 xl:col-span-1">
          <p
            className="
          text-[10px]
          font-medium

          tracking-[0.14em]

          uppercase

          text-black/30
        "
          >
            Status
          </p>

          <div className="pt-[2px]">
            <span
              className={`
            inline-flex
            items-center
            justify-center

            h-7
            min-w-[96px]

            rounded-full

            px-3

            text-[10px]
            font-semibold

            tracking-[0.12em]

            uppercase

            ring-1 ring-inset

            transition-all duration-150

            ${inventory.styles}
          `}
            >
              {inventory.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminProductsList);
