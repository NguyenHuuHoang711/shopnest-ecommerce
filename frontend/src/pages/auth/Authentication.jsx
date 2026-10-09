import Signin from "@/features/auth/components/signin/Signin";
import Signup from "@/features/auth/components/signup/Signup";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Authentication = () => {
  const { toast } = useToast();

  const [mode, setMode] = useState("signin");

  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token);

    const redirectTo = location.state?.from || "/";
    navigate(redirectTo, { replace: true });
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

  useEffect(() => {
    const message = sessionStorage.getItem("authMessage");

    if (message) {
      toast({
        description: message,
      });

      sessionStorage.removeItem("authMessage");
    }
  }, [toast]);

  return (
    <>
      <div className="animate-fadeIn bg-white text-black min-h-screen flex items-center justify-center px-4 ">
        <div className="w-full max-w-[500px]">
          <div key={mode} className="animate-step">
            {mode === "signup" ? (
              <Signup setMode={setMode} handleAuthSuccess={handleAuthSuccess} />
            ) : (
              <Signin setMode={setMode} handleAuthSuccess={handleAuthSuccess} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
