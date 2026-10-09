import React, { memo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "@/redux/api/apiSlice";
import { Eye, EyeOff } from "lucide-react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

const Signup = ({ setMode, handleAuthSuccess }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const passwordRules = {
    length: values.password.length >= 8 && values.password.length <= 64,
    upper: /[A-Z]/.test(values.password),
    lower: /[a-z]/.test(values.password),
    number: /\d/.test(values.password),
    special: /[@$!%*?&]/.test(values.password),
  };

  const getPasswordStrength = () => {
    const passed = Object.values(passwordRules).filter(Boolean).length;
    if (passed <= 2) return "weak";
    if (passed <= 4) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength();

  const isEmailValid = /\S+@\S+\.\S+/.test(values.email);

  const isPasswordMatch =
    values.password && values.password === values.confirmPassword;

  const validateForm = () => {
    const { name, phone, email, password, confirmPassword } = values;

    if (!name.trim()) {
      nameRef.current?.focus();
      return "Enter your name";
    }

    if (!phone.trim()) {
      phoneRef.current?.focus();
      return "Enter your phone number";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      emailRef.current?.focus();
      return "Invalid email format";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      phoneRef.current?.focus();
      return "Invalid phone number";
    }

    if (!email.trim()) {
      emailRef.current?.focus();
      return "Enter your email";
    }

    if (!password.trim()) {
      passwordRef.current?.focus();
      return "Enter your password";
    }

    if (password !== confirmPassword) {
      confirmPasswordRef.current?.focus();
      return "Passwords do not match";
    }

    if (!confirmPassword.trim()) {
      confirmPasswordRef.current?.focus();
      return "Confirm your password";
    }

    if (password.length < 8) {
      passwordRef.current?.focus();
      return "Password must be at least 8 characters";
    }

    if (password.length > 64) {
      passwordRef.current.focus();
      return "Password cannot exceed 64 characters";
    }

    if (!/[A-Z]/.test(password)) {
      passwordRef.current.focus();
      return "Add at least 1 uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      passwordRef.current.focus();
      return "Add at least 1 lowercase letter";
    }

    if (!/\d/.test(password)) {
      passwordRef.current.focus();
      return "Add at least 1 number";
    }

    if (!/[@$!%*?&]/.test(password)) {
      passwordRef.current.focus();
      return "Add at least 1 special character";
    }

    return null;
  };

  const handleRegister = async (e) => {
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
      const res = await registerUser(values).unwrap();

      handleAuthSuccess(res.token);

      toast({
        title: "Account created successfully 🎉",
      });

      setValues({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast({
        title: err?.data?.message || "Signup failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">Start your journey with us</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label
                className="
    text-[12px]
    font-medium
    text-black/65
  "
              >
                Name
              </label>
              <input
                ref={nameRef}
                id="name"
                type="text"
                placeholder="Rahul Sharma"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                disabled={isRegistering}
                className="w-full h-12 border-b border-gray-300 py-2 text-sm
              focus:outline-none  focus:border-black transition-all duration-150 px-2"
              />
            </div>

            <div className="space-y-2.5">
              <label
                className="
    text-[12px]
    font-medium
    text-black/65
  "
              >
                Phone
              </label>
              <input
                ref={phoneRef}
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange}
                disabled={isRegistering}
                className="w-full h-12 border-b border-gray-300 py-2 text-sm
              focus:outline-none  focus:border-black transition-all duration-150 px-2"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label
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
              disabled={isRegistering}
              className="w-full h-12 border-b border-gray-300 py-2 text-sm pr-8
                focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />
            {!isEmailValid && values.email && (
              <p className="text-xs text-red-500">Invalid email</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2.5 relative">
              <label
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
                  disabled={isRegistering}
                  className="w-full h-12 border-b border-gray-300 py-2 text-sm pr-8
                focus:outline-none  focus:border-black transition-all duration-150 px-2"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2
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

            <div className="text-xs text-black/45 space-y-1.5">
              <p
                className={
                  values.password.length >= 8
                    ? "text-black/80"
                    : "text-black/40"
                }
              >
                • At least 8 characters
              </p>

              <p
                className={
                  passwordRules.upper ? "text-black/80" : "text-black/40"
                }
              >
                • One uppercase letter
              </p>

              <p
                className={
                  passwordRules.number ? "text-black/80" : "text-black/40"
                }
              >
                • One number
              </p>

              <p
                className={
                  passwordRules.special ? "text-black/80" : "text-black/40"
                }
              >
                • One special character
              </p>
            </div>

            {values.password && (
              <div className="flex gap-1 mt-3">
                {["weak", "medium", "strong"].map((level, i) => (
                  <div
                    key={i}
                    className={`h-[2px] flex-1 transition-all duration-300 ${
                      passwordStrength === "strong"
                        ? "bg-black"
                        : passwordStrength === "medium" && i < 2
                          ? "bg-black/70"
                          : passwordStrength === "weak" && i === 0
                            ? "bg-black/50"
                            : "bg-black/10"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2.5 relative">
            <label className="text-[12px] font-medium text-black/65">
              Confirm Password
            </label>

            <div className="relative">
              <input
                ref={confirmPasswordRef}
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={isRegistering}
                className="w-full h-12 border-b border-gray-300 py-2 text-sm pr-8
              focus:outline-none  focus:border-black transition-all duration-150 px-2"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-150 hover-supported:hover:text-black"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {values.confirmPassword && !isPasswordMatch && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <PrimaryButton
              type="submit"
              disabled={isRegistering}
              className="w-full"
            >
              {isRegistering ? "Creating..." : "Create Account"}
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
            className="flex h-12 items-center justify-center gap-3 w-full rounded-lg border border-black/[0.08] bg-white transition-[transform,background-color,border-color]duration-150 hover-supported:hover:bg-black/[0.02] hover-supported:hover:border-black/[0.12] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("signin")}
            className="font-medium text-black transition-all duration-150 hover-supported:hover:text-black/60 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default memo(Signup);
