import { Label } from "@radix-ui/react-label";
import React, { memo } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  id,
  label,
  value,
  show,
  setShow,
  isLoading,
  form,
  setForm,
  newPw = false,
  passwordRules,
  passwordStrength,
  confirmPw = false,
  isPasswordMatch,
  autoFocus = false,
}) => {
  return (
    <div className="space-y-2.5">
      <Label
        htmlFor={id}
        className="
    text-[12px]
    font-medium
    text-black/65
  "
      >
        {label}
      </Label>
      <div className="relative">
        <input
          autoFocus={autoFocus}
          id={id}
          value={value}
          type={show ? "text" : "password"}
          placeholder={label}
          disabled={isLoading}
          onChange={(e) =>
            setForm({
              ...form,
              [e.target.id]: e.target.value,
            })
          }
          className="
  w-full
  h-12
  bg-transparent
  border-b border-gray-300
  py-2
  text-base
 sm:text-sm
  focus:outline-none
  focus:border-black
  transition-all duration-150
  px-2
"
        />

        <button
          type="button"
          onClick={() => setShow((p) => !p)}
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
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {newPw && (
        <>
          <div className="text-xs text-black/45 space-y-1.5">
            <p
              className={
                form.newPassword.length >= 8 ? "text-black/80" : "text-black/40"
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

          {form.newPassword && (
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
        </>
      )}

      {confirmPw && form.confirmPassword && !isPasswordMatch && (
        <p className="mt-2 text-xs text-black/45">Passwords do not match</p>
      )}
    </div>
  );
};

export default memo(PasswordInput);
