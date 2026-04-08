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

import {
  User,
  Heart,
  Calendar,
  Lock,
  HelpCircle,
  MessageCircle,
  Info,
  ArrowLeft,
  Pencil,
  Sun,
  Moon,
} from "lucide-react";

/* ================== SHARED ================== */

const Input = ({ value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 rounded-xl bg-card border border-border text-foreground"
  />
);

const Button = ({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
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
        className={`absolute inset-0 bg-black/40 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 left-0 w-full bg-card rounded-t-2xl p-5 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-12 h-1.5 bg-muted mx-auto mb-4 rounded-full" />
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

/* ================== PROFILE ================== */

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
    <div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={preview || user?.avatar?.url || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border border-border"
          />
          <label className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer">
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
          <div className="mt-3">
            <Button onClick={handleUpdate} loading={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </div>
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

/* ================== FORGOT ================== */

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [step, setStep] = useState("email");
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const sendOtp = async () => {
    await forgotPassword({ email: form.email }).unwrap();
    setStep("otp");
  };

  const reset = async () => {
    await resetPassword({
      email: form.email,
      otp: form.otp,
      newPassword: form.newPassword,
    }).unwrap();
    setStep("email");
  };

  return (
    <div className="space-y-3 mt-4">
      {step === "email" && (
        <>
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <Button onClick={sendOtp}>Send OTP</Button>
        </>
      )}

      {step === "otp" && (
        <>
          <Input
            placeholder="OTP"
            value={form.otp}
            onChange={(e) =>
              setForm({ ...form, otp: e.target.value })
            }
          />
          <Button onClick={() => setStep("reset")}>Verify</Button>
        </>
      )}

      {step === "reset" && (
        <>
          <Input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />
          <Button onClick={reset}>Reset</Button>
        </>
      )}
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !isAuthenticated)
    return <Navigate to="/login" replace />;

  const user = data?.data;

  const menuItems = [
    { label: "Edit Profile Information", action: "edit-profile" },
    { label: "My Wishlist", action: "wishlist", mobileOnly: true },
    { label: "My Bookings", action: "myBooking", mobileOnly: true },
    { label: "Passwords", action: "passwords" },
    { label: "Help & Supports", action: "help" },
    { label: "Contact Us", action: "contact" },
    { label: "About Us", action: "about" },
  ];

  const handleClick = (action) => {
    if (action === "edit-profile" || action === "passwords") {
      setActiveSheet(action);
    } else {
      navigate(`/${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <button onClick={() => window.history.back()}>
          <ArrowLeft />
        </button>

        <button onClick={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-card p-6 rounded-xl shadow mb-6 text-center">
        <img
          src={user?.avatar?.url || "/default-avatar.png"}
          className="w-24 h-24 mx-auto rounded-full"
        />
        <p className="mt-3">{user?.email}</p>
        <p className="font-semibold">@{user?.userName}</p>
      </div>

      {/* MENU */}
      <div className="space-y-3">
        {menuItems
          .filter((item) => (isMobile ? true : !item.mobileOnly))
          .map((item) => (
            <button
              key={item.action}
              onClick={() => handleClick(item.action)}
              className="w-full bg-card p-4 rounded-xl shadow flex justify-between"
            >
              {item.label}
              <span>›</span>
            </button>
          ))}
      </div>

      <LogoutButton />

      {/* BOTTOM SHEETS */}
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
        title="Passwords"
      >
        <ChangePassword />
        <ForgotPassword />
      </BottomSheet>
    </div>
  );
};

export default MyProfile;