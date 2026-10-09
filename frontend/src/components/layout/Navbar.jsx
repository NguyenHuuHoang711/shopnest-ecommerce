import React, {
  useState,
  useEffect,
  useRef,
  memo,
  lazy,
  Suspense,
} from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import { useGetProfileQuery } from "@/redux/api/apiSlice";
const NavModal = lazy(() => import("@/components/modals/NavModal"));
const ProfileModal = lazy(() => import("@/components/modals/ProfileModal"));

const NAV_ITEMS = [
  { name: "HOME", path: "/" },
  { name: "SHOP", path: "/products" },
  { name: "ABOUT", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const CartIcon = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} align-middle`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1 1 0 00-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7.42c-.14 0-.25-.11-.22-.25l.03-.15L7.2 14z" />
  </svg>
);

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} align-middle`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalQuantity = useSelector((state) =>
    state.cart.cartItems.reduce((sum, item) => sum + item.qty, 0),
  );

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const { data, isLoading, isError } = useGetProfileQuery();
  let user = data?.user;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 640;

    if (isMobile && (isOpen || profileOpen)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, profileOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleClick = (e, pathname) => {
    if (location.pathname === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(pathname);
    }
    setProfileOpen(false);
  };

  const handleCartClick = (e) => {
    if (location.pathname === "/cart") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className={`w-full sticky top-0 z-50 border-b transition-all duration-150 ease-out bg-white/80 backdrop-blur-md
        ${scrolled ? "h-14" : " h-20"}`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 text-[22px]"
              onClick={() => setIsOpen(true)}
            >
              ☰
            </button>

            <Link
              className="text-lg sm:text-xl font-light tracking-widest"
              to="/"
            >
              NOVA <span className="font-semibold">STONE</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-light">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
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
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 ">
            <div ref={profileRef} className="relative profile-menu">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/auth", {
                      state: { from: location.pathname },
                    });
                  } else {
                    setProfileOpen((prev) => !prev);
                  }
                }}
                className="relative p-1.5 rounded-full transition-transform duration-150 ease-out   active:scale-[0.985]
    active:hover:scale-[0.985] hover-supported:hover:scale-[1.03]"
              >
                <div
                  className={`
      relative
      w-8 h-8
      flex items-center justify-center
      rounded-full
      border
      transition-[background-color,border-color,transform]
      duration-150
      ease-out
      ${
        isLoggedIn
          ? "bg-black text-white border-black hover-supported:hover:bg-black/90"
          : "bg-white text-gray-500 border-gray-300 hover-supported:hover:bg-black/[0.03] hover-supported:hover:border-black/[0.08] hover-supported:hover:text-black/70"
      }
      ${profileOpen ? "ring-1 ring-black/20" : ""}
    `}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                </div>

                {isLoggedIn && (
                  <span className="absolute bottom-0 right-0 translate-x-[18%] translate-y-[18%] w-2 h-2 rounded-full border border-white bg-emerald-500 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" />
                )}
              </button>

              {isLoggedIn && profileOpen && (
                <div
                  className={`
    hidden md:block absolute right-0 top-full w-56  
    bg-white/80 backdrop-blur-md border border-gray-100 
    shadow-[0_20px_60px_rgba(0,0,0,0.08)] 
    rounded-lg overflow-hidden z-60

    transform transition-all duration-150 ease-out 

    ${scrolled ? "translate-y-0" : "translate-y-3"}

    ${profileOpen ? "pointer-events-auto" : "pointer-events-none"}


    animate-fadeIn-2

  `}
                >
                  <button
                    onClick={(e) => handleClick(e, "/profile")}
                    className="w-full text-left px-4 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={(e) => handleClick(e, "/orders")}
                    className="w-full text-left px-4 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
                  >
                    Orders
                  </button>

                  <button
                    onClick={(e) => handleClick(e, "/wishlist")}
                    className="w-full text-left px-4 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] active:scale-[0.985]"
                  >
                    Wishlist
                  </button>

                  {!isLoading && !isError && user?.isAdmin && (
                    <button
                      onClick={(e) => handleClick(e, "/admin")}
                      className="w-full text-left px-4 py-3 text-sm 
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
                    className="w-full text-left px-4 py-3 text-sm 
hover-supported:hover:bg-black/[0.03] transition-all duration-150 
hover-supported:hover:translate-x-[2px] text-red-500 active:scale-[0.985]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <NavLink to="/cart">
              {({ isActive }) => (
                <button
                  onClick={handleCartClick}
                  aria-label="Open cart"
                  className="relative p-1.5 rounded-full transition-transform duration-150 ease-out   active:scale-[0.985]
    active:hover:scale-[0.985] hover-supported:hover:scale-[1.03]"
                >
                  <div
                    className={`
          relative
          w-8 h-8
          flex items-center justify-center
          rounded-full
          border
          transition-[background-color,border-color,transform]
          duration-150
          ease-out
          ${
            totalQuantity > 0
              ? "bg-black text-white border-black hover-supported:hover:bg-black/90"
              : "bg-white text-gray-500 border-gray-300 hover-supported:hover:bg-black/[0.03] hover-supported:hover:border-black/[0.08] hover-supported:hover:text-black/70"
          }
          ${isActive ? "ring-1 ring-black/20" : ""}
        `}
                  >
                    <CartIcon className="w-4 h-4 shrink-0" />
                  </div>

                  {totalQuantity > 0 && (
                    <span className="absolute top-0 right-0 translate-x-[22%] -translate-y-[22%] min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[10px] font-medium leading-none bg-black text-white rounded-full border border-white shadow-[0_0_0_2px_rgba(255,255,255,0.9)]">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              )}
            </NavLink>
          </div>
        </div>
      </div>
      {isLoggedIn && !isOpen && (
        <Suspense fallback={null}>
          <ProfileModal
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            handleClick={handleClick}
            isLoading={isLoading}
            isError={isError}
            user={user}
            toast={toast}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <NavModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          NavLink={NavLink}
          NAV_ITEMS={NAV_ITEMS}
        />
      </Suspense>
    </>
  );
};

export default memo(Navbar);
