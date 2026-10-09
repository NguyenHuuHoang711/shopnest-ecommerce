import React from "react";
import FadeIn from "@/components/common/FadeIn";

const StorePolicy = () => {
  return (
    <div className="animate-fadeIn bg-white">
      <section className="text-center py-24 space-y-6 px-4">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">
          Information
        </p>

        <h1 className="text-4xl sm:text-6xl font-light tracking-wide">
          Store Policy
        </h1>
      </section>

      <div className="max-w-3xl mx-auto px-4 pb-28 space-y-20">
        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Customer Care
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We are committed to providing a seamless shopping experience. Our
              customer care team is available to assist you with product
              inquiries, order updates, returns, or any concerns.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              You can reach us via email at support@[yourstore].com or through
              our contact form. We aim to respond within 24–48 business hours.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your satisfaction remains our highest priority.
            </p>
          </section>
        </FadeIn>

        <div className="border-t border-gray-200 opacity-70" />

        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Privacy & Safety
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your trust is essential to us. We use secure encryption and
              trusted payment gateways to protect your personal information.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Data collected — such as your name, email, and address — is used
              solely to process orders and enhance your experience.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We do not sell or share your data with third parties.
            </p>
          </section>
        </FadeIn>

        <div className="border-t border-gray-200 opacity-70" />

        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Wholesale Inquiries
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We welcome partnerships with retailers and businesses worldwide.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              For bulk orders, special pricing, or collaborations, contact
              wholesale@[yourstore].com.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our team will guide you through terms, minimum order quantities,
              and logistics.
            </p>
          </section>
        </FadeIn>

        <div className="border-t border-gray-200 opacity-70" />

        <FadeIn>
          <section className="space-y-6">
            <h2 className="text-lg sm:text-2xl font-light tracking-wide">
              Payment Methods
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We offer multiple secure payment options for your convenience.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              You can pay using major credit and debit cards, UPI, net banking,
              and digital wallets.
            </p>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              All transactions are processed through trusted gateways to ensure
              complete security.
            </p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
};

export default StorePolicy;
