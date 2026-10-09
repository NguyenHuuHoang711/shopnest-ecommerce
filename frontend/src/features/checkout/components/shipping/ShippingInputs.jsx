import React, { memo } from "react";
import { Label } from "@/components/ui/label";

const ShippingInputs = ({
  shippingValue,
  setShippingValue,
  handleChange,
  capitalizeWords,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label
            className="  text-[12px]
    font-medium
    text-black/65"
          >
            Full Name*
          </Label>
          <input
            id="fullName"
            type="text"
            value={shippingValue.fullName}
            onChange={handleChange}
            onBlur={(e) =>
              setShippingValue((prev) => ({
                ...prev,
                fullName: capitalizeWords(e.target.value),
              }))
            }
            placeholder="Rahul Sharma"
            className="w-full  h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
          />
        </div>

        <div className="space-y-2.5">
          <Label
            className="  text-[12px]
    font-medium
    text-black/65"
          >
            Phone*
          </Label>
          <input
            id="phone"
            type="tel"
            value={shippingValue.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="w-full  h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          Address Line 1*
        </Label>
        <input
          id="address1"
          type="text"
          value={shippingValue.address1}
          onChange={handleChange}
          placeholder="House no., building, street"
          className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>

      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          Address Line 2
        </Label>
        <input
          id="address2"
          type="text"
          value={shippingValue.address2}
          onChange={handleChange}
          placeholder="Area, locality (optional)"
          className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>

      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          Landmark
        </Label>
        <input
          id="landmark"
          type="text"
          value={shippingValue.landmark}
          onChange={handleChange}
          placeholder="Nearby landmark (optional)"
          className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label
            className="  text-[12px]
    font-medium
    text-black/65"
          >
            Postal Code*
          </Label>
          <input
            id="postalCode"
            type="text"
            inputMode="numeric"
            value={shippingValue.postalCode}
            onChange={handleChange}
            placeholder="6-digit PIN code"
            className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
          />
        </div>

        <div className="space-y-2.5">
          <Label
            className="  text-[12px]
    font-medium
    text-black/65"
          >
            City*
          </Label>
          <input
            id="city"
            type="text"
            value={shippingValue.city}
            onChange={handleChange}
            onBlur={(e) =>
              setShippingValue((prev) => ({
                ...prev,
                city: capitalizeWords(e.target.value),
              }))
            }
            placeholder="city"
            className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label
          className="  text-[12px]
    font-medium
    text-black/65"
        >
          State*
        </Label>
        <input
          id="state"
          type="text"
          value={shippingValue.state}
          onChange={handleChange}
          onBlur={(e) =>
            setShippingValue((prev) => ({
              ...prev,
              state: capitalizeWords(e.target.value),
            }))
          }
          placeholder="State"
          className="w-full h-12 border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all duration-150 px-2"
        />
      </div>
    </div>
  );
};

export default memo(ShippingInputs);
