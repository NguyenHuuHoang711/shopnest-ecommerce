import { Label } from "@radix-ui/react-label";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
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

const EditProfileModal = ({
  open,
  setOpen,
  form,
  setForm,
  onConfirm,
  isLoading,
  isChanged,
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="
          fixed inset-0 z-[200]

          flex items-center justify-center

          p-4

          bg-black/30
          backdrop-blur-md
 overflow-y-auto
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
                  <span className="text-[18px]">✎</span>
                </motion.div>

                <motion.h2
                  variants={item}
                  className="
                  mt-6

                  text-[24px]
                  leading-none

                  font-semibold
                  tracking-[-0.04em]

                  text-black/90
                "
                >
                  Update Details
                </motion.h2>

                <motion.p
                  variants={item}
                  className="
                  mt-3

                  max-w-[340px]

                  text-[13px]
                  leading-relaxed

                  text-black/40
                "
                >
                  Update your account details below.
                </motion.p>
              </div>

              <form onSubmit={onConfirm}>
                <motion.div variants={item} className="mt-8 space-y-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="name"
                      className="
    text-[12px]
    font-medium
    text-black/65
  "
                    >
                      Name
                    </Label>

                    <input
                      autoFocus
                      id="name"
                      value={form.name}
                      placeholder="Name"
                      disabled={isLoading}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="
                    h-12
                    bg-transparent
    w-full
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
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="email"
                      className="
    text-[12px]
    font-medium
    text-black/65
  "
                    >
                      Email
                    </Label>

                    <input
                      id="email"
                      value={form.email}
                      placeholder="Email"
                      disabled={isLoading}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="
                    h-12
    w-full
    border-b border-gray-300
    bg-transparent
    py-2
    text-base sm:text-sm
    focus:outline-none
    focus:border-black
    transition-all duration-150
    px-2
  "
                    />
                  </div>
                </motion.div>

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
                  <SecondaryButton type="button" onClick={() => setOpen(false)}>
                    Cancel
                  </SecondaryButton>

                  <PrimaryButton
                    type="submit"
                    disabled={isLoading || !isChanged}
                  >
                    {isLoading ? "Processing..." : "Save Changes"}
                  </PrimaryButton>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default memo(EditProfileModal);
