import { memo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useAddReviewMutation } from "@/redux/api/apiSlice";
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

const focusField = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus();
};

const ReviewModal = ({
  reviewProduct,
  setReviewProduct,
  rating,
  setRating,
  content,
  setContent,
  hover,
  setHover,
}) => {
  const isOpen = !!reviewProduct;
  const { toast } = useToast();

  const [addReview, { isLoading: reviewLoading }] = useAddReviewMutation();

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (reviewProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setReviewProduct(null);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (reviewLoading) return;

    if (!content.trim()) {
      focusField("reviewContent");

      return toast({
        variant: "destructive",
        description: "Please write a review",
      });
    }

    if (!rating) {
      focusField("reviewRating");

      return toast({
        variant: "destructive",
        description: "Please select a rating",
      });
    }

    if (!reviewProduct?._id) {
      return toast({
        variant: "destructive",
        description: "Something went wrong. Try again.",
      });
    }
    try {
      await addReview({
        productId: reviewProduct._id,
        rating,
        content,
      }).unwrap();
      toast({
        description: isEditing
          ? "Review updated successfully"
          : "Review submitted successfully",
      });
      setReviewProduct(null);
      setRating(0);
      setHover(null);
      setContent("");
    } catch (err) {
      toast({
        variant: "destructive",
        description: err?.data?.message || "Failed to submit review",
      });
    }
  };

  const isEditing = !!reviewProduct?.existingReview;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <form onSubmit={handleSubmitReview}>
          <motion.div
            className=" fixed inset-0 z-[200]
          flex items-center justify-center
          px-4
          bg-black/30
          backdrop-blur-md
          cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setReviewProduct(null)}
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
                <div className="text-center">
                  <motion.h2
                    variants={item}
                    className="
        text-[24px]
        leading-none

        font-semibold
        tracking-[-0.04em]

        text-black/90
      "
                  >
                    {isEditing ? "Edit Review" : "Add Review"}
                  </motion.h2>

                  <motion.p
                    variants={item}
                    className="
        mt-3

        text-[13px]

        leading-relaxed

        text-black/40
      "
                  >
                    {isEditing
                      ? "Update your review to reflect your latest experience with this product."
                      : "Share your experience with this product to help other customers."}
                  </motion.p>
                </div>

                <motion.div
                  variants={item}
                  className="mt-8 flex justify-center"
                >
                  <div id="reviewRating" tabIndex={-1} className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setRating(star)}
                        className={`
            w-7
            h-7

            cursor-pointer

            transition-all
            duration-200

            ${
              (hover || rating) >= star
                ? "fill-black stroke-black scale-110"
                : "stroke-black/20"
            }

            active:scale-[0.985]
          `}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={item} className="mt-8">
                  <textarea
                    id="reviewContent"
                    rows={5}
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      isEditing
                        ? "Update your review..."
                        : "Write your review..."
                    }
                    className="
                 resize-none
  w-full
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
                </motion.div>

                <motion.div
                  variants={item}
                  className="
      mt-8

      flex
      flex-col-reverse

      sm:flex-row
      sm:justify-end

      gap-3
    "
                >
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setReviewProduct(null);
                      setRating(0);
                      setHover(null);
                      setContent("");
                    }}
                  >
                    Cancel
                  </SecondaryButton>

                  <PrimaryButton type="submit" disabled={reviewLoading}>
                    {reviewLoading
                      ? isEditing
                        ? "Updating..."
                        : "Submitting..."
                      : isEditing
                        ? "Update Review"
                        : "Submit Review"}
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

export default memo(ReviewModal);
