import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/redux/api/apiSlice";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [values, setValues] = useState({
    email: "",
  });
  const emailRef = useRef(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(values.email);

  const validateForm = () => {
    const { email } = values;
    if (!email) {
      emailRef.current.focus();
      return "Please fill in email field";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      emailRef.current.focus();
      return "Invalid email format";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email } = values;

    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        description: error,
      });
      return;
    }
    try {
      const res = await forgotPassword(values).unwrap();

      toast({
        title: res?.message || "Reset link sent to your email ✅",
      });

      setValues({
        email: "",
      });
    } catch (err) {
      toast({
        title: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="animate-fadeIn bg-white text-black min-h-screen flex items-center 
justify-center px-4 "
    >
      <div className="w-full max-w-[500px]">
        <div className="animate-step">
          <div className="bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-12">
              <div className="text-center space-y-3">
                <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
                  Forgot Your Password
                </h1>
                <p className="text-sm text-gray-500">Enter your email</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2.5">
                  <label
                    className="
    text-[12px]
    font-medium
    text-black/65
  "
                  >
                    Email
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-12 w-full border-b border-gray-300 py-2 text-sm
            focus:outline-none focus:border-black transition-all duration-150
px-2"
                  />
                  {!isEmailValid && values.email && (
                    <p className="text-xs text-red-500">Invalid email</p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </PrimaryButton>

                  <SecondaryButton
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
    w-full
  "
                  >
                    Cancel
                  </SecondaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
