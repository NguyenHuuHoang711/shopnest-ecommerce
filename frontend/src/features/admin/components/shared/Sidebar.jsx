import React, { memo, useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "@/redux/api/apiSlice";
import Skeleton from "@/components/ui/skeleton";
import { ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: Package,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const { data, isLoading, isError } = useGetProfileQuery();
  const user = data?.user;

  return (
    <>
      <div
        className="
        lg:hidden fixed top-0 left-0 right-0 z-40 h-16 px-5 flex items-center justify-between bg-white/80
      backdrop-blur-md border-b border-black/[0.04]"
      >
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-gray-700 active:scale-[0.96] transition-all duration-150"
        >
          <Menu size={18} />
        </button>

        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[11px] w-20 rounded-full" />
              <Skeleton className="h-[9px] w-14 rounded-full self-end" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight text-right">
              <span className="text-[14px] font-medium tracking-[-0.01em] text-black/80">
                Admin
              </span>

              <span className="mt-[5px] text-[10px] font-medium tracking-[0.12em] uppercase text-red-500/70">
                Offline
              </span>
            </div>

            <div
              className="
      h-9
      w-9
      rounded-full
      bg-black/[0.92]
      text-white
      flex
      items-center
      justify-center
      text-[12px]
      font-semibold
      shadow-[0_6px_20px_rgba(0,0,0,0.12)]
    "
            >
              A
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 cursor-default">
            <div className="flex flex-col leading-tight text-right">
              <span
                className="  text-[14px]
                font-medium
                tracking-[-0.01em]

                text-black/82"
              >
                {user?.name || "Admin"}
              </span>

              <span
                className=" mt-[5px]

                text-[10px]
                font-medium
                tracking-[0.12em]

                uppercase

                text-black/32"
              >
                Admin
              </span>
            </div>

            <div className="h-9 w-9 rounded-full bg-black/[0.92] text-white flex items-center justify-center text-[12px] font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        )}
      </div>

      <aside
        className="
  hidden lg:flex shrink-0
 fixed top-0 left-0 w-72 h-screen z-30
  flex-col justify-between
  bg-white/65
  
  backdrop-blur-xl
  border-r border-white/40
 shadow-[0_8px_40px_rgba(0,0,0,0.05),0_2px_12px_rgba(255,255,255,0.18)]
  before:absolute
  before:inset-0
  before:bg-gradient-to-b
  before:from-white/40
  before:to-white/10
  before:pointer-events-none
 overflow-hidden"
      >
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div
              className="
        px-7 pt-8 pb-7
        flex items-center gap-3"
            >
              <div
                className="
          w-2 h-2
          rounded-full
          bg-black"
              />

              <span
                className="
          text-[11px]
          tracking-[0.28em]
          text-gray-500
          uppercase"
              >
                Admin Panel
              </span>
            </div>

            <nav className="space-y-2 px-4">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className=" group
  relative
  w-full
  flex items-center gap-3
  px-4 py-3.5
  rounded-2xl
  overflow-hidden
  transition-colors duration-150"
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="
      absolute inset-0
      bg-white/45
      backdrop-blur-xl
      border border-white/50
      shadow-[0_2px_12px_rgba(255,255,255,0.18)]
      rounded-2xl"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        }}
                      />
                    )}
                    {!active && (
                      <div
                        className="absolute inset-0
    opacity-0
    group-hover:opacity-100
    bg-black/[0.03]
    backdrop-blur-lg
    border border-white/30
    rounded-2xl
    transition-opacity duration-150"
                      />
                    )}

                    <Icon
                      size={17}
                      className={`relative z-10
    transition-colors duration-150
    ${active ? "text-black" : "text-gray-400 group-hover:text-black"}`}
                    />

                    <span
                      className={`
    relative z-10
    text-[14px]
    tracking-wide
    transition-colors duration-150
    ${active ? "text-black" : "text-gray-500 group-hover:text-black"}`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div
            className="p-5
      border-t border-white/30"
          >
            <button
              onClick={() => {
                localStorage.clear();
                window.dispatchEvent(new Event("storage"));
                window.location.replace("/");
              }}
              className="
        flex items-center gap-3
        text-sm
        text-gray-400
       transition-colors duration-150
hover-supported:hover:text-red-500
active:text-red-500"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="
        lg:hidden
        fixed inset-0 z-50
        bg-white/10
        backdrop-blur-[10px]
      "
            />

            <motion.aside
              initial={{ x: -340, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -340, opacity: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-[300px] overflow-hidden flex flex-col justify-between bg-white/65 backdrop-blur-[22px]
              border-r border-white/40 shadow-[0_20px_80px_rgba(255,255,255,0.25),0_8px_40px_rgba(0,0,0,0.06)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40
            before:to-white/10 before:pointer-events-none"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div
                    className="
              h-16 px-5
              flex items-center justify-between
              border-b border-white/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                  w-2 h-2
                  rounded-full
                  bg-black"
                      />

                      <span
                        className="
                  text-[11px]
                  tracking-[0.26em]
                  text-gray-500
                  uppercase"
                      >
                        Admin
                      </span>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-10 h-10 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/70 ring-1 ring-black/[0.03] flex items-center justify-center
  text-black/72 shadow-[0_4px_20px_rgba(255,255,255,0.22)] active:scale-[0.96] transition-all duration-150"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  </div>

                  <nav className="space-y-2 p-4">
                    {navItems.map((item) => {
                      const active = location.pathname === item.path;

                      const Icon = item.icon;

                      return (
                        <button
                          key={item.name}
                          onClick={() => navigate(item.path)}
                          className="
  relative
  w-full
  flex items-center gap-3
  px-4 py-3.5
  rounded-2xl
  overflow-hidden transition-colors duration-150 active:scale-[0.985]"
                        >
                          {active && (
                            <motion.div
                              layoutId="mobile-active"
                              className="absolute inset-0
      bg-white/55
      backdrop-blur-xl
      border border-white/50
      shadow-[0_4px_24px_rgba(255,255,255,0.4)]
      rounded-2xl"
                            />
                          )}

                          <Icon
                            size={17}
                            className={`relative z-10
    ${active ? "text-black" : "text-gray-400"}`}
                          />

                          <span
                            className={`relative z-10 text-[14px] tracking-wide ${active ? "text-black" : "text-gray-500"}`}
                          >
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div
                  className="p-5
            border-t border-white/30 space-y-2"
                >
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/");
                    }}
                    className="flex items-center gap-3 text-sm text-gray-400 transition-colors duration-150 hover-supported:hover:text-black active:text-black"
                  >
                    <ArrowUpRight size={16} />
                    View Store
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      localStorage.clear();
                      window.dispatchEvent(new Event("storage"));
                      window.location.replace("/");
                    }}
                    className="flex items-center gap-3 text-sm text-gray-400 transition-colors duration-150 hover-supported:hover:text-red-500 active:text-red-500"
                  >
                    <LogOut
                      size={16}
                      className="
              scale-110"
                    />
                    Logout
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Sidebar);
