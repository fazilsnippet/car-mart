// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   useGetUserProfileQuery,
//   useUpdateAccountDetailsMutation,
//   useChangePasswordMutation,
//   useGetRecentlyViewedCarsQuery,
//     useForgotPasswordMutation,
//   useResetPasswordMutation,
// } from "./userApi";
// import LogoutButton from "../auth/logout";
// import Loader from "../ui/loader";

// const MyProfile = () => {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   // const { data, isLoading, refetch } = useGetUserProfileQuery();
//   const { data: recentCars } = useGetRecentlyViewedCarsQuery(undefined, { skip: !isAuthenticated });

//   const [updateAccount, { isLoading: updatingAccount }] =
//     useUpdateAccountDetailsMutation();
// const { data, isLoading } = useGetUserProfileQuery();
//   const [changePassword, { isLoading: updatingPassword }] =
//     useChangePasswordMutation();

//   const [forgotPassword, { isLoading: sendingOtp }] =
//     useForgotPasswordMutation();

//   const [resetPassword, { isLoading: resettingPassword }] =
//     useResetPasswordMutation();

//   const user = data?.data;

//   const [accountForm, setAccountForm] = useState({
//     fullName: "",
//     email: "",
//   });

//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//   });

//   const [forgotForm, setForgotForm] = useState({
//     email: "",
//     otp: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [step, setStep] = useState("email"); 
//   // "email" → "otp" → "reset"

//   const [error, setError] = useState("");

//   const [avatar, setAvatar] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [showForgot, setShowForgot] = useState(false);

//   // Initialize form when user loads
//   useEffect(() => {
//     if (user) {
//       setAccountForm({
//         fullName: user.fullName || "",
//         email: user.email || "",
//       });

//       setForgotForm((prev) => ({
//         ...prev,
//         email: user.email || "",
//       }));
//     }
//   }, [user]);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     setAvatar(file);
//     if (file) setPreview(URL.createObjectURL(file));
//   };

//   const handleAccountUpdate = async () => {
//     try {
//       await updateAccount({
//         fullName: accountForm.fullName,
//         email: accountForm.email,
//         avatar,
//       }).unwrap();

//       refetch();
//       alert("Profile updated successfully");
//     } catch (err) {
//       alert(err?.data?.message || "Update failed");
//     }
//   };

//   const handlePasswordUpdate = async () => {
//     try {
//       await changePassword(passwordForm).unwrap();
//       setPasswordForm({ oldPassword: "", newPassword: "" });
//       alert("Password updated successfully");
//     } catch (err) {
//       alert(err?.data?.message || "Password update failed");
//     }
//   };

//   const handleSendOtp = async () => {
//     if (!forgotForm.email) {
//       setError("Email is required");
//       return;
//     }

//     setError("");
//     try {
//       await forgotPassword(forgotForm.email).unwrap();
//       setStep("otp");
//     } catch (err) {
//       setError(err?.data?.message || "Failed to send OTP");
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!forgotForm.otp || !forgotForm.newPassword || !forgotForm.confirmPassword) {
//       setError("All fields are required");
//       return;
//     }

//     if (forgotForm.newPassword !== forgotForm.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setError("");
//     try {
//       await resetPassword({
//         email: forgotForm.email,
//         otp: forgotForm.otp,
//         newPassword: forgotForm.newPassword,
//       }).unwrap();
//       alert("Password reset successful");
//       setShowForgot(false);
//       setStep("email");
//       setForgotForm({
//         email: user?.email || "",
//         otp: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError(err?.data?.message || "Reset failed");
//     }
//   };

// if (isLoading) return  <div className="flex items-center justify-center h-screen">
//       <Loader />
//     </div>;

// // if (!data) return <Navigate to="/login" />;

//   return (
//     <div className="min-h-screen p-6 text-white bg-slate-900">
//       <div className="max-w-6xl mx-auto space-y-10">

//         {/* PROFILE CARD */}
//         <div className="flex flex-col items-center gap-8 p-8 shadow-xl bg-slate-800 rounded-2xl md:flex-row">
//           <img
//             src={preview || user?.profilePicture}
//             alt="avatar"
//             className="object-cover border-4 rounded-full w-28 h-28 border-emerald-500"
//           />

//           <div className="flex-1 w-full space-y-4">
//             <h2 className="text-2xl font-bold">My Profile</h2>

//             <div className="grid gap-4 md:grid-cols-2">
//               <input
//                 type="text"
//                 value={accountForm.fullName}
//                 onChange={(e) =>
//                   setAccountForm({ ...accountForm, fullName: e.target.value })
//                 }
//                 className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                 placeholder="Full Name"
//               />

//               <input
//                 type="email"
//                 value={accountForm.email}
//                 onChange={(e) =>
//                   setAccountForm({ ...accountForm, email: e.target.value })
//                 }
//                 className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                 placeholder="Email"
//               />
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="px-4 py-2 rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600">
//                 Change Avatar
//                 <input type="file" hidden onChange={handleAvatarChange} />
//               </label>

//               <button
//                 onClick={handleAccountUpdate}
//                 disabled={updatingAccount}
//                 className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
//               >
//                 {updatingAccount ? "Updating..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* CHANGE PASSWORD */}
//         <div className="p-8 space-y-6 shadow-xl bg-slate-800 rounded-2xl">
//           <h3 className="text-xl font-semibold">Change Password</h3>

//           <div className="grid gap-4 md:grid-cols-2">
//             <input
//               type="password"
//               placeholder="Old Password"
//               value={passwordForm.oldPassword}
//               onChange={(e) =>
//                 setPasswordForm({
//                   ...passwordForm,
//                   oldPassword: e.target.value,
//                 })
//               }
//               className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               value={passwordForm.newPassword}
//               onChange={(e) =>
//                 setPasswordForm({
//                   ...passwordForm,
//                   newPassword: e.target.value,
//                 })
//               }
//               className="p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           <button
//             onClick={handlePasswordUpdate}
//             disabled={updatingPassword}
//             className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
//           >
//             {updatingPassword ? "Updating..." : "Update Password"}
//           </button>

//           <div className="mt-4">
//             <LogoutButton />
//           </div>

//           {/* FORGOT PASSWORD SECTION */}
//           <p
//             className="mt-4 text-sm cursor-pointer text-emerald-400 hover:underline"
//             onClick={() => {
//               setShowForgot((prev) => !prev);
//               setStep("email");
//               setError("");
//             }}
//           >
//             Forgot password?
//           </p>

//           {showForgot && (
//             <div className="pt-6 mt-6 space-y-4 border-t border-slate-600">
//               <h4 className="font-semibold">Reset via OTP</h4>

//               {/* STEP 1 — EMAIL */}
//               {step === "email" && (
//                 <>
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={forgotForm.email}
//                     onChange={(e) =>
//                       setForgotForm({ ...forgotForm, email: e.target.value })
//                     }
//                     className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                   />

//                   <button
//                     onClick={handleSendOtp}
//                     disabled={sendingOtp}
//                     className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
//                   >
//                     {sendingOtp ? "Sending..." : "Confirm & Send OTP"}
//                   </button>
//                 </>
//               )}

//               {/* STEP 2 — OTP */}
//               {step === "otp" && (
//                 <>
//                   <input
//                     type="text"
//                     placeholder="Enter OTP"
//                     value={forgotForm.otp}
//                     onChange={(e) =>
//                       setForgotForm({ ...forgotForm, otp: e.target.value })
//                     }
//                     className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                   />

//                   <button
//                     onClick={() => {
//                       if (!forgotForm.otp) {
//                         setError("OTP is required");
//                         return;
//                       }
//                       setError("");
//                       setStep("reset");
//                     }}
//                     className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700"
//                   >
//                     Verify OTP
//                   </button>
//                 </>
//               )}

//               {/* STEP 3 — NEW PASSWORD (ONLY AFTER OTP VERIFIED) */}
//               {step === "reset" && (
//                 <>
//                   <input
//                     type="password"
//                     placeholder="New Password"
//                     value={forgotForm.newPassword}
//                     onChange={(e) =>
//                       setForgotForm({
//                         ...forgotForm,
//                         newPassword: e.target.value,
//                       })
//                     }
//                     className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                   />

//                   <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={forgotForm.confirmPassword}
//                     onChange={(e) =>
//                       setForgotForm({
//                         ...forgotForm,
//                         confirmPassword: e.target.value,
//                       })
//                     }
//                     className="w-full p-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-emerald-500"
//                   />

//                   <button
//                     onClick={handleResetPassword}
//                     disabled={resettingPassword}
//                     className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
//                   >
//                     {resettingPassword ? "Resetting..." : "Reset Password"}
//                   </button>
//                 </>
//               )}

//               {error && (
//                 <p className="text-sm text-red-400">{error}</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

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

const MyProfile = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

const { data, isLoading, isError } = useGetUserProfileQuery(undefined, {
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
});

  const user = data?.data;

  // 🔥 ONLY run after user is known
  const { data: recentCars } = useGetRecentlyViewedCarsQuery(undefined, {
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
  const [error, setError] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showForgot, setShowForgot] = useState(false);

  // ✅ Initialize form safely
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

  // Avatar preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Update profile
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

  // Change password
  const handlePasswordUpdate = async () => {
    try {
      await changePassword(passwordForm).unwrap();
      setPasswordForm({ oldPassword: "", newPassword: "" });
      alert("Password updated successfully");
    } catch (err) {
      alert(err?.data?.message || "Password update failed");
    }
  };

  // Send OTP
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

  // Reset password
  const handleResetPassword = async () => {
    if (
      !forgotForm.otp ||
      !forgotForm.newPassword ||
      !forgotForm.confirmPassword
    ) {
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

  // 🔥 CORRECT AUTH HANDLING

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
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

          <div className="mt-4">
            <LogoutButton />
          </div>

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
      </div>
    </div>
  );
};

export default MyProfile;