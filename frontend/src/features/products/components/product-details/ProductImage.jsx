import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "@/components/ui/skeleton";

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const optimizeImage = (url, width = 400) =>
  `${url}&w=${width}&q=70&auto=format`;

const LENS_SIZE = 200;
const LENS_RADIUS = LENS_SIZE / 2;
const ZOOM = 1.6;

const ProductImage = ({
  product,
  activeImage,
  setActiveImage,
  productDescription,
}) => {
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({
    x: 0,
    y: 0,
  });
  const [loaded, setLoaded] = useState(false);

  const frame = useRef(null);
  const containerRef = useRef(null);
  const rectRef = useRef({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!product?.images?.[activeImage]) return;

    const img = new Image();
    img.src = optimizeImage(product.images[activeImage], 1000);
  }, [product?.images, activeImage]);

  useEffect(() => {
    setLoaded(false);
    setShowLens(false);
    setLensPos({
      x: LENS_RADIUS,
      y: LENS_RADIUS,
    });
  }, [activeImage]);

  useEffect(() => {
    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const handleMouseEnter = (e) => {
    if (!loaded) return;

    const rect = e.currentTarget.getBoundingClientRect();

    rectRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    setShowLens(true);
  };

  const handleMouseMove = (e) => {
    if (!loaded) return;
    if (!showLens) {
      setShowLens(true);
    }
    if (frame.current) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;

      const rect = rectRef.current;

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      x = Math.max(LENS_RADIUS, Math.min(rect.width - LENS_RADIUS, x));

      y = Math.max(LENS_RADIUS, Math.min(rect.height - LENS_RADIUS, y));

      setLensPos((prev) => {
        if (prev.x === x && prev.y === y) return prev;
        return { x, y };
      });
    });
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  const currentImage = product?.images?.[activeImage];

  const zoomImage = useMemo(
    () => optimizeImage(currentImage, 1000),
    [currentImage],
  );

  return (
    <div>
      <div className="space-y-8">
        <div
          ref={containerRef}
          className="relative aspect-[3/4] overflow-hidden group"
          onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
          onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
          onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
        >
          {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}

          <img
            src={optimizeImage(currentImage, 500)}
            srcSet={`
      ${optimizeImage(currentImage, 300)} 300w,
      ${optimizeImage(currentImage, 500)} 500w,
      ${optimizeImage(currentImage, 700)} 700w
    `}
            sizes="(max-width: 640px) 100vw, 500px"
            draggable={false}
            loading="eager"
            fetchPriority="high"
            width={500}
            height={667}
            onLoad={() => {
              setLoaded(true);

              if (!containerRef.current) return;

              const rect = containerRef.current.getBoundingClientRect();

              rectRef.current = {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
              };

              const { x: mouseX, y: mouseY } = mouseRef.current;

              if (
                mouseX >= rect.left &&
                mouseX <= rect.right &&
                mouseY >= rect.top &&
                mouseY <= rect.bottom
              ) {
                const lensX = Math.max(
                  LENS_RADIUS,
                  Math.min(rect.width - LENS_RADIUS, mouseX - rect.left),
                );

                const lensY = Math.max(
                  LENS_RADIUS,
                  Math.min(rect.height - LENS_RADIUS, mouseY - rect.top),
                );

                setShowLens(true);
                setLensPos({
                  x: lensX,
                  y: lensY,
                });
              }
            }}
            className={`w-full h-full object-cover transition-opacity duration-150 cursor-zoom-in ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            alt={product.name}
          />

          <AnimatePresence>
            {!isTouchDevice && loaded && showLens && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "tween",
                  duration: 0.03,
                }}
                className="absolute pointer-events-none rounded-full border border-white/40 shadow-2xl backdrop-blur-sm"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPos.x - LENS_RADIUS,
                  top: lensPos.y - LENS_RADIUS,

                  backgroundImage: `url(${zoomImage})`,
                  backgroundRepeat: "no-repeat",

                  backgroundSize: `${
                    rectRef.current.width * ZOOM
                  }px ${rectRef.current.height * ZOOM}px`,

                  backgroundPosition: `-${
                    lensPos.x * ZOOM - LENS_RADIUS
                  }px -${lensPos.y * ZOOM - LENS_RADIUS}px`,
                }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-3">
          {product.images.map((img, index) => (
            <img
              key={index}
              role="button"
              aria-label={`View image ${index + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setLoaded(false);
                  setActiveImage(index);
                }
              }}
              alt={`${product.name} view ${index + 1}`}
              src={optimizeImage(img, 100)}
              loading="lazy"
              onClick={() => {
                if (index === activeImage) return;

                setLoaded(false);
                setActiveImage(index);
              }}
              width={56}
              height={80}
              className={`w-14 h-20 object-cover transition-[opacity,transform,border-color]
duration-150
              ${
                activeImage === index
                  ? "border-2 border-black opacity-100 cursor-default"
                  : "opacity-70 cursor-pointer hover-supported:hover:opacity-100 hover-supported:hover:scale-105"
              }`}
            />
          ))}
        </div>
        <p className="hidden sm:block text-sm text-gray-500 leading-relaxed">
          {productDescription}
        </p>
      </div>
    </div>
  );
};

export default memo(ProductImage);
