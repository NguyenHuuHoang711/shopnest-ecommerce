import { useRef, useState } from "react";
import { useContactMessageMutation } from "@/redux/api/apiSlice.js";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/common/FadeIn.jsx";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton.jsx";

const Contact = () => {
  const { toast } = useToast();

  const [contactMessage, { isLoading }] = useContactMessageMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, message } = formData;

    if (!firstName.trim()) {
      firstNameRef.current?.focus();

      return toast({
        variant: "destructive",
        description: "Enter first name ❌",
      });
    }

    if (!lastName.trim()) {
      lastNameRef.current?.focus();

      return toast({
        variant: "destructive",
        description: "Enter last name ❌",
      });
    }

    if (!email.trim()) {
      emailRef.current?.focus();

      return toast({
        variant: "destructive",
        description: "Enter email ❌",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailRef.current?.focus();

      return toast({
        variant: "destructive",
        description: "Invalid email ❌",
      });
    }

    if (!message.trim()) {
      messageRef.current?.focus();

      return toast({
        variant: "destructive",
        description: "Enter message ❌",
      });
    }

    try {
      await contactMessage(formData).unwrap();

      toast({
        title: "Message Sent 🎉",
        description: "We’ll get back to you shortly.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "Something went wrong ❌",
      });
    }
  };

  return (
    <div className="animate-fadeIn bg-white">
      <div className="relative w-full">
        <div className="w-full aspect-[4/5] sm:aspect-[16/9] 2xl:aspect-[21/9]">
          <img
            src="/images/marjan-taghipour-W_iBXR2m6cw-unsplash-800"
            srcSet="
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-400.webp 400w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-600.webp 600w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-800.webp 800w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-1200.webp 1200w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-1600.webp 1600w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-2000.webp 2000w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-2400.webp 2400w,
  /images/marjan-taghipour-W_iBXR2m6cw-unsplash-3000.webp 3000w
  
"
            fetchPriority="high"
            loading="eager"
            alt="Contact"
            sizes="100vw"
            className="w-full h-full object-cover"
            width={800}
            height={1000}
          />
        </div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-end justify-center text-center text-white pb-16 px-4">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-70 mb-3">
              Contact
            </p>

            <h1 className="text-4xl sm:text-7xl font-light tracking-wide">
              Get in Touch
            </h1>
          </div>
        </div>
      </div>

      <FadeIn>
        <section className="max-w-5xl mx-auto px-4 py-24 grid sm:grid-cols-3 gap-12 text-center">
          <div className="space-y-3 hover:opacity-70 transition">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
              Customer Service
            </p>
            <p className="text-gray-600 text-sm">
              +91 99999 99999 support@novastone.com
            </p>
          </div>

          <div className="space-y-3 hover:opacity-70 transition">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
              Visit Us
            </p>
            <p className="text-gray-600 text-sm">
              Delhi, India Premium Streetwear Studio
            </p>
          </div>

          <div className="space-y-3 hover:opacity-70 transition">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
              Hours
            </p>
            <p className="text-gray-600 text-sm">
              Mon – Fri: 10am – 8pm Sat – Sun: 11am – 7pm
            </p>
          </div>
        </section>
      </FadeIn>

      <div className="max-w-md mx-auto border-t border-gray-200 opacity-70" />

      <FadeIn>
        <section className="max-w-xl mx-auto px-4 py-24 space-y-8 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400">
            Message Us
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label
                  htmlFor="firstName"
                  className="text-[12px]
                        font-medium
                        text-black/65"
                >
                  First Name*
                </label>
                <input
                  ref={firstNameRef}
                  id="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none  focus:border-black transition-all 
                duration-150 px-2"
                />
              </div>
              <div className="space-y-2.5">
                <label
                  htmlFor="lastName"
                  className="  text-[12px]
                    font-medium
                    text-black/65"
                >
                  Last Name*
                </label>
                <input
                  ref={lastNameRef}
                  id="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                focus:outline-none focus:border-black transition-all 
                duration-150 px-2"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label
                htmlFor="email"
                className="text-[12px]
                  font-medium
                  text-black/65"
              >
                Email*
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="h-12 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
              focus:outline-none focus:border-black transition-all 
              duration-150 px-2"
              />
            </div>

            <div className="space-y-2.5">
              <label
                className="  text-[12px]
                  font-medium
                  text-black/65"
              >
                Message*
              </label>
              <textarea
                ref={messageRef}
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                className="resize-none min-h-32 w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
              focus:outline-none focus:border-black transition-all 
              duration-150 px-2"
              />
            </div>

            <div className="text-center pt-4">
              <PrimaryButton type="submit" disabled={isLoading} className="">
                {isLoading ? "Sending..." : "Send Message"}
              </PrimaryButton>
            </div>
          </form>
        </section>
      </FadeIn>
    </div>
  );
};

export default Contact;
