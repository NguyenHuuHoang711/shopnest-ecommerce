import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

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

const ConfirmDialog = ({
  openModal,
  setOpenModal,
  selectedItem,
  setSelectedItem,
  onConfirm,
  isLoading,
  title,
  description,
  confirmText,
}) => {
  let open;

  selectedItem ? (open = !!selectedItem) : (open = openModal);

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
        selectedItem ? setSelectedItem(null) : setOpenModal(false);
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

          px-4

          bg-black/30
          backdrop-blur-md

          cursor-pointer
        "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={() =>
            selectedItem ? setSelectedItem(null) : setOpenModal(false)
          }
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
            dark:bg-background
will-change-transform
            rounded-2xl
            border border-black/[0.045]
            bg-white/80
            p-6 sm:p-8
            shadow-[0_30px_80px_rgba(0,0,0,0.2)]
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
              className="relative z-10"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <motion.div
                  variants={item}
                  className="
                  flex items-center justify-center
                  h-14
                  w-14
                  rounded-2xl
                  border border-red-500/[0.08]
                  bg-red-500/[0.06]
                  shadow-[0_8px_24px_rgba(239,68,68,0.08)]
                "
                >
                  <span className="text-[18px] text-red-500">!</span>
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
                  {title}
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
                  {description}
                </motion.p>
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
                  onClick={() =>
                    selectedItem ? setSelectedItem(null) : setOpenModal(false)
                  }
                >
                  Cancel
                </SecondaryButton>

                <SecondaryButton
                  variant="destructive"
                  disabled={isLoading}
                  onClick={() => onConfirm(selectedItem)}
                >
                  {isLoading ? "Processing..." : confirmText}
                </SecondaryButton>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default memo(ConfirmDialog);
