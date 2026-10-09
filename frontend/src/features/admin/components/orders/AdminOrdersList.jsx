import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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

const AdminOrdersList = ({
  order,
  statusStyles,
  formatCurrency,
  userName = null,
  userEmail = null,
  debouncedSearch = null,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/admin/orders/${order.orderId}`)}
      className="
      group
      relative
      min-h-[250px]
      overflow-hidden
      rounded-[28px]
      border border-black/[0.045]
      bg-white/[0.88]
      backdrop-blur-xl
      px-7 py-6
      shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
      hover-supported:hover:bg-white/[0.92]
      hover-supported:hover:shadow-[0_2px_6px_rgba(0,0,0,0.02),0_28px_80px_rgba(0,0,0,0.06)]
      active:scale-[0.985]
      transition-all duration-150 ease-out
      cursor-pointer
    "
    >
      <div
        className="
        absolute inset-0
        bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
        pointer-events-none
      "
      />

      <div
        className="
        absolute inset-0
        opacity-0
        hover-supported:group-hover:opacity-100
        transition-opacity duration-500
        bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_62%)]
        pointer-events-none
      "
      />

      <div
        className="
        absolute top-0 left-[-140%]
        h-px w-[120%]
        bg-gradient-to-r
        from-transparent
        via-white/70
        to-transparent
        hover-supported:group-hover:left-[140%]
        transition-all duration-1400 ease-out
      "
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p
              className="
              truncate
              text-[15px]
              font-medium
              tracking-[-0.025em]
              text-black/90
            "
            >
              {debouncedSearch
                ? highlightText(order.orderId, debouncedSearch)
                : order.orderId}
            </p>

            <p
              className="
              mt-[7px]
              text-[10px]
              font-medium
              tracking-[0.14em]
              uppercase
              text-black/30
            "
            >
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p
            className="
            shrink-0
            text-[18px]
            font-semibold
            tracking-[-0.045em]
            text-black/90
          "
          >
            {formatCurrency(order.finalAmount)}
          </p>
        </div>

        <div
          className="
          my-6
          h-px w-full
          bg-gradient-to-r
          from-transparent
          via-black/[0.05]
          to-transparent
        "
        />

        <div className="min-w-0">
          <p
            className="
            truncate
            text-[14px]
            font-medium
            tracking-[-0.01em]
            text-black/80
          "
          >
            {debouncedSearch !== null
              ? highlightText(order.user?.name, debouncedSearch)
              : userName
                ? userName
                : order.userId?.name}
          </p>

          <p
            className="
            mt-[7px]
            truncate
            text-[11px]
            text-black/35
          "
          >
            {debouncedSearch !== null
              ? highlightText(order.user?.email, debouncedSearch)
              : userEmail
                ? userEmail
                : order.userId?.email}
          </p>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <span
            className={`
            inline-flex
            items-center
            justify-center
            h-7
            min-w-[106px]
            rounded-full
            px-3
            text-[10px]
            font-semibold
            tracking-[0.12em]
            uppercase
            ring-1 ring-inset
            transition-all duration-300

            ${
              statusStyles[order.status] ||
              "bg-black/[0.03] text-black/60 ring-black/[0.05]"
            }
          `}
          >
            {order.status}
          </span>

          <div
            aria-label="button"
            className="
    inline-flex
    items-center
    gap-2

    text-[13px]
    font-medium

    text-black/70
    active:scale-[0.985]

    transition-colors
    duration-150

    hover-supported:group-hover:text-black
  "
          >
            View
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminOrdersList);
