import React, { memo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLoginUserMutation } from "@/redux/api/apiSlice";
import { Eye, EyeOff } from "lucide-react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

const Signin = ({ setMode, handleAuthSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const isEmailValid = /\S+@\S+\.\S+/.test(values.email);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateForm = () => {
    const { email, password } = values;

    if (!email.trim()) {
      emailRef.current?.focus();
      return "Enter your email";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      emailRef.current?.focus();
      return "Invalid email format";
    }

    if (!password.trim()) {
      passwordRef.current?.focus();
      return "Enter your password";
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      toast({
        variant: "destructive",
        description: error,
      });
      return;
    }
    try {
      const res = await loginUser(values).unwrap();

      handleAuthSuccess(res.token);

      toast({ title: res.message || "Login successfull ✅" });

      setValues({
        email: "",
        password: "",
      });
    } catch (err) {
      toast({
        title: err?.data?.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white flex items-center justify-center px-4 ">
      <div className="w-full max-w-md space-y-12 px-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
            Sign In
          </h1>
          <p className="text-sm text-gray-500">Welcome back</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-2.5">
            <label
              htmlFor="email"
              className="
    text-[12px]
    font-medium
    text-black/65
  "
            >
              Email
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              disabled={isLoggingIn}
              className="
              h-12 w-full border-b border-gray-300 py-2 text-sm
            focus:outline-none focus:border-black transition-all duration-150 px-2
            "
            />
            {!isEmailValid && values.email && (
              <p className="text-xs text-red-500">Invalid email</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="space-y-2.5 relative">
              <label
                htmlFor="password"
                className="
    text-[12px]
    font-medium
    text-black/65
  "
              >
                Password
              </label>

              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  disabled={isLoggingIn}
                  className="h-12 w-full border-b border-gray-300 py-2 text-sm pr-8
                focus:outline-none focus:border-black transition-all 
duration-150 px-2"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="
  absolute
  right-2
  top-1/2
  -translate-y-1/2
  text-gray-400
  transition-colors duration-150
  hover-supported:hover:text-black
"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className="
      text-sm
      font-light
      text-black/70

      transition-all
      duration-150

      hover-supported:hover:text-black

      active:scale-[0.985]

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-black
      focus-visible:ring-offset-2
    "
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <PrimaryButton
              type="submit"
              disabled={isLoggingIn}
              className="w-full"
            >
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Cancel
            </SecondaryButton>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() =>
              toast({ description: "Google sign-in is coming soon." })
            }
            className="
    flex
    h-12
    items-center
    justify-center
    gap-3

    w-full
    rounded-lg

    border border-black/[0.08]
    bg-white

    transition-[transform,background-color,border-color]
    duration-150

    hover-supported:hover:bg-black/[0.02]
    hover-supported:hover:border-black/[0.12]

    active:scale-[0.985]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-black
    focus-visible:ring-offset-2
  "
          >
            <img
              src="/images/google.png"
              alt="Google"
              draggable="false"
              className="h-5 w-5 shrink-0"
            />

            <span className="text-[13px] font-medium tracking-[0.01em] text-black/80">
              Continue with Google
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="
      font-medium
      text-black

      transition-all
      duration-150

      hover-supported:hover:text-black/60

      active:scale-[0.985]

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-black
      focus-visible:ring-offset-2
    "
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default memo(Signin);
