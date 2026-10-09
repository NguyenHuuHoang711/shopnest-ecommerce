import React, { memo } from "react";

const HeroSection = ({ navigate }) => {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="w-full aspect-[9/16] sm:aspect-[16/9] 2xl:aspect-[21/9] relative">
        <picture>
          <source
            media="(min-width: 640px)"
            srcSet="
           /images/hero-600.webp 600w,
           /images/hero-800.webp 800w,
           /images/hero-1200.webp 1200w,
           /images/hero-1600.webp 1600w,
           /images/hero-2000.webp 2000w,
           /images/hero-2400.webp 2400w,
           /images/hero-3000.webp 3000w,
           /images/hero-3840.webp 3840w,
         "
            sizes="100vw"
          />

          <img
            src="/images/mobile-hero-400.webp"
            srcSet="
           /images/mobile-hero-400.webp 400w,
           /images/mobile-hero-600.webp 600w,
           /images/mobile-hero-800.webp 800w,
           /images/mobile-hero-1200.webp 1200w
         "
            sizes="100vw"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={600}
            height={800}
            alt="Hero Section"
            className="w-full h-full object-cover hero-img"
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 " />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white space-y-3">
        <h1 className="hero-title text-4xl md:text-7xl font-light tracking-wide">
          NOVA STONE <span className="font-semibold">& CO.</span>
        </h1>

        <p className="hero-sub  text-lg md:text-3xl font-light">
          Introducing the Capsule Collection
        </p>
     <div className="hero-btn">
  <button
    onClick={() => navigate("/products")}
    className="
      inline-flex
      items-center
      justify-center
      h-12
      px-10
      bg-white
      text-black
      border
      border-white
      rounded-none
      text-[11px]
      font-medium
      uppercase
      tracking-[0.2em]
      whitespace-nowrap
      select-none
      transition-colors
      duration-200
      ease-out
      hover-supported:hover:bg-transparent
      hover-supported:hover:text-white
      hover-supported:hover:border-white
      active:scale-[0.98]
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-white
      focus-visible:ring-offset-2
      focus-visible:ring-offset-black
    "
  >
    Shop Now
  </button>
</div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white opacity-70 scroll-indicator">
        <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
        <div className="w-[1px] h-6 bg-white mt-2"></div>
      </div>
    </div>
  );
};

export default memo(HeroSection);
