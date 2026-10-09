import React from "react";
import FadeIn from "@/components/common/FadeIn";

const About = () => {
  return (
    <div className="animate-fadeIn bg-white">
      <div className="relative w-full">
        <div className="w-full aspect-[4/5] sm:aspect-[16/9] 2xl:aspect-[21/9]">
          <img
            src="/images/kevin-laminto-paoUHg6k4Kg-unsplash-800.webp"
            srcSet="/images/kevin-laminto-paoUHg6k4Kg-unsplash-400.webp 400w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-600.webp 600w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-800.webp 800w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-1200.webp 1200w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-1600.webp 1600w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-2000.webp 2000w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-2400.webp 2400w,
            /images/kevin-laminto-paoUHg6k4Kg-unsplash-3000.webp 3000w,
            "
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="w-full h-full object-cover"
            alt="About"
            width={800}
            height={1000}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-end justify-center text-center text-white px-4 pb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-3">
            About
          </p>

          <h1 className="text-4xl sm:text-7xl tracking-[0.05em] font-light">
            Our Story
          </h1>
        </div>
      </div>
      <FadeIn>
        <section className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
            Nova Stone & Co.
          </p>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Born out of a love for design and everyday functionality, our
            collection represents the meeting point of style and purpose. We
            believe products should not only look good, but also enrich your
            life in meaningful ways.
          </p>
        </section>
      </FadeIn>
      <FadeIn>
        <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div className="space-y-3  transition duration-300 hover:opacity-70">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Quality
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Every piece is crafted with durability, comfort, and longevity in
              mind.
            </p>
          </div>

          <div className="space-y-3 transition duration-300 hover:opacity-70 ">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Design
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Modern aesthetics that blend seamlessly into everyday life.
            </p>
          </div>

          <div className="space-y-3 transition duration-300 hover:opacity-70 ">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
              Purpose
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Thoughtfully designed pieces that elevate daily experiences.
            </p>
          </div>
        </section>
      </FadeIn>
      <div className="max-w-md mx-auto border-t border-gray-200 opacity-70" />
      <FadeIn>
        <section className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
            Our Vision
          </p>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            We aim to inspire a way of living that embraces simplicity,
            functionality, and refined design. Every detail is considered, every
            piece intentional — creating an experience that feels effortless and
            meaningful.
          </p>
        </section>
      </FadeIn>
    </div>
  );
};

export default About;
