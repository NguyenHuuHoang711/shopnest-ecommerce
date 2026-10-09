import React, { memo } from "react";
import { createPortal } from "react-dom";

const NavModal = ({ isOpen, setIsOpen, NavLink, NAV_ITEMS }) => {
  return createPortal(
    <div>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 z-[200] transition-opacity 
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        
        `}
      />
      <div
        className={`fixed inset-0 bg-white/80 backdrop-blur-md z-[200] flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-b-black/10">
          <span className="text-sm tracking-widest font-light">MENU</span>
          <button className="text-[22px]" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center gap-12 text-2xl font-light tracking-wide">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `
      relative transition-all duration-150 active:scale-[0.985]
      ${isActive ? "text-black cursor-default pointer-events-none" : "text-black/60"}
      ${!isActive ? "hover-supported:hover:text-black" : ""}
      `
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} NOVA STONE
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default memo(NavModal);
