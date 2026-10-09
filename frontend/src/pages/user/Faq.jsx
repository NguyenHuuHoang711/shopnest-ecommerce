import { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { orderFaq, refundFaq } from "@/data/faqData";
import FadeIn from "@/components/common/FadeIn";
import { Search } from "lucide-react";

const FAQ_ITEMS = [
  { label: "Orders & Shipping", value: "orders" },
  { label: "Returns & Refunds", value: "refunds" },
];

const highlightText = (text, query) => {
  if (!query.trim()) return text;

  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const regex = new RegExp(`(${words.join("|")})`, "gi");

  return text.split(regex).map((part, i) =>
    words.includes(part.toLowerCase()) ? (
      <span key={i} className="bg-black/[0.06] text-black rounded-[2px]">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const Faq = () => {
  const [searchItem, setSearchItem] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const normalizedSearch = useMemo(
    () => debouncedSearch.toLowerCase().trim().replace(/\s+/g, " "),
    [debouncedSearch],
  );
  const searchWords =
    normalizedSearch.length > 0 ? normalizedSearch.split(" ") : [];

  const matchesSearch = useCallback(
    (text) => {
      const lowerText = text.toLowerCase();
      return searchWords.every((word) => lowerText.includes(word));
    },
    [searchWords],
  );

  const filteredOrders = useMemo(() => {
    return orderFaq.filter(
      (item) => matchesSearch(item.question) || matchesSearch(item.answer),
    );
  }, [matchesSearch]);

  const filteredRefunds = useMemo(() => {
    return refundFaq.filter(
      (item) => matchesSearch(item.question) || matchesSearch(item.answer),
    );
  }, [matchesSearch]);

  const isFiltering = debouncedSearch.trim().length > 0;

  useEffect(() => {
    if (!isFiltering) {
      setActiveTab("orders");
      return;
    }

    if (filteredOrders.length > 0) {
      setActiveTab("orders");
    } else if (filteredRefunds.length > 0) {
      setActiveTab("refunds");
    }
  }, [isFiltering, filteredOrders.length, filteredRefunds.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchItem);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (!debouncedSearch) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [debouncedSearch]);

  const openOrderValues = filteredOrders.map((_, idx) => `order-${idx}`);
  const openRefundValues = filteredRefunds.map((_, idx) => `refund-${idx}`);

  const noResults =
    isFiltering && filteredOrders.length === 0 && filteredRefunds.length === 0;

  return (
    <div className="animate-fadeIn bg-white">
      <section className="text-center py-24 space-y-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
          Support
        </p>

        <h1 className="text-4xl sm:text-6xl font-light tracking-wide">
          Frequently Asked Questions
        </h1>
      </section>

      <FadeIn>
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center space-y-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className={`
      relative z-10
      h-12
      w-full 
      rounded-lg
      border
      ${
        searchItem.trim()
          ? "border-black/[0.08] bg-black/[0.03]"
          : "border-black/[0.045] bg-white/[0.88]"
      }
     pl-11
              pr-4
              text-base
              sm:text-sm
              font-medium
              tracking-[-0.01em]
              text-black/80
              placeholder:text-black/40
              outline-none
              shadow-[0_2px_16px_rgba(0,0,0,0.04)]
              transition-all
              duration-150
              [transition-timing-function:cubic-bezier(.22,1,.36,1)]
              hover-supported:hover:border-black/[0.08]
              hover-supported:hover:bg-white
              focus:border-black/[0.08]
              focus:bg-white
              focus:shadow-[0_8px_40px_rgba(0,0,0,0.05)]
    `}
            />
            <span
              className={`
      absolute left-4 top-1/2
      z-20
      -translate-y-1/2
      text-[12px]
      transition-colors
      duration-150

      ${
        searchItem.trim()
          ? "text-black/60"
          : "text-black/30 group-focus-within:text-black/50"
      }
    `}
            >
              <Search size={16} strokeWidth={2} />
            </span>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <div className="max-w-2xl mx-auto px-4 pb-28">
          {noResults && (
            <div className="col-span-full flex justify-center py-10 sm:py-14">
              <div
                className="
      relative
      w-full
      max-w-[420px]
      overflow-hidden
      rounded-[28px]
      border border-black/[0.045]
      bg-white/[0.88]
      backdrop-blur-xl
      px-6 py-10
      shadow-[0_1px_2px_rgba(0,0,0,0.015),0_20px_60px_rgba(0,0,0,0.04)]
      text-center
    "
              >
                <div
                  className="
        absolute inset-0
        bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_34%)]
        pointer-events-none
      "
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className="
          flex items-center justify-center
          h-14
          w-14
          rounded-2xl
          border border-black/[0.045]
          bg-black/[0.03]
          backdrop-blur-xl
          shadow-[0_8px_24px_rgba(0,0,0,0.03)]
        "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5 text-black/40"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>

                  <p
                    className="
          mt-5
          text-[15px]
          font-medium
          tracking-[-0.01em]
          text-black/80
        "
                  >
                    No matching articles found
                  </p>

                  <p
                    className="
          mt-2
          max-w-[300px]
          text-[13px]
          leading-relaxed
          text-black/40
        "
                  >
                    We couldn’t find any help articles matching your search. Try
                    different keywords or browse the categories below.
                  </p>
                </div>
                <button
                  onClick={() => setSearchItem("")}
                  className="
    mt-6

    inline-flex
    items-center
    justify-center

    h-10
    px-6

    border
    border-black

    bg-white
    text-black

    text-[11px]
    font-medium
    uppercase
    tracking-[0.18em]
    leading-none
    whitespace-nowrap

    transition-colors
    duration-150

    hover-supported:hover:bg-black
    hover-supported:hover:text-white

    active:scale-[0.985]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-black
    focus-visible:ring-offset-2
  "
                >
                  CLEAR SEARCH
                </button>
              </div>
            </div>
          )}

          {!noResults && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="relative flex justify-center gap-10 border-b border-gray-200 pb-3">
                {FAQ_ITEMS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative text-sm tracking-wide font-light text-black/40
                    hover-supported:hover:text-black 
                    data-[state=active]:text-black transition-all duration-150"
                  >
                    {tab.label}

                    <span
                      className={`absolute left-0 -bottom-[10px] h-[1px] bg-black transition-all duration-150 ${
                        activeTab === tab.value ? "w-full" : "w-0"
                      }`}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="orders" className="tab-animate mt-10">
                <Accordion
                  type={isFiltering ? "multiple" : "single"}
                  value={isFiltering ? openOrderValues : undefined}
                  {...(!isFiltering && { collapsible: true })}
                  className="space-y-4"
                >
                  {filteredOrders.length === 0 ? (
                    <p
                      className="
    py-12

    text-center

    text-[13px]

    tracking-[-0.01em]

    text-black/40
  "
                    >
                      No matching articles in this category
                    </p>
                  ) : (
                    filteredOrders.map((item, idx) => (
                      <AccordionItem
                        key={`order-${idx}`}
                        value={`order-${idx}`}
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="font-light text-base sm:text-lg hover-supported:hover:no-underline py-4">
                          <span className="text-left">
                            {debouncedSearch
                              ? highlightText(item.question, debouncedSearch)
                              : item.question}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="text-sm sm:text-base text-gray-600 leading-relaxed pb-4">
                          {debouncedSearch
                            ? highlightText(item.answer, debouncedSearch)
                            : item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  )}
                </Accordion>
              </TabsContent>

              <TabsContent value="refunds" className="tab-animate mt-10">
                <Accordion
                  type={isFiltering ? "multiple" : "single"}
                  value={isFiltering ? openRefundValues : undefined}
                  {...(!isFiltering && { collapsible: true })}
                  className="space-y-4"
                >
                  {filteredRefunds.length === 0 ? (
                    <p
                      className="
    py-12

    text-center

    text-[13px]

    tracking-[-0.01em]

    text-black/40
  "
                    >
                      No matching articles in this category
                    </p>
                  ) : (
                    filteredRefunds.map((item, idx) => (
                      <AccordionItem
                        key={`refund-${idx}`}
                        value={`refund-${idx}`}
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="font-light text-base sm:text-lg hover:no-underline py-4">
                          <span className="text-left">
                            {debouncedSearch
                              ? highlightText(item.question, debouncedSearch)
                              : item.question}
                          </span>
                        </AccordionTrigger>

                        <AccordionContent className="text-sm sm:text-base text-gray-600 leading-relaxed pb-4">
                          {debouncedSearch
                            ? highlightText(item.answer, debouncedSearch)
                            : item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  )}
                </Accordion>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default Faq;
