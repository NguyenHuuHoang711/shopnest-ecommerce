import React, { memo } from "react";
import { createPortal } from "react-dom";

const ProfileModal = ({
  profileOpen,
  setProfileOpen,
  handleClick,
  isLoading,
  isError,
  user,
  toast,
}) => {
  return createPortal(
    <div
      onClick={() => setProfileOpen(false)}
      className={`fixed inset-0 bg-black/30 z-[200] flex items-end md:hidden
    transition-opacity duration-300 backdrop-blur-md
    ${profileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white/80 rounded-t-2xl p-6 space-y-1
    max-h-[80vh] overflow-y-auto z-[200]
    transform transition-transform duration-300 ease-out
    ${profileOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}`}
      >
        <button
          onClick={(e) => handleClick(e, "/profile")}
          className="w-full text-left px-2 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
        >
          Profile
        </button>

        <button
          onClick={(e) => handleClick(e, "/orders")}
          className="w-full text-left px-2 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
        >
          Orders
        </button>

        <button
          onClick={(e) => handleClick(e, "/wishlist")}
          className="w-full text-left px-2 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
        >
          Wishlist
        </button>
        {!isLoading && !isError && user?.isAdmin && (
          <button
            onClick={(e) => handleClick(e, "/admin")}
            className="w-full text-left px-2 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
          >
            Admin Panel
          </button>
        )}

        <div className="h-[1px] bg-gray-100 my-1" />
        <button
          onClick={() => {
            localStorage.clear();
            window.dispatchEvent(new Event("storage"));
            window.location.replace("/");
          }}
          className="w-full text-left px-2 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] text-red-500 active:scale-[0.985]"
        >
          Logout
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default memo(ProfileModal);
