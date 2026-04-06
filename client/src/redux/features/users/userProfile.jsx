import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUpdateAccountDetailsMutation,
  useChangePasswordMutation,
  useGetRecentlyViewedCarsQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./userApi";
import LogoutButton from "../auth/logout";
import Loader from "../ui/loader";

/* ================== REUSABLE UI ================== */

const Input = ({ value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 text-base border rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
);

const Label = ({ children }) => (
  <label className="text-xs text-slate-500">{children}</label>
);

const PrimaryButton = ({ children, loading, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled || loading}
    className="px-5 py-2 text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "..." : children}
  </button>
);

const SecondaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className="px-5 py-2 transition border rounded-xl hover:bg-slate-100"
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="p-5 bg-white shadow rounded-2xl">{children}</div>
);

/* ================== MAIN ================== */

const MyProfile = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError, refetch } =
    useGetUserProfileQuery(undefined);

  const user = data?.data;

  useGetRecentlyViewedCarsQuery(undefined, {
    skip: !user,
  });

  const [updateAccount, { isLoading: updatingAccount }] =
    useUpdateAccountDetailsMutation();

  const [changePassword, { isLoading: updatingPassword }] =
    useChangePasswordMutation();

  const [forgotPassword, { isLoading: sendingOtp }] =
    useForgotPasswordMutation();

  const [resetPassword, { isLoading: resettingPassword }] =
    useResetPasswordMutation();

  const [accountForm, setAccountForm] = useState({
    fullName: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    if (user != null) {
      setAccountForm({
        fullName: user.fullName || "",
      });

      setForgotForm((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ change detection
  const isChanged =
    accountForm.fullName !== user?.fullName || avatar !== null;

  const handleAccountUpdate = async () => {
    try {
      await updateAccount({
        fullName: accountForm.fullName,
        avatar,
      }).unwrap();

      setAvatar(null);
      refetch();
    } catch {}
  };

  const handlePasswordUpdate = async () => {
    try {
      await changePassword(passwordForm).unwrap();
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch {}
  };

  const handleSendOtp = async () => {
    if (!forgotForm.email) return setError("Email required");
    setError("");
    try {
      await forgotPassword(forgotForm.email).unwrap();
      setStep("otp");
    } catch {
      setError("Failed");
    }
  };

  const handleResetPassword = async () => {
    if (
      !forgotForm.otp ||
      !forgotForm.newPassword ||
      forgotForm.newPassword !== forgotForm.confirmPassword
    ) {
      return setError("Invalid input");
    }

    try {
      await resetPassword({
        email: forgotForm.email,
        otp: forgotForm.otp,
        newPassword: forgotForm.newPassword,
      }).unwrap();

      setShowForgot(false);
      setStep("email");
    } catch {
      setError("Failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen p-4 bg-slate-100">
      <div className="flex flex-col max-w-5xl gap-6 mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <Card>
          {/* HEADER */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={preview || user?.avatar?.url}
                alt="avatar"
                className="object-cover w-20 h-20 rounded-full"
              />

              {/* overlay edit */}
              <label className="absolute top-0 right-0 px-2 py-1 text-xs rounded-full cursor-pointer bg-slate-100">
                Edit
                <input type="file" hidden onChange={handleAvatarChange} />
              </label>

              {/* unsaved badge */}
              {preview && (
                <span className="absolute bottom-0 right-0 px-2 py-1 text-xs text-white bg-indigo-600 rounded-full">
                  New
                </span>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold sm:text-3xl text-slate-900">
                My Profile
              </h2>
              <p className="text-base text-slate-700">
                Manage your account details
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid gap-4 pt-4 border-t md:grid-cols-2">

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label>Full Name</Label>
              <Input
                value={accountForm.fullName}
                onChange={(e) =>
                  setAccountForm({
                    ...accountForm,
                    fullName: e.target.value,
                  })
                }
                placeholder="Full Name"
              />
            </div>

            {/* Email (READ ONLY) */}
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <div className="p-3 text-base rounded-xl bg-slate-100 text-slate-700">
                {user?.email || "—"}
              </div>
              <p className="text-xs text-slate-500">
                Email cannot be changed right now
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex gap-4 pt-4 border-t">
            <PrimaryButton
              onClick={handleAccountUpdate}
              loading={updatingAccount}
              disabled={!isChanged}
            >
              Save Profile
            </PrimaryButton>
          </div>
        </Card>

        {/* ================= PASSWORD CARD ================= */}
        <Card>
          <h3 className="text-lg font-medium">Change Password</h3>

          <div className="grid gap-4 pt-4 border-t md:grid-cols-2">
            <Input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
              placeholder="Old Password"
            />
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              placeholder="New Password"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <PrimaryButton
              onClick={handlePasswordUpdate}
              loading={updatingPassword}
            >
              Update Password
            </PrimaryButton>

            <SecondaryButton onClick={() => setShowForgot(!showForgot)}>
              Forgot?
            </SecondaryButton>

            <LogoutButton />
          </div>

          {showForgot && (
            <div className="flex flex-col gap-4 pt-4 border-t">
              {step === "email" && (
                <>
                  <Input
                    type="email"
                    value={forgotForm.email}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <PrimaryButton onClick={handleSendOtp} loading={sendingOtp}>
                    Send OTP
                  </PrimaryButton>
                </>
              )}

              {step === "otp" && (
                <>
                  <Input
                    value={forgotForm.otp}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, otp: e.target.value })
                    }
                    placeholder="OTP"
                  />
                  <PrimaryButton onClick={() => setStep("reset")}>
                    Verify
                  </PrimaryButton>
                </>
              )}

              {step === "reset" && (
                <>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={forgotForm.newPassword}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={forgotForm.confirmPassword}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <PrimaryButton
                    onClick={handleResetPassword}
                    loading={resettingPassword}
                  >
                    Reset
                  </PrimaryButton>
                </>
              )}

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyProfile;