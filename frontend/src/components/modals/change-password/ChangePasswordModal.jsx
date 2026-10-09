import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import PasswordInput from "./PasswordInput";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const ChangePasswordModal = ({
  open,
  setOpen,
  form,
  setForm,
  onConfirm,
  isLoading,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirm,
  setShowConfirm,
}) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  const passwordRules = {
    length: form.newPassword.length >= 8 && form.newPassword.length <= 64,
    upper: /[A-Z]/.test(form.newPassword),
    lower: /[a-z]/.test(form.newPassword),
    number: /\d/.test(form.newPassword),
    special: /[@$!%*?&]/.test(form.newPassword),
  };
  const getPasswordStrength = () => {
    const passed = Object.values(passwordRules).filter(Boolean).length;
    if (passed <= 2) return "weak";
    if (passed <= 4) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength();
  const isPasswordMatch =
    form.newPassword && form.newPassword === form.confirmPassword;

  return createPortal(
    <AnimatePresence>
      {open && (
        <form onSubmit={onConfirm}>
          <motion.div
            className="
          fixed inset-0 z-[200]
          overflow-y-auto
          flex items-center justify-center
          p-4
          bg-black/30
          backdrop-blur-md
          cursor-pointer
        "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="
            relative
            w-full
            max-w-md
 max-h-[90dvh]
overflow-y-auto
scrollbar-none
            rounded-2xl
            border border-black/[0.045]
            bg-white/80
            dark:bg-background
            p-6 sm:p-8
            shadow-[0_30px_80px_rgba(0,0,0,0.2)]
            will-change-transform
            cursor-default
          "
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.8,
              }}
            >
              <div
                className="
              absolute inset-0
              bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_34%)]
              pointer-events-none
            "
              />
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col"
              >
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <motion.div
                    variants={item}
                    className="
    flex items-center justify-center
    h-14 w-14
    rounded-2xl
    border border-black/[0.05]
    bg-black/[0.03]
    shadow-[0_8px_24px_rgba(0,0,0,0.04)]
  "
                  >
                    <span className="text-[18px] text-black/80">🔒</span>
                  </motion.div>
                  <motion.h2
                    variants={item}
                    className=" mt-6
                  text-[24px]
                  leading-none
                  font-semibold
                  tracking-[-0.04em]
                  text-black/90"
                  >
                    Update Password
                  </motion.h2>
                  <motion.p
                    variants={item}
                    className="
    mt-3
    max-w-[320px]
    text-[13px]
    leading-relaxed
    text-black/40
  "
                  >
                    Update your password details below.
                  </motion.p>

                  <div className="w-full mt-8 space-y-5 self-stretch text-left">
                    <motion.div
                      variants={item}
                      className="text-sm text-muted-foreground"
                    >
                      <PasswordInput
                        id="currentPassword"
                        label="Current Password"
                        value={form.currentPassword}
                        show={showCurrentPassword}
                        setShow={setShowCurrentPassword}
                        isLoading={isLoading}
                        form={form}
                        setForm={setForm}
                        autoFocus
                      />
                    </motion.div>

                    <motion.div
                      variants={item}
                      className="text-sm text-muted-foreground"
                    >
                      <PasswordInput
                        id="newPassword"
                        label="New Password"
                        value={form.newPassword}
                        show={showNewPassword}
                        setShow={setShowNewPassword}
                        isLoading={isLoading}
                        form={form}
                        setForm={setForm}
                        newPw
                        passwordRules={passwordRules}
                        passwordStrength={passwordStrength}
                      />
                    </motion.div>

                    <motion.div
                      variants={item}
                      className="text-sm text-muted-foreground"
                    >
                      <PasswordInput
                        id="confirmPassword"
                        label={"Confirm Password"}
                        value={form.confirmPassword}
                        show={showConfirm}
                        setShow={setShowConfirm}
                        isLoading={isLoading}
                        form={form}
                        setForm={setForm}
                        confirmPw
                        isPasswordMatch={isPasswordMatch}
                      />
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  variants={item}
                  className="
  mt-8
  flex flex-col-reverse
  sm:flex-row
  sm:justify-end
  gap-3
"
                >
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setShowCurrentPassword(false);
                      setShowNewPassword(false);
                      setShowConfirm(false);
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </SecondaryButton>

                  <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Save Changes"}
                  </PrimaryButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </form>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default memo(ChangePasswordModal);
