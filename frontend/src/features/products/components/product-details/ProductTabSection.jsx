import React, { memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Reviews from "@/features/products/components/product-details/Reviews";

const TAB_ITEMS = [
  { label: "Description", value: "description" },
  { label: "Reviews", value: "reviews" },
];

const ProductTabSection = ({
  activeTab,
  setActiveTab,
  productDescription,
  id,
}) => {
  return (
    <div className="mt-24 max-w-4xl mx-auto  px-4 sm:px-6 ">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="relative flex justify-center gap-10 border-b border-gray-200 pb-3">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative text-sm tracking-wide font-light
                  data-[state=active]:text-black text-black/40
                    hover-supported:hover:text-black transition-all duration-150"
            >
              {tab.label}

              <span
                className={`absolute left-0 -bottom-[10px] h-[1px] bg-black transition-all duration-300
                        ${activeTab === tab.value ? "w-full" : "w-0"}`}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value="description"
          className="mt-10 text-center space-y-8 tab-animate"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
            Product Details
          </p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {productDescription}
          </p>
        </TabsContent>

        <TabsContent value="reviews" className="mt-10  tab-animate">
          <Reviews id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(ProductTabSection);
