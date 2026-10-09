import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";

const OrderCard = ({
  item,
  img,
  order,
  openReview,
  setReviewToDelete,
  existingReview,
}) => {
  return (
    <div
      key={item.productId._id}
      className="
    group

    flex
    gap-4

    rounded-lg

    border
    border-black/[0.05]

    bg-white

    p-4
    sm:p-5

    transition-all
    duration-150

    hover-supported:hover:border-black/[0.08]
    hover-supported:hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]
  "
    >
      <div
        className="
    shrink-0
    w-16 h-20
    sm:w-[72px] sm:h-[92px]
    overflow-hidden
    bg-black/5
  "
      >
        <img
          src={`${img}&w=160&q=75&auto=format`}
          srcSet={`
      ${img}&w=160&q=75&auto=format 1x,
      ${img}&w=320&q=75&auto=format 2x
    `}
          sizes="72px"
          alt={item.productId?.name || "Product image"}
          loading="lazy"
          decoding="async"
          draggable="false"
          fetchPriority="low"
          className="
      h-full
      w-full
      object-cover
      transition-transform
      duration-150
      hover-supported:group-hover:scale-[1.04]
    "
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div>
          <h3
            className="
          text-[13px]
          sm:text-sm

          font-medium

          leading-relaxed

          text-black/85

          line-clamp-2
        "
          >
            {item.productId?.name}
          </h3>

          <p
            className="
          mt-2

          text-[11px]
          sm:text-xs

          tracking-wide

          text-black/45
        "
          >
            {item.sizes.map((s, i) => (
              <span key={i}>
                {s.size} ({s.quantity}){i !== item.sizes.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p
            className="
          mt-1

          text-[11px]
          sm:text-xs

          text-black/35
        "
          >
            Total Qty: {item.totalQuantity}
          </p>
        </div>

        {order.status === "Delivered" && (
          <div
            className="
          mt-auto

          pt-4

          flex
          items-center

          gap-5
        "
          >
            <TextButton onClick={() => openReview(item.productId)}>
              {existingReview ? "Edit Review" : "Write Review"}
            </TextButton>

            {existingReview && (
              <TextButton
                onClick={() => {
                  setReviewToDelete(existingReview);
                }}
                className="
    text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
  "
              >
                Delete Review
              </TextButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(OrderCard);
