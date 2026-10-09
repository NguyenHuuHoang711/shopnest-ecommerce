import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/api/apiSlice";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const ResetPassword = () => {
  const { token } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  const isPasswordMatch =
    values.password && values.password === values.confirmPassword;

  const validateForm = () => {
    const { password, confirmPassword } = values;

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

  const handleSubmit = async (e) => {
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
      const res = await resetPassword({
        token,
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
      }).unwrap();

      toast({
        title: res.message || "Password reset successful ✅",
      });

      setValues({
        password: "",
        confirmPassword: "",
      });

      navigate("/auth", { replace: true });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          err?.data?.message ||
          "This password reset link is invalid or has expired.",
      });

      setTimeout(() => {
        navigate("/auth?mode=forgot-password", { replace: true });
      }, 2000);
    }
  };

  return (
    <div
      className="animate-fadeIn bg-white text-black min-h-screen flex items-center 
justify-center px-4 "
    >
      <div className="w-full max-w-[500px]">
        <div className="animate-step">
          <div className="bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-12">
              <div className="text-center space-y-3">
                <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500">Enter your new password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                  <div className="space-y-2 relative">
                    <label
                      className="
    text-[12px]
    font-medium
    text-black/65
  "
                    >
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full h-12 border-b border-gray-300 py-2 text-sm pr-8
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
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
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
                        passwordRules.special
                          ? "text-black/80"
                          : "text-black/40"
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

                <div className="space-y-2 relative">
                  <label className="text-xs text-gray-500 tracking-wide">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full h-12 border-b border-gray-300 py-2 text-sm pr-8
                       focus:outline-none focus:tracking-wide focus:border-black transition-all 
          duration-200 px-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
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
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {values.confirmPassword && !isPasswordMatch && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Resetting..." : "Reset"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
