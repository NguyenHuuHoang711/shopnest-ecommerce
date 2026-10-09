import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = ({ productName }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs tracking-wide text-gray-500">
      <Link
        to="/"
        className="
      transition-colors duration-200
      hover-supported:hover:text-black
    "
      >
        Home
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        const displayName =
          isLast && productName
            ? productName
            : segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <span className="opacity-40">/</span>

            {isLast ? (
              <span className="text-black font-light tracking-wide">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="
              transition-colors duration-200
              hover-supported:hover:text-black
            "
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
