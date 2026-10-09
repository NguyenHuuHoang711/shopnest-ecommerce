import React, { memo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscribedUsersMutation } from "../../redux/api/apiSlice.js";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton.jsx";
import { useRef } from "react";
import { Label } from "../ui/label.jsx";

const FOOTER_ITEMS = [
  { label: "SHOP", path: "/products" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
  { label: "FAQ", path: "/faq" },
  { label: "SHIPPING & RETURNS", path: "/shipping&return" },
  { label: "STORE POLICY", path: "/storepolicy" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const emailRef = useRef(null);

  const [subscribeUser, { isLoading }] = useSubscribedUsersMutation();

  const year = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      emailRef.current.focus();
      setLocalError("Email cannot be empty");
      return;
    }

    if (!EMAIL_REGEX.test(cleanedEmail)) {
      emailRef.current.focus();
      setLocalError("Please enter a valid email");
      return;
    }

    setLocalError("");

    try {
      await subscribeUser({ email: cleanedEmail }).unwrap();

      toast({
        title: "Subscribed 🎉",
        description: "You're now on our list.",
      });

      setEmail("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed ❌",
        description: "Try again later.",
      });
    }
  };

  return (
    <footer className="w-full mt-24 border-t">
      <div className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
            Newsletter
          </p>

          <h2 className="text-2xl sm:text-4xl font-light tracking-wide leading-tight">
            Stay connected with Nova Stone
          </h2>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Be the first to know about new collections, drops, and exclusive
            offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto space-y-4 text-left"
          >
            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-[12px]
              font-medium
              text-black/65"
              >
                Email*
              </Label>

              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
              focus:outline-none  focus:border-black transition-all 
              duration-150 px-2"
              />
            </div>

            {localError && <p className="text-red-500 text-xs">{localError}</p>}
            <PrimaryButton
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </PrimaryButton>
          </form>
        </div>
      </div>

      <div className="bg-white py-10">
        <ul className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-[11px] tracking-[0.2em] text-gray-500">
          {FOOTER_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
  relative transition-all duration-150 active:scale-[0.985]
  
  ${isActive ? "text-black cursor-default pointer-events-none" : "text-black/60"}
  
  hover-supported:hover:text-black
  `
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t py-6 text-center text-[11px] tracking-wide text-gray-600">
        © {year} NOVA STONE & CO.
      </div>
    </footer>
  );
};

export default memo(Footer);
