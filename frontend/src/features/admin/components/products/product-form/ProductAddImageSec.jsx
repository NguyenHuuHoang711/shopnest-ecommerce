import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";

const ProductAddImageSec = ({
  images,
  handleImageChange,
  addImageField,
  removeImageField,
}) => {
  return (
    <div
      className="
          relative overflow-hidden
          before:absolute before:inset-0 before:rounded-[inherit]
          before:bg-white/[0.02] before:pointer-events-none
          bg-white/80 backdrop-blur-xl
          border border-gray-100
          rounded-[30px]
          p-7
          space-y-7
          shadow-[0_10px_30px_rgba(0,0,0,0.03)]
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]
          transition-all duration-500
          motion-safe:hover:-translate-y-[2px]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase   text-gray-400 tracking-[0.2em]">
          Product Images
        </p>

        <TextButton type="button" onClick={addImageField}>
          ADD IMAGE
        </TextButton>
      </div>

      <div className="space-y-5">
        {images.map((image, index) => (
          <div key={index} className="flex gap-4 items-center">
            <input
              id={`image-${index}`}
              type="text"
              placeholder="Paste image URL"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="
                 w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />

            {images.length > 1 && (
              <TextButton
                type="button"
                onClick={() => removeImageField(index)}
                className="
    text-black/40
    hover-supported:hover:text-red-500
    focus-visible:ring-red-500
  "
              >
                REMOVE
              </TextButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ProductAddImageSec);
