import React, { memo } from "react";

const CategoriesSection = ({ navigate }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
      <h2
        className="
      text-[2rem]
      sm:text-5xl
      leading-[0.95]
      text-center
      font-light
      tracking-[-0.04em]
      sm:tracking-tight
    "
      >
        Shop by Gender
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div
          onClick={() => navigate("/products?gender=Women")}
          className="
        relative
          active:scale-[0.995]
        group
        overflow-hidden
        cursor-pointer
        aspect-[4/5]
        sm:aspect-[5/6]
        lg:aspect-[3/4]
        will-change-transform
      "
        >
          <img
            src="/images/ayo-ogunseinde-UqT55tGBqzI-unsplash-600.webp"
            srcSet="
          /images/ayo-ogunseinde-UqT55tGBqzI-unsplash-400.webp 400w,
          /images/ayo-ogunseinde-UqT55tGBqzI-unsplash-600.webp 600w,
          /images/ayo-ogunseinde-UqT55tGBqzI-unsplash-800.webp 800w,
          /images/ayo-ogunseinde-UqT55tGBqzI-unsplash-1200.webp 1200w
        "
            sizes="(max-width: 640px) 100vw, 50vw"
            loading="lazy"
            width={600}
            height={800}
            alt="Women category"
            className="
          w-full
          h-full
          object-cover
          transition-transform duration-1800 ease-out
          hover-supported:group-hover:scale-[1.045]
          hover-supported:group-hover:brightness-[1.08]
        "
          />

          <div
            className="
          absolute inset-0
          bg-black/45
          sm:bg-black/35
          transition-colors duration-700 ease-out
          hover-supported:group-hover:bg-black/20
        "
          />

          <div
            className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]
          opacity-0
          transition-opacity duration-1400 ease-out
          hover-supported:group-hover:opacity-100
        "
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="
            text-white
            text-[15px]
            sm:text-2xl
            font-light
            tracking-[0.24em]
            sm:tracking-[0.32em]

            opacity-100
            translate-y-0

            hover-supported:lg:opacity-0
            hover-supported:lg:translate-y-5

            transition-all duration-700 ease-out

            hover-supported:lg:group-hover:opacity-100
            hover-supported:lg:group-hover:translate-y-0
          "
            >
              WOMEN
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/products?gender=Men")}
          className="
        relative
          active:scale-[0.995]
        group
        overflow-hidden
        cursor-pointer
        aspect-[4/5]
        sm:aspect-[5/6]
        lg:aspect-[3/4]
        will-change-transform
      "
        >
          <img
            src="/images/pexels-ferhatten-36057248-600.webp"
            alt="Men category"
            srcSet="
          /images/karsten-winegeart-3U7zjSgOj7g-unsplash-400.webp 400w,
          /images/karsten-winegeart-3U7zjSgOj7g-unsplash-600.webp 600w,
          /images/karsten-winegeart-3U7zjSgOj7g-unsplash-800.webp 800w,
          /images/karsten-winegeart-3U7zjSgOj7g-unsplash-1200.webp 1200w
        "
            sizes="(max-width: 640px) 100vw, 50vw"
            loading="lazy"
            width={600}
            height={800}
            className="
          w-full
          h-full
          object-cover
          transition-transform duration-1800 ease-out
          hover-supported:group-hover:scale-[1.045]
          hover-supported:group-hover:brightness-[1.08]
        "
          />

          <div
            className="
          absolute inset-0
          bg-black/45
          sm:bg-black/35
          transition-colors duration-700 ease-out
          hover-supported:group-hover:bg-black/20
        "
          />

          <div
            className="
          absolute inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]
          opacity-0
          transition-opacity duration-1400 ease-out
          hover-supported:group-hover:opacity-100
        "
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="
            text-white
            text-[15px]
            sm:text-2xl
            font-light
            tracking-[0.24em]
            sm:tracking-[0.32em]

            opacity-100
            translate-y-0

            hover-supported:lg:opacity-0
            hover-supported:lg:translate-y-5

            transition-all duration-700 ease-out

            hover-supported:lg:group-hover:opacity-100
            hover-supported:lg:group-hover:translate-y-0
          "
            >
              MEN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoriesSection);
