import React, { memo } from "react";
import { Label } from "@/components/ui/label";

const PaymentInputs = ({
  paymentValue,
  setPaymentValue,
  handleChange,
  capitalizeWords,
  formatCard,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          Name on Card*
        </Label>
        <input
          id="name"
          type="text"
          value={paymentValue.name}
          onChange={handleChange}
          onBlur={(e) =>
            setPaymentValue((prev) => ({
              ...prev,
              name: capitalizeWords(e.target.value),
            }))
          }
          placeholder="Rahul Sharma"
          className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>

      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          Card Number*
        </Label>
        <input
          id="cardNumber"
          type="text"
          value={formatCard(paymentValue.cardNumber)}
          inputMode="numeric"
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label
            className="
        text-[12px]
        font-medium
        text-black/65
      "
          >
            Expiry*
          </Label>

          <div className="flex items-center gap-3">
            <input
              id="month"
              type="text"
              inputMode="numeric"
              value={paymentValue.month}
              onChange={handleChange}
              placeholder="MM"
              className="
          h-12
          w-[72px]
          shrink-0
          border-b
          border-gray-300
          py-2
          px-2
          pr-8
          text-base sm:text-sm
          focus:outline-none
          focus:border-black
          transition-all
          duration-150
        "
            />

            <span className="shrink-0 text-black/40">/</span>

            <input
              id="year"
              type="text"
              inputMode="numeric"
              value={paymentValue.year}
              onChange={handleChange}
              placeholder="YYYY"
              className="
          h-12
          min-w-0
          flex-1
          border-b
          border-gray-300
          py-2
          px-2
          pr-8
          text-base sm:text-sm
          focus:outline-none
          focus:border-black
          transition-all
          duration-150
        "
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label
            className="
        text-[12px]
        font-medium
        text-black/65
      "
          >
            CVV*
          </Label>

          <input
            id="cvv"
            type="text"
            inputMode="numeric"
            value={paymentValue.cvv}
            onChange={handleChange}
            placeholder="3–4 digits"
            className="
        h-12
        w-full
        border-b
        border-gray-300
        py-2
        px-2
        pr-8
        text-base sm:text-sm
        focus:outline-none
        focus:border-black
        transition-all
        duration-150
      "
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentInputs);
