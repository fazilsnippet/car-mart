import { useState, useEffect } from "react";
import {
  useGetUserProfileQuery,
  useUpdateAccountDetailsMutation,
  useChangePasswordMutation,
  useGetRecentlyViewedCarsQuery,
    useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./userApi";


const MyProfile = () => {
  const { data, isLoading, refetch } = useGetUserProfileQuery();
  const { data: recentCars } = useGetRecentlyViewedCarsQuery();

  const [updateAccount, { isLoading: updatingAccount }] =
    useUpdateAccountDetailsMutation();

  const [changePassword, { isLoading: updatingPassword }] =
    useChangePasswordMutation();

  const [forgotPassword, { isLoading: sendingOtp }] =
    useForgotPasswordMutation();

  const [resetPassword, { isLoading: resettingPassword }] =
    useResetPasswordMutation();

  const user = data?.data;

  const [accountForm, setAccountForm] = useState({
    fullName: "",
    email: "",
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
  // "email" → "otp" → "reset"

  const [error, setError] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showForgot, setShowForgot] = useState(false);

  // Initialize form when user loads
  useEffect(() => {
    if (user) {
      setAccountForm({
        fullName: user.fullName || "",
        email: user.email || "",
      });

      setForgotForm((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAccountUpdate = async () => {
    try {
      await updateAccount({
        fullName: accountForm.fullName,
        email: accountForm.email,
        avatar,
      }).unwrap();

      refetch();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await changePassword(passwordForm).unwrap();
      setPasswordForm({ oldPassword: "", newPassword: "" });
      alert("Password updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Password update failed");
    }
  };

  const handleSendOtp = async () => {
    if (!forgotForm.email) {
      setError("Email is required");
      return;
    }

    setError("");
    try {
      await forgotPassword(forgotForm.email).unwrap();
      setStep("otp");
    } catch (err) {
      setError(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!forgotForm.otp || !forgotForm.newPassword || !forgotForm.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    try {
      await resetPassword({
        email: forgotForm.email,
        otp: forgotForm.otp,
        newPassword: forgotForm.newPassword,
      }).unwrap();
      alert("Password reset successful");
      setShowForgot(false);
      setStep("email");
      setForgotForm({
        email: user?.email || "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err?.data?.message || "Reset failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* PROFILE CARD */}
        <div className="flex flex-col items-center gap-8 p-8 shadow-xl bg-slate-800 rounded-2xl md:flex-row">
          <img
            src={preview || user?.profilePicture}
            alt="avatar"
            className="object-cover border-4 rounded-full w-28 h-28 border-emerald-500"
          />

          <div className="flex-1 w-full space-y-4">
            <h2 className="text-2xl font-bold">My Profile</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={accountForm.fullName}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, fullName: e.target.value })
                }
                className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                placeholder="Full Name"
              />

              <input
                type="email"
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, email: e.target.value })
                }
                className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                placeholder="Email"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="px-4 py-2 rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600">
                Change Avatar
                <input type="file" hidden onChange={handleAvatarChange} />
              </label>

              <button
                onClick={handleAccountUpdate}
                disabled={updatingAccount}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {updatingAccount ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="p-8 space-y-6 shadow-xl bg-slate-800 rounded-2xl">
          <h3 className="text-xl font-semibold">Change Password</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="password"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
              className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={updatingPassword}
            className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>

          {/* FORGOT PASSWORD SECTION */}
          <p
            className="mt-4 text-sm cursor-pointer text-emerald-400 hover:underline"
            onClick={() => {
              setShowForgot((prev) => !prev);
              setStep("email");
              setError("");
            }}
          >
            Forgot password?
          </p>

          {showForgot && (
            <div className="pt-6 mt-6 space-y-4 border-t border-slate-600">
              <h4 className="font-semibold">Reset via OTP</h4>

              {/* STEP 1 — EMAIL */}
              {step === "email" && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotForm.email}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, email: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {sendingOtp ? "Sending..." : "Confirm & Send OTP"}
                  </button>
                </>
              )}

              {/* STEP 2 — OTP */}
              {step === "otp" && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={forgotForm.otp}
                    onChange={(e) =>
                      setForgotForm({ ...forgotForm, otp: e.target.value })
                    }
                    className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    onClick={() => {
                      if (!forgotForm.otp) {
                        setError("OTP is required");
                        return;
                      }
                      setError("");
                      setStep("reset");
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {/* STEP 3 — NEW PASSWORD (ONLY AFTER OTP VERIFIED) */}
              {step === "reset" && (
                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={forgotForm.newPassword}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={forgotForm.confirmPassword}
                    onChange={(e) =>
                      setForgotForm({
                        ...forgotForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
                  />

                  <button
                    onClick={handleResetPassword}
                    disabled={resettingPassword}
                    className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {resettingPassword ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* RECENTLY VIEWED */}
        <div className="p-8 space-y-6 shadow-xl bg-slate-800 rounded-2xl">
          <h3 className="text-xl font-semibold">Recently Viewed</h3>

          {recentCars?.length === 0 && (
            <p className="text-slate-400">No recently viewed cars.</p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recentCars?.map((car) => (
              <div
                key={car._id}
                className="p-4 transition transform bg-slate-700 rounded-xl hover:scale-105"
              >
                <img
                  src={car.images?.[0]}
                  alt={car.title}
                  className="object-cover w-full h-40 rounded-lg"
                />
                <h4 className="mt-3 font-semibold">{car.title}</h4>
                <p className="font-bold text-emerald-400">
                  ₹ {car.price?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;

// import React, { useState, useCallback, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Sun, Moon, Settings, Heart, BookOpen, MessageCircle, User, KeyRound, LogOut } from "lucide-react";
// import ProfileDrawer from "./profileDrawer";
// import ProfileNavButton from "./profileNavButton";
// import LogoutConfirmModal from "./logoutConfirmModal";
// import { setTheme } from "../ui/theme";
// import { logout as logoutAction } from "../auth/authSlice";
// import { useLogoutUserMutation } from "../../features/auth/authApi";

// const MyProfile = ({ isOpen, onClose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { theme } = useSelector((state) => state.ui);

//   const [logoutApi] = useLogoutUserMutation();
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   const unreadCount = user?.unreadMessages || 0;

//   const toggleTheme = useCallback(() => {
//     dispatch(setTheme(theme === "dark" ? "light" : "dark"));
//   }, [dispatch, theme]);

//   const handleNavigate = useCallback(
//     (path) => {
//       navigate(path);
//       onClose();
//     },
//     [navigate, onClose]
//   );

//   const handleLogout = useCallback(async () => {
//     try {
//       await logoutApi().unwrap();
//     } catch (err) {}
//     dispatch(logoutAction());
//     setConfirmOpen(false);
//     onClose();
//     navigate("/login");
//   }, [dispatch, logoutApi, navigate, onClose]);

//   const navItems = useMemo(
//     () => [
//       { label: "Settings", icon: <Settings size={18} />, path: "/settings" },
//       { label: "Wishlist", icon: <Heart size={18} />, path: "/wishlist" },
//       { label: "All Bookings", icon: <BookOpen size={18} />, path: "/bookings" },
//       ...(user?.role === "owner"
//         ? [{ label: "Chat", icon: <MessageCircle size={18} />, path: "/owner-chat", badge: unreadCount }]
//         : []),
//       { label: "Update Account", icon: <User size={18} />, path: "/update-account" },
//       { label: "Forgot Password", icon: <KeyRound size={18} />, path: "/forgot-password" },
//       { label: "Reset Password", icon: <KeyRound size={18} />, path: "/reset-password" },
//     ],
//     [user, unreadCount]
//   );

//   return (
//     <>
//       <ProfileDrawer isOpen={isOpen} onClose={onClose}>
//         <div className="sticky top-0 z-10 px-6 pt-10 pb-6 bg-white dark:bg-neutral-950 backdrop-blur-md">
//           <div className="absolute top-4 right-14">
//             <button
//               onClick={toggleTheme}
//               className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
//             >
//               {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//             </button>
//           </div>

//           <div className="flex flex-col items-center mt-6">
//             <img
//               src={user?.avatar || "/default-avatar.png"}
//               alt="avatar"
//               className="object-cover w-24 h-24 rounded-full shadow-md"
//             />
//             <h2 className="mt-4 text-lg font-semibold">{user?.fullName}</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {user?.email}
//             </p>

//             <select
//               className="px-3 py-1 mt-3 text-sm border rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
//               defaultValue="en"
//             >
//               <option value="en">English</option>
//               <option value="hi">Hindi</option>
//             </select>
//           </div>
//         </div>

//         <div className="px-4 py-6 space-y-2">
//           {navItems.map((item) => (
//             <ProfileNavButton
//               key={item.label}
//               icon={item.icon}
//               label={item.label}
//               badge={item.badge}
//               onClick={() => handleNavigate(item.path)}
//             />
//           ))}

//           <div className="pt-4 mt-4 border-t dark:border-neutral-800">
//             <ProfileNavButton
//               icon={<LogOut size={18} />}
//               label="Logout"
//               onClick={() => setConfirmOpen(true)}
//             />
//           </div>
//         </div>
//       </ProfileDrawer>

//       <LogoutConfirmModal
//         isOpen={confirmOpen}
//         onCancel={() => setConfirmOpen(false)}
//         onConfirm={handleLogout}
//       />
//     </>
//   );
// };

// export default React.memo(MyProfile);
