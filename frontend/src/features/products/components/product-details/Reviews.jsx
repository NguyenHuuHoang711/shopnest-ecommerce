import React, { memo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetReviewsQuery } from "@/redux/api/apiSlice";
import { Star } from "lucide-react";
import PaginationComponent from "@/components/common/PaginationComponent";
import Skeleton from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState.jsx";
import EmptyState from "@/components/feedback/empty-state/EmptyState.jsx";

const stars = [1, 2, 3, 4, 5];

const Reviews = ({ id }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("reviewPage")) || 1);

  const setPage = (newPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (newPage <= 1) {
          next.delete("reviewPage");
        } else {
          next.set("reviewPage", String(newPage));
        }

        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("reviewPage");
        return next;
      },
      { replace: true },
    );
  }, [id, setSearchParams]);

  const { data, isLoading, isError, refetch, isFetching } = useGetReviewsQuery({
    productId: id,
    page,
    limit: 8,
  });

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.ratingsCount || 0;

  const ratingDistribution = data?.ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (isLoading || isFetching) {
    return (
      <div className="space-y-8">
        <Skeleton className="mx-auto h-[10px] w-32 rounded-full" />
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-8 w-16 rounded-full" />
          <div className="flex gap-[2px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-28 rounded-full" />
          <div className="mt-2 w-full max-w-xs space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-4 rounded-full" />
                <Skeleton className="h-1 flex-1 rounded-full" />
                <Skeleton className="h-3 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-black/5 pb-5">
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
              <div className="mb-3 flex gap-[1px]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-3 w-3 rounded-full" />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load reviews"
        description="We couldn't load customer reviews right now. Please try again later."
      />
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your experience with this product."
      />
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 text-center">
        Customer Reviews
      </p>

      <div className="flex flex-col items-center space-y-3">
        <p className="text-2xl font-light">
          {data?.ratingsAverage?.toFixed(1) || "0.0"}
        </p>

        <div className="flex gap-[2px]">
          {stars.map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                data?.ratingsAverage >= star
                  ? "fill-black stroke-black"
                  : "stroke-gray-300"
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
          Based on {total} reviews
        </p>

        <div className="w-full max-w-xs space-y-1 mt-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star];
            const percentage = total ? (count / total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-5 text-gray-400">{star}</span>
                <div className="flex-1 h-[2px] bg-gray-200 relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-black transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 transition">
        {reviews.map((review) => {
          const formattedDate = new Date(review.createdAt).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          );

          return (
            <div
              key={review._id}
              className="border-b border-gray-100 pb-5 px-1 -mx-1 rounded hover:bg-gray-50 transition"
            >
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-[11px] tracking-[0.2em] uppercase text-gray-900 font-light">
                  {review.user?.name || "Anonymous"}
                </p>
                <p className="text-[10px] text-gray-400">{formattedDate}</p>
              </div>

              <div className="flex gap-[1px] mb-2">
                {stars.map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      review.rating >= star
                        ? "fill-black stroke-black"
                        : "stroke-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed font-light">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default memo(Reviews);
