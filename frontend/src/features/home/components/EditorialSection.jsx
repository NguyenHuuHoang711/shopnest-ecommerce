import React, { memo } from "react";

const EditorialSection = ({ navigate }) => {
  return (
    <div className="relative w-full overflow-hidden group cursor-pointer will-change-transform">
      <div className="w-full aspect-[4/5] sm:aspect-[16/9] 2xl:aspect-[21/9]">
        <img
          src="/images/editorial-600.webp"
          srcSet="
  /images/editorial-400.webp 400w,
  /images/editorial-600.webp 600w,
  /images/editorial-1200.webp 1200w,
  /images/editorial-1600.webp 1600w,
  /images/editorial-2000.webp 2000w,
  /images/editorial-2400.webp 2400w,
  /images/editorial-3000.webp 3000w,
  
"
          width={600}
          height={750}
          sizes="100vw"
          className="
w-full h-full object-cover editorial-img
group-hover:scale-[1.02]
"
          alt="Editorial"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="absolute inset-0  bg-gradient-to-t from-black/60 via-black/20 to-transparent " />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <p className="editorial-tag text-[10px] sm:text-xs tracking-[0.5em] uppercase opacity-70 mb-3">
          Editorial
        </p>

        <h2 className="editorial-title text-2xl sm:text-5xl font-light tracking-tight leading-tight max-w-2xl">
          Designed for Everyday Movement
        </h2>
        <p className="editorial-desc mt-3 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
          Refined essentials built for comfort, movement, and modern living.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="editorial-cta mt-6 text-[11px] tracking-[0.3em] uppercase text-white/80 hover-supported:hover:text-white transition-colors duration-150"
        >
          Discover More
        </button>
      </div>
    </div>
  );
};

export default memo(EditorialSection);
