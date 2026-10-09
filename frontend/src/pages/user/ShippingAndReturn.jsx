import React from "react";
import FadeIn from "@/components/common/FadeIn";

const ShippingAndReturn = () => {
  return (
    <div className="animate-fadeIn bg-white">
      <section className="text-center py-24 space-y-6 px-4">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
          Policies
        </p>

        <h1 className="text-4xl sm:text-6xl font-light tracking-wide">
          Shipping & Returns
        </h1>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-28 space-y-20">
        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Shipping Policy
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We process all orders within 1–2 business days, excluding weekends
              and holidays. Once shipped, you will receive an email with
              tracking details. Standard delivery typically takes 3–7 business
              days, while international orders may take 7–21 business days
              depending on the destination.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Shipping charges are calculated at checkout, and free shipping may
              be available for qualifying orders. Customs duties or taxes for
              international shipments are the responsibility of the customer.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              While we strive for timely delivery, delays may occasionally occur
              due to courier or customs processes. If your package is lost or
              arrives damaged, please contact us within 48 hours at
              support@[yourstore].com.
            </p>
          </section>
        </FadeIn>

        <div className="border-t border-gray-200 opacity-70" />

        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Returns & Exchanges
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We want you to love your purchase. If you are not fully satisfied,
              items can be returned or exchanged within 30 days of delivery,
              provided they are unused, unwashed, and in original packaging with
              tags attached.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Refunds are issued to the original payment method within 5–7
              business days after inspection. Exchanges are free for size or
              defective items, subject to availability.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Certain items such as clearance products, personalized orders, or
              hygiene-sensitive goods may not be eligible for return. To
              initiate a return or exchange, contact support@[yourstore].com
              with your order details.
            </p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
};

export default ShippingAndReturn;
