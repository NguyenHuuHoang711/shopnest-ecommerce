import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddShippingAddressMutation,
  useDeleteAddressMutation,
  useGetUserAddressesQuery,
} from "@/redux/api/apiSlice";
import { useToast } from "@/hooks/use-toast";
import SavedDetails from "../shared/SavedDetails";
import ShippingInputs from "./ShippingInputs";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SavedDetailsSkeleton from "@/components/feedback/loading/SavedDetailsSkeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
const ConfirmModal = lazy(() => import("@/components/modals/ConfirmModal"));
import { ArrowLeft } from "lucide-react";

const focusField = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus();
};

const capitalizeWords = (str = "") =>
  str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const normalizeShipping = (data = {}) => ({
  fullName: data.fullName || "",
  phone: data.phone || "",
  address1: data.address1 || "",
  address2: data.address2 || "",
  landmark: data.landmark || "",
  postalCode: data.postalCode || "",
  city: data.city || "",
  state: data.state || "",
});

const Shipping = ({ setCurrentStep }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingValue, setShippingValue] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    landmark: "",
    postalCode: "",
    city: "",
    state: "",
  });
  const [open, setOpen] = useState(false);

  const [addShippingAddress, { isLoading }] = useAddShippingAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const token = localStorage.getItem("token");
  const {
    data,
    isLoading: loadingAddress,
    isError,
    isFetching,
    refetch,
  } = useGetUserAddressesQuery(undefined, {
    skip: !token,
  });

  const savedAddresses = data?.addresses || [];

  useEffect(() => {
    const savedId = localStorage.getItem("shippingAddressId");
    const draft = localStorage.getItem("shippingDraft");
    const final = localStorage.getItem("shippingAddress");

    if (savedId) {
      setSelectedAddressId(savedId);
    } else if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setShippingValue(normalizeShipping(parsed));
        localStorage.removeItem("shippingAddressId");
        toast({
          title: "Restored your previous progress",
        });
      } catch (e) {
        console.error("Invalid draft data");
        localStorage.removeItem("shippingDraft");
      }
    } else if (final) {
      try {
        const parsed = JSON.parse(final);
        setShippingValue(normalizeShipping(parsed));
      } catch {
        localStorage.removeItem("shippingAddress");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedAddressId) {
      localStorage.removeItem("shippingAddress");
      localStorage.setItem(`shippingAddressId`, selectedAddressId);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    if (!selectedAddressId) return;

    const address = savedAddresses.find(
      (addr) => addr._id === selectedAddressId,
    );

    if (address) {
      setShippingValue({
        fullName: address.fullName || "",
        phone: address.phone || "",
        address1: address.address1 || "",
        address2: address.address2 || "",
        landmark: address.landmark || "",
        postalCode: address.postalCode || "",
        city: address.city || "",
        state: address.state || "",
      });
    }
  }, [selectedAddressId, savedAddresses]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (selectedAddressId) {
      setSelectedAddressId(null);
      localStorage.removeItem("shippingAddressId");
    }

    setShippingValue((prev) => {
      const updated = { ...prev, [id]: value };

      localStorage.setItem("shippingDraft", JSON.stringify(updated));

      return updated;
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id).unwrap();

      toast({
        title: "Address deleted successfully",
      });

      if (selectedAddressId === id) {
        setSelectedAddressId(null);
        localStorage.removeItem("shippingAddressId");
      }

      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || "Failed to delete address",
      });
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!shippingValue.fullName.trim()) {
      focusField("fullName");

      return toast({
        variant: "destructive",
        title: "Enter your full name",
      });
    }

    if (!shippingValue.phone.trim()) {
      focusField("phone");

      return toast({
        variant: "destructive",
        title: "Enter your phone number",
      });
    }

    if (!/^[0-9]{10}$/.test(shippingValue.phone)) {
      focusField("phone");

      return toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Phone number must be exactly 10 digits.",
      });
    }

    if (!shippingValue.address1.trim()) {
      focusField("address1");

      return toast({
        variant: "destructive",
        title: "Enter your address",
      });
    }

    if (!shippingValue.postalCode.trim()) {
      focusField("postalCode");

      return toast({
        variant: "destructive",
        title: "Enter your postal code",
      });
    }

    if (!/^[1-9][0-9]{5}$/.test(shippingValue.postalCode)) {
      focusField("postalCode");

      return toast({
        variant: "destructive",
        title: "Invalid postal code",
        description: "Postal code must be exactly 6 digits.",
      });
    }

    if (!shippingValue.city.trim()) {
      focusField("city");

      return toast({
        variant: "destructive",
        title: "Enter your city",
      });
    }

    if (!shippingValue.state.trim()) {
      focusField("state");

      return toast({
        variant: "destructive",
        title: "Enter your state",
      });
    }

    const cleanedValue = Object.fromEntries(
      Object.entries(shippingValue).map(([k, v]) => {
        const value = String(v || "").trim();

        if (k === "city" || k === "state" || k === "fullName") {
          return [k, capitalizeWords(value)];
        }

        return [k, value];
      }),
    );
    const { _id, userId, ...safeData } = cleanedValue;

    try {
      let addressId;
      if (selectedAddressId) {
        addressId = selectedAddressId;

        localStorage.setItem("shippingAddressId", addressId);
        localStorage.removeItem("shippingAddress");

        toast({
          title: `Using saved address: ${cleanedValue.city}, ${cleanedValue.state}`,
        });
      } else {
        const res = await addShippingAddress(safeData).unwrap();
        addressId = res?._id || res?.address?._id;

        localStorage.setItem("shippingAddress", JSON.stringify(safeData));

        toast({ title: "New shipping address saved!" });
      }

      setSelectedAddressId(addressId);
      localStorage.removeItem("shippingDraft");
      setCurrentStep(2);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || err?.message || "Something went wrong",
      });
    }
  };

  return (
    <>
      <div className="space-y-10 w-full">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
            ADDRESS DETAILS
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-wide">
            Shipping Information
          </h2>
        </div>

        {loadingAddress || isFetching ? (
          <SavedDetailsSkeleton address />
        ) : isError ? (
          <ErrorState
            compact
            refetch={refetch}
            isFetching={isFetching}
            title="Unable to load saved addresses"
            description="You can still enter a new shipping address below."
          />
        ) : (
          savedAddresses.length > 0 && (
            <SavedDetails
              selectedId={selectedAddressId}
              setSelectedId={setSelectedAddressId}
              saved={savedAddresses}
              setOpen={setOpen}
              address
            />
          )
        )}
        <form onSubmit={handleNext}>
          <ShippingInputs
            shippingValue={shippingValue}
            setShippingValue={setShippingValue}
            handleChange={handleChange}
            capitalizeWords={capitalizeWords}
          />

          <div className="border-t border-gray-100 pt-6 flex justify-between items-center"></div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="
            inline-flex
            items-center
            gap-2
            
            text-[13px]
            font-medium
            
            text-black/70
            active:scale-[0.985]
            
            transition-colors
            duration-150
            
            hover-supported:hover:text-black
            "
            >
              <ArrowLeft size={16} />
              Back to Cart
            </button>

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </PrimaryButton>
          </div>
        </form>
      </div>

      <Suspense fallback={null}>
        <ConfirmModal
          openModal={open}
          setOpenModal={setOpen}
          onConfirm={async () => {
            await handleDelete(selectedAddressId);
            setOpen(false);
          }}
          isLoading={isDeleting}
          title="Delete this address?"
          description="This action cannot be undone."
          confirmText="Delete"
        />
      </Suspense>
    </>
  );
};

export default memo(Shipping);
