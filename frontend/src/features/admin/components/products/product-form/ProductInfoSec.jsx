import React, { memo } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const categoryOptions = ["T-shirt", "Hoodie", "Jacket", "Jeans", "Shoes"];
const genderOptions = ["Men", "Women"];

const ProductInfoSec = ({
  name,
  setName,
  category,
  setCategory,
  gender,
  setGender,
  price,
  setPrice,
  description,
  setDescription,
}) => {
  return (
    <div
      className="
    relative overflow-hidden rounded-[30px] border border-black/[0.045] bg-white/[0.72] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.015),0_24px_80px_rgba(0,0,0,0.045)]transition-all duration-300"
    >
      <div
        className="
      absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_34%)] pointer-events-none"
      />

      <div className="relative z-10 space-y-7">
        <div className="space-y-3">
          <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-black/34">
            Product Information
          </p>

          <p
            className="
          max-w-[520px]
          text-[13px]
          leading-relaxed
          text-black/42"
          >
            Configure the core product details, pricing and storefront metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label
              htmlFor="name"
              className="
           text-xs text-gray-500 tracking-wide"
            >
              Product Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Essential oversized hoodie"
              className="
          w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm
            focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />
          </div>

          <div className="space-y-2.5">
            <label
              htmlFor="price"
              className="
           text-xs text-gray-500 tracking-wide"
            >
              Price
            </label>

            <input
              id="price"
              type="number"
              min={"0"}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="249"
              className="
           w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm
            focus:outline-none  focus:border-black transition-all duration-150 px-2"
            />
          </div>
        </div>

        <div
          id="selectSection"
          tabIndex={-1}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2.5 ">
            <label className="text-xs text-gray-500 tracking-wide">
              Category
            </label>

            <Select id="category" value={category} onValueChange={setCategory}>
              <SelectTrigger
                className={`
                  group
                  h-12
                  w-full
                  rounded-lg
                  shrink-0
                  border
                  ${
                    category
                      ? "border-black/[0.08] bg-black/[0.03]"
                      : "border-black/[0.045] bg-white/[0.88]"
                  }
                  px-4
              text-base sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
               shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              data-[state=open]:bg-white
              data-[state=open]:border-black/[0.08]
                `}
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent
                className="
                 overflow-hidden
              rounded-lg
              border border-black/[0.05]
              bg-white/[0.92]
              backdrop-blur-2xl
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
               animate-in fade-in-0 zoom-in-95 duration-150"
              >
                {categoryOptions.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="
                           h-12
            rounded-lg
            px-3
            text-base sm:text-sm
            font-medium
            tracking-[-0.01em]
            text-black/75
            transition-all
            duration-150
            hover-supported:hover:translate-x-[2px]
            hover-supported:hover:bg-black/[0.035]
            hover-supported:hover:text-black/90
            focus:translate-x-[2px]
            focus:bg-black/[0.035]
            focus:text-black/90
            data-[state=checked]:bg-black/[0.92]
            data-[state=checked]:text-white
            data-[state=checked]:hover:translate-x-0
            data-[state=checked]:focus:translate-x-0
            data-[state=checked]:hover:bg-black/[0.92]
            data-[state=checked]:focus:bg-black/[0.92]
            data-[state=checked]:hover:text-white
            data-[state=checked]:focus:text-white
            cursor-pointer"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <label
              className="
         text-xs text-gray-500 tracking-wide"
            >
              Gender
            </label>

            <Select id="gender" value={gender} onValueChange={setGender}>
              <SelectTrigger
                className={`
                 group
                 h-12
                 w-full 
                 rounded-lg
                 shrink-0
                 border
                 ${
                   gender !== ""
                     ? "border-black/[0.08] bg-black/[0.03]"
                     : "border-black/[0.045] bg-white/[0.88]"
                 }
               px-4
              text-base sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
               shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              data-[state=open]:bg-white
              data-[state=open]:border-black/[0.08]`}
              >
                <SelectValue placeholder="Gender" />
              </SelectTrigger>

              <SelectContent
                className="
                   overflow-hidden
              rounded-lg
              border border-black/[0.05]
              bg-white/[0.92]
              backdrop-blur-2xl
              p-1.5
              shadow-[0_20px_60px_rgba(0,0,0,0.08)]
               animate-in fade-in-0 zoom-in-95 duration-150"
              >
                {genderOptions.map((gender) => (
                  <SelectItem
                    key={gender}
                    value={gender}
                    className="
                          h-12
            rounded-lg
            px-3
            text-base sm:text-sm
            font-medium
            tracking-[-0.01em]
            text-black/75
            transition-all
            duration-150
            hover-supported:hover:translate-x-[2px]
            hover-supported:hover:bg-black/[0.035]
            hover-supported:hover:text-black/90
            focus:translate-x-[2px]
            focus:bg-black/[0.035]
            focus:text-black/90
            data-[state=checked]:bg-black/[0.92]
            data-[state=checked]:text-white
            data-[state=checked]:hover:translate-x-0
            data-[state=checked]:focus:translate-x-0
            data-[state=checked]:hover:bg-black/[0.92]
            data-[state=checked]:focus:bg-black/[0.92]
            data-[state=checked]:hover:text-white
            data-[state=checked]:focus:text-white
            cursor-pointer"
                  >
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="description"
            className="
          text-xs text-gray-500 tracking-wide"
          >
            Description
          </label>

          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Relaxed fit heavyweight hoodie crafted from premium cotton fleece."
            className="resize-none w-full border-b  border-gray-300 py-2 text-base sm:text-sm focus:outline-none  focus:border-black transition-all duration-150 px-2"
          />
        </div>
      </div>
    </div>
  );
};
export default memo(ProductInfoSec);
