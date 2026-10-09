import React, { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { useToast } from "@/hooks/use-toast";
const EditProfileModal = lazy(
  () => import("@/components/modals/EditProfileModal"),
);
const ChangePasswordModal = lazy(
  () => import("@/components/modals/change-password/ChangePasswordModal"),
);
import { useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "@/redux/api/apiSlice";
import ProfileSkeleton from "@/components/feedback/loading/ProfileSkeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
import EmptyState from "@/components/feedback/empty-state/EmptyState";
import TextButton from "@/components/ui/buttons/TextButton";

const focusField = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus();
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [updatePassword, { isLoading: updatingPassword }] =
    useUpdatePasswordMutation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } =
    useGetProfileQuery();
  const user = data?.user;
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [open, user]);

  useEffect(() => {
    if (!passwordOpen) {
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirm(false);
    }
  }, [passwordOpen]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    window.location.replace("/");
  };

  const validateForm = () => {
    const { email, name } = form;

    if (!name.trim()) {
      focusField("name");
      return "Enter your name";
    }

    if (name.trim().length < 2) {
      focusField("name");
      return "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      focusField("email");
      return "Enter your email";
    }

    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
      focusField("email");
      return "Invalid email format";
    }

    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (updating) return;

    const error = validateForm();

    if (error) {
      toast({
        variant: "destructive",
        description: error,
      });
      return;
    }

    try {
      const res = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      }).unwrap();

      toast({
        description: res.message || "Profile updated",
      });

      setOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || "Update failed",
      });
    }
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = password;

    if (!currentPassword.trim()) {
      focusField("currentPassword");
      return "Enter your current password";
    }

    if (!newPassword.trim()) {
      focusField("newPassword");
      return "Enter your new password";
    }

    if (newPassword.length < 8) {
      focusField("newPassword");
      return "Password must be at least 8 characters";
    }

    if (newPassword.length > 64) {
      focusField("newPassword");
      return "Password cannot exceed 64 characters";
    }

    if (!/[A-Z]/.test(newPassword)) {
      focusField("newPassword");
      return "Add at least 1 uppercase letter";
    }

    if (!/[a-z]/.test(newPassword)) {
      focusField("newPassword");
      return "Add at least 1 lowercase letter";
    }

    if (!/\d/.test(newPassword)) {
      focusField("newPassword");
      return "Add at least 1 number";
    }

    if (!/[^\w\s]/.test(newPassword)) {
      focusField("newPassword");
      return "Add at least 1 special character";
    }

    if (currentPassword === newPassword) {
      focusField("newPassword");
      return "New password must be different";
    }

    if (!confirmPassword.trim()) {
      focusField("confirmPassword");
      return "Confirm your new password";
    }

    if (newPassword !== confirmPassword) {
      focusField("confirmPassword");
      return "Passwords do not match";
    }

    return null;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (updatingPassword) {
      return;
    }

    const error = validatePassword();

    if (error) {
      toast({
        variant: "destructive",
        description: error,
      });
      return;
    }

    try {
      const res = await updatePassword({
        currentPassword: password.currentPassword.trim(),
        newPassword: password.newPassword.trim(),
        confirmPassword: password.confirmPassword.trim(),
      }).unwrap();

      toast({
        description: res.message || "Password updated",
      });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirm(false);
      setPasswordOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err?.data?.message || "Update failed",
      });
    }
  };

  const isChanged =
    form.name.trim() !== user?.name?.trim() ||
    form.email.trim().toLowerCase() !== user?.email?.trim().toLowerCase();

  if (isLoading || isFetching) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        refetch={refetch}
        isFetching={isFetching}
        title="Unable to load profile"
        description="We couldn't load your account details right now. Please try again."
      />
    );
  }

  if (!isLoading && !isError && !user) {
    return (
      <EmptyState
        title="Profile not found"
        description="We couldn't find your account details."
        showAction
        actionText="Go Home"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <>
      <div className="bg-white text-black min-h-[60vh] animate-fadeIn">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <Breadcrumbs />
        </div>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-6 pb-8">
          <div className="space-y-8 ">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400">
              Account
            </p>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-sm font-light tracking-wide">
                {user.name?.[0]?.toUpperCase()}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
                  {user.name}
                </h1>
                <p className="text-sm text-gray-400 tracking-wide">
                  {user.email}
                </p>
              </div>
            </div>

            <TextButton
              aria-label="Edit profile"
              disabled={isLoading}
              onClick={() => setOpen(true)}
              className="
text-[11px]
tracking-[0.3em]
disabled:cursor-not-allowed
"
            >
              Edit Profile
            </TextButton>
          </div>

          <div className="mt-16 space-y-8">
            <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400">
              Activity
            </p>
            <div className="border-t border-b divide-y divide-gray-100">
              <button
                onClick={() => navigate("/orders")}
                className="group w-full flex items-center justify-between py-5 px-2 
    text-sm tracking-wide transition-all duration-150 
    hover:bg-gray-50 active:scale-[0.985]"
              >
                <div className="flex flex-col items-start">
                  <span className="text-black">Orders</span>
                  <span className="text-[11px] text-gray-400 group-hover:text-gray-500 transition">
                    Track and manage your orders
                  </span>
                </div>

                <span
                  className="text-gray-300 transition-all duration-150 
      group-hover:text-black group-hover:translate-x-1"
                >
                  →
                </span>
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className="group w-full flex items-center justify-between py-5 px-2 text-sm tracking-wide transition-all duration-150 hover:bg-gray-50 active:scale-[0.985]"
              >
                <div className="flex flex-col items-start">
                  <span className="text-black">Wishlist</span>
                  <span className="text-[11px] text-gray-400 group-hover:text-gray-500 transition">
                    Saved items for later
                  </span>
                </div>

                <span
                  className="text-gray-300 transition-all duration-150 
      group-hover:text-black group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
            <div className="mt-12 space-y-8">
              <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400">
                Security
              </p>

              <div className="border-t border-b divide-y divide-gray-100">
                <button
                  onClick={() => setPasswordOpen(true)}
                  className="group w-full flex items-center justify-between py-5 px-2 text-sm tracking-wide transition-all duration-150 hover:bg-gray-50 active:scale-[0.995]"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-black">Change Password</span>
                    <span className="text-[11px] text-gray-400 group-hover:text-gray-500 transition">
                      Update your account password
                    </span>
                  </div>

                  <span
                    className="text-gray-300 transition-all duration-150 
        group-hover:text-black group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <TextButton
              aria-label="Logout"
              onClick={handleLogout}
              className="tracking-[0.3em] text-black/40 hover-supported:hover:text-red-500 focus-visible:ring-red-500"
            >
              LOGOUT
            </TextButton>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <EditProfileModal
          open={open}
          setOpen={setOpen}
          onConfirm={handleSave}
          form={form}
          setForm={setForm}
          isLoading={updating}
          isChanged={isChanged}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ChangePasswordModal
          open={passwordOpen}
          setOpen={setPasswordOpen}
          onConfirm={handlePasswordChange}
          form={password}
          setForm={setPassword}
          isLoading={updatingPassword}
          showCurrentPassword={showCurrentPassword}
          setShowCurrentPassword={setShowCurrentPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
        />
      </Suspense>
    </>
  );
};

export default Profile;
