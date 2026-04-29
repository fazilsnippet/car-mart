// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, useNavigate } from "react-router-dom";
// import {
//   useGetUserProfileQuery,
//   useUpdateAccountDetailsMutation,
//   useChangePasswordMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
// } from "./userApi";
// import LogoutButton from "../auth/logout.jsx";
// import { useTheme } from "../../../utils/theme.jsx";

// import {

//   ArrowLeft,
//   Pencil,
//   Sun,
//   Moon,
// } from "lucide-react";


// const Input = ({ value, onChange, type = "text", placeholder }) => (
//   <input
//     type={type}
//     value={value || ""}
//     onChange={onChange}
//     placeholder={placeholder}
//     className="w-full p-3 border rounded-xl bg-card border-border text-foreground"
//   />
// );

// const Button = ({ children, loading, ...props }) => (
//   <button
//     {...props}
//     disabled={loading}
//     className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
//   >
//     {loading ? "..." : children}
//   </button>
// );

// /* ================== BOTTOM SHEET ================== */

// const BottomSheet = ({ open, onClose, title, children }) => {
//   return (
//     <div
//       className={`fixed inset-0 z-50 transition ${
//         open ? "visible" : "invisible"
//       }`}
//     >
//       <div
//         className={`absolute inset-0 bg-black/40 ${
//           open ? "opacity-100" : "opacity-0"
//         }`}
//         onClick={onClose}
//       />

//       <div
//         className={`absolute bottom-0 left-0 w-full bg-card rounded-t-2xl p-5 transition-transform duration-300 ${
//           open ? "translate-y-0" : "translate-y-full"
//         }`}
//       >
//         <div className="w-12 h-1.5 bg-muted mx-auto mb-4 rounded-full" />
//         <h2 className="mb-4 text-lg font-semibold">{title}</h2>
//         {children}
//       </div>
//     </div>
//   );
// };

// /* ================== PROFILE ================== */

// const ProfileInfo = ({ user, refetch }) => {
//   const [updateAccount, { isLoading }] = useUpdateAccountDetailsMutation();

//   const [form, setForm] = useState({ fullName: "" });
//   const [avatar, setAvatar] = useState(null);
//   const [preview, setPreview] = useState(null);

//   useEffect(() => {
//     if (user) setForm({ fullName: user.fullName || "" });
//   }, [user]);

//   const isChanged = form.fullName !== user?.fullName || avatar;

//   const handleUpdate = async () => {
//     if (!isChanged) return;
//     await updateAccount({ fullName: form.fullName, avatar }).unwrap();
//     setAvatar(null);
//     setPreview(null);
//     refetch();
//   };

//   return (
//     <div>
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <img
//             src={preview || user?.avatar?.url || "/default-avatar.png"}
//             className="object-cover w-24 h-24 border rounded-full border-border"
//           />
//           <label className="absolute p-1 rounded-full cursor-pointer bottom-1 right-1 bg-primary text-primary-foreground">
//             <Pencil className="w-4 h-4" />
//             <input
//               type="file"
//               hidden
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (!file) return;
//                 setAvatar(file);
//                 setPreview(URL.createObjectURL(file));
//               }}
//             />
//           </label>
//         </div>

//         <div className="flex-1">
//           <Input
//             value={form.fullName}
//             onChange={(e) =>
//               setForm({ ...form, fullName: e.target.value })
//             }
//             placeholder="Full Name"
//           />
//           <div className="mt-3">
//             <Button onClick={handleUpdate} loading={isLoading}>
//               Save
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================== PASSWORD ================== */

// const ChangePassword = () => {
//   const [changePassword, { isLoading }] = useChangePasswordMutation();
//   const [form, setForm] = useState({ oldPassword: "", newPassword: "" });

//   const handleSubmit = async () => {
//     await changePassword(form).unwrap();
//     setForm({ oldPassword: "", newPassword: "" });
//   };

//   return (
//     <div className="space-y-3">
//       <Input
//         type="password"
//         placeholder="Old Password"
//         value={form.oldPassword}
//         onChange={(e) =>
//           setForm({ ...form, oldPassword: e.target.value })
//         }
//       />
//       <Input
//         type="password"
//         placeholder="New Password"
//         value={form.newPassword}
//         onChange={(e) =>
//           setForm({ ...form, newPassword: e.target.value })
//         }
//       />
//       <Button onClick={handleSubmit} loading={isLoading}>
//         Update Password
//       </Button>
//     </div>
//   );
// };

// /* ================== FORGOT ================== */

// const ForgotPassword = () => {
//   const [forgotPassword] = useForgotPasswordMutation();
//   const [resetPassword] = useResetPasswordMutation();

//   const [step, setStep] = useState("email");
//   const [form, setForm] = useState({
//     email: "",
//     otp: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const sendOtp = async () => {
//     await forgotPassword({ email: form.email }).unwrap();
//     setStep("otp");
//   };

//   const reset = async () => {
//     await resetPassword({
//       email: form.email,
//       otp: form.otp,
//       newPassword: form.newPassword,
//     }).unwrap();
//     setStep("email");
//   };

//   return (
//     <div className="mt-4 space-y-3">
//       {step === "email" && (
//         <>
//           <Input
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />
//           <Button onClick={sendOtp}>Send OTP</Button>
//         </>
//       )}

//       {step === "otp" && (
//         <>
//           <Input
//             placeholder="OTP"
//             value={form.otp}
//             onChange={(e) =>
//               setForm({ ...form, otp: e.target.value })
//             }
//           />
//           <Button onClick={() => setStep("reset")}>Verify</Button>
//         </>
//       )}

//       {step === "reset" && (
//         <>
//           <Input
//             type="password"
//             placeholder="New Password"
//             value={form.newPassword}
//             onChange={(e) =>
//               setForm({ ...form, newPassword: e.target.value })
//             }
//           />
//           <Button onClick={reset}>Reset</Button>
//         </>
//       )}
//     </div>
//   );
// };

// /* ================== MAIN ================== */

// const MyProfile = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const { data, isLoading, isError, refetch } =
//     useGetUserProfileQuery();

//   const { theme, toggleTheme } = useTheme();

//   const [activeSheet, setActiveSheet] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   if (isLoading) return <p>Loading...</p>;
//   if (isError || !isAuthenticated)
//     return <Navigate to="/login" replace />;

//   const user = data?.data;

//   const menuItems = [
//     { label: "Edit Profile Information", action: "edit-profile" },
//     { label: "My Wishlist", action: "wishlist", mobileOnly: true },
//     { label: "My Bookings", action: "myBooking", mobileOnly: true },
//     { label: "Passwords", action: "passwords" },
//     { label: "Help & Supports", action: "help" },
//     { label: "Contact Us", action: "contact" },
//     { label: "About Us", action: "about" },
//   ];

//   const handleClick = (action) => {
//     if (action === "edit-profile" || action === "passwords") {
//       setActiveSheet(action);
//     } else {
//       navigate(`/${action}`);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 bg-background text-foreground">
//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <button onClick={() => window.history.back()}>
//           <ArrowLeft />
//         </button>

//         <button onClick={toggleTheme}>
//           {theme === "dark" ? <Sun /> : <Moon />}
//         </button>
//       </div>

//       {/* PROFILE CARD */}
//       <div className="p-6 mb-6 text-center shadow bg-card rounded-xl">
//         <img
//           src={user?.avatar?.url || "/default-avatar.png"}
//           className="w-24 h-24 mx-auto rounded-full"
//         />
//         <p className="mt-3">{user?.email}</p>
//         <p className="font-semibold">@{user?.userName}</p>
//       </div>

//       {/* MENU */}
//       <div className="space-y-3">
//         {menuItems
//           .filter((item) => (isMobile ? true : !item.mobileOnly))
//           .map((item) => (
//             <button
//               key={item.action}
//               onClick={() => handleClick(item.action)}
//               className="flex justify-between w-full p-4 shadow bg-card rounded-xl"
//             >
//               {item.label}
//               <span>›</span>
//             </button>
//           ))}
//       </div>

//       <LogoutButton />

//       {/* BOTTOM SHEETS */}
//       <BottomSheet
//         open={activeSheet === "edit-profile"}
//         onClose={() => setActiveSheet(null)}
//         title="Edit Profile"
//       >
//         <ProfileInfo user={user} refetch={refetch} />
//       </BottomSheet>

//       <BottomSheet
//         open={activeSheet === "passwords"}
//         onClose={() => setActiveSheet(null)}
//         title="Passwords"
//       >
//         <ChangePassword />
//         <ForgotPassword />
//       </BottomSheet>
//     </div>
//   );
// };

// export default MyProfile;


import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUpdateAccountDetailsMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./userApi";
import LogoutButton from "../auth/logout.jsx";
import { useTheme } from "../../../utils/theme.jsx";

import { ArrowLeft, Pencil, Sun, Moon } from "lucide-react";

/* ================== UI COMPONENTS ================== */

const Input = ({ value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  />
);

const Button = ({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
  >
    {loading ? "..." : children}
  </button>
);

/* ================== BOTTOM SHEET ================== */

const BottomSheet = ({ open, onClose, title, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-3xl p-6 shadow-xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 mx-auto mb-4 rounded-full" />
        <h2 className="mb-5 text-lg font-semibold text-gray-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

/* ================== PROFILE INFO ================== */

const ProfileInfo = ({ user, refetch }) => {
  const [updateAccount, { isLoading }] = useUpdateAccountDetailsMutation();

  const [form, setForm] = useState({ fullName: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || "" });
  }, [user]);

  const isChanged = form.fullName !== user?.fullName || avatar;

  const handleUpdate = async () => {
    if (!isChanged) return;
    await updateAccount({ fullName: form.fullName, avatar }).unwrap();
    setAvatar(null);
    setPreview(null);
    refetch();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={preview || user?.avatar?.url || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <label className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow">
            <Pencil className="w-4 h-4" />
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAvatar(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        <div className="flex-1">
          <Input
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            placeholder="Full Name"
          />
        </div>
      </div>

      <Button onClick={handleUpdate} loading={isLoading}>
        Save Changes
      </Button>
    </div>
  );
};

/* ================== PASSWORD ================== */

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });

  const handleSubmit = async () => {
    await changePassword(form).unwrap();
    setForm({ oldPassword: "", newPassword: "" });
  };

  return (
    <div className="space-y-3">
      <Input
        type="password"
        placeholder="Old Password"
        value={form.oldPassword}
        onChange={(e) =>
          setForm({ ...form, oldPassword: e.target.value })
        }
      />
      <Input
        type="password"
        placeholder="New Password"
        value={form.newPassword}
        onChange={(e) =>
          setForm({ ...form, newPassword: e.target.value })
        }
      />
      <Button onClick={handleSubmit} loading={isLoading}>
        Update Password
      </Button>
    </div>
  );
};

/* ================== MAIN ================== */

const MyProfile = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } =
    useGetUserProfileQuery();

  const { theme, toggleTheme } = useTheme();

  const [activeSheet, setActiveSheet] = useState(null);

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (isError || !isAuthenticated)
    return <Navigate to="/login" replace />;

  const user = data?.data;

  const menuItems = [
    { label: "Edit Profile", action: "edit-profile" },
    { label: "Passwords", action: "passwords" },
    { label: "My Wishlist", action: "wishlist" },
    { label: "My Bookings", action: "myBooking" },
    { label: "Help & Support", action: "help" },
    { label: "Contact Us", action: "contact" },
  ];

  const handleClick = (action) => {
    if (action === "edit-profile" || action === "passwords") {
      setActiveSheet(action);
    } else {
      navigate(`/${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 transition"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center mb-6">
          <img
            src={user?.avatar?.url || "/default-avatar.png"}
            className="w-24 h-24 mx-auto rounded-full object-cover mb-3 shadow-sm"
          />
          <h2 className="text-lg font-semibold text-gray-800">
            {user?.fullName}
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-indigo-600 text-sm mt-1">
            @{user?.userName}
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => handleClick(item.action)}
              className="w-full flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <span className="text-gray-700 font-medium">
                {item.label}
              </span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>

      {/* SHEETS */}
      <BottomSheet
        open={activeSheet === "edit-profile"}
        onClose={() => setActiveSheet(null)}
        title="Edit Profile"
      >
        <ProfileInfo user={user} refetch={refetch} />
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "passwords"}
        onClose={() => setActiveSheet(null)}
        title="Security"
      >
        <ChangePassword />
      </BottomSheet>
    </div>
  );
};

export default MyProfile;