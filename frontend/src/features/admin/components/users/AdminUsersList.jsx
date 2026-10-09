import { ArrowRight } from "lucide-react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

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

const AdminUsersList = ({ user, debouncedSearch }) => {
  const navigate = useNavigate();

  const roleStyles =
    user.role === "Admin"
      ? "border-black/[0.06] bg-black/[0.92] text-white"
      : "border-black/[0.045] bg-black/[0.03] text-black/58";
  return (
    <div
      onClick={() => navigate(`/admin/users/${user._id}`)}
      className="
              group
              flex flex-col gap-5
              px-6
              py-5
              transition-colors duration-150
              hover-supported:hover:bg-black/[0.015]
              sm:flex-row
              sm:items-center
              sm:justify-between
              cursor-pointer
            "
    >
      <div className="flex min-w-0 items-center gap-4 flex-1">
        <div
          className="
                  flex items-center justify-center
                  h-12
                  w-12
                  shrink-0
                  rounded-full
                  bg-black/[0.92]
                  text-[14px]
                  font-medium
                  text-white
                  shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                "
        >
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p
            className="
                    truncate
                    text-[14px]
                    font-medium
                    tracking-[-0.01em]
                    text-black/85
                  "
          >
            {debouncedSearch
              ? highlightText(user?.name, debouncedSearch)
              : user?.name}
          </p>

          <div
            className="
                    flex flex-wrap items-center gap-2
                    text-[12px]
                    text-black/40 
                  "
          >
            <span>ID: {user._id.slice(-6)}</span>
            <span className="h-1 w-1 rounded-full bg-black/18" />
            <span className="truncate">
              {debouncedSearch
                ? highlightText(user?.email, debouncedSearch)
                : user?.email}
            </span>
          </div>
        </div>
      </div>

      <div
        className="
                flex items-center justify-between gap-4
                sm:justify-end
              "
      >
        <div
          className="
                  hidden lg:block
                  text-[13px]
                  text-black/40
                "
        >
          {new Date(user.createdAt).toLocaleDateString()}
        </div>

        <span
          className={`
                  inline-flex items-center justify-center
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  tracking-[0.08em]
                  whitespace-nowrap
                  ${roleStyles}
                `}
        >
          {user.role}
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
  );
};

export default memo(AdminUsersList);
