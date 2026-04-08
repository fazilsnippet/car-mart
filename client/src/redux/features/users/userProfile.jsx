import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUpdateAccountDetailsMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./userApi";
import LogoutButton from "../auth/logout";

import {
  User,
  Lock,
  HelpCircle,
  ArrowLeft,
  Sun,
  Moon,
  Pencil,
} from "lucide-react";

/* ================== SHARED UI ================== */

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

/* ================== PROFILE INFO ================== */

const ProfileInfo = ({ user, refetch }) => {
  const [updateAccount, { isLoading }] = useUpdateAccountDetailsMutation();

  const [form, setForm] = useState({ fullName: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || "" });
  }, [user]);

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const isChanged = form.fullName !== user?.fullName || avatar;

  const handleUpdate = async () => {
    if (!isChanged) return;

    await updateAccount({ fullName: form.fullName, avatar }).unwrap();
    setAvatar(null);
    setPreview(null);
    refetch();
  };

  return (
    <div className="bg-card rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" /> Profile
      </h2>

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
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================== CHANGE PASSWORD ================== */

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });

  const handleSubmit = async () => {
    await changePassword(form).unwrap();
    setForm({ oldPassword: "", newPassword: "" });
  };

  return (
    <div className="bg-card rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5" /> Change Password
      </h2>

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
      </div>

      <div className="mt-4">
        <Button onClick={handleSubmit} loading={isLoading}>
          Update Password
        </Button>
      </div>
    </div>
  );
};

/* ================== FORGOT PASSWORD ================== */

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [step, setStep] = useState("email");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const sendOtp = async () => {
    if (!form.email) return setError("Email required");
    await forgotPassword({ email: form.email }).unwrap();
    setStep("otp");
  };

  const reset = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return setError("Passwords mismatch");
    }

    await resetPassword({
      email: form.email,
      otp: form.otp,
      newPassword: form.newPassword,
    }).unwrap();

    setStep("email");
  };

  return (
    <div className="bg-card rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5" /> Forgot Password
      </h2>

      <div className="space-y-3">
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
            <Input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <Button onClick={reset}>Reset</Button>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
};

/* ================== MAIN ================== */

const MyProfile = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError, refetch } =
    useGetUserProfileQuery();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !isAuthenticated)
    return <Navigate to="/login" replace />;

  const user = data?.data;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors py-8 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between">
        <button
          onClick={() => window.history.back()}
          className="bg-card p-2 rounded-full shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="bg-card p-2 rounded-full shadow"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <ProfileInfo user={user} refetch={refetch} />
        <ChangePassword />
        <ForgotPassword />
        <LogoutButton />
      </div>

      {/* THEME SYSTEM */}
      <style jsx global>{`
        :root {
          --background: #ffffff;
          --foreground: #111827;
          --card: #ffffff;
          --muted: #f3f4f6;
          --muted-foreground: #6b7280;
          --primary: #111827;
          --primary-foreground: #ffffff;
          --destructive: #dc2626;
          --border: rgba(0, 0, 0, 0.1);
        }

        .dark {
          --background: #0f172a;
          --foreground: #f9fafb;
          --card: #1e293b;
          --muted: #334155;
          --muted-foreground: #94a3b8;
          --primary: #f9fafb;
          --primary-foreground: #0f172a;
          --destructive: #ef4444;
          --border: #334155;
        }

        .bg-background { background: var(--background); }
        .text-foreground { color: var(--foreground); }
        .bg-card { background: var(--card); }
        .text-muted-foreground { color: var(--muted-foreground); }
        .bg-muted { background: var(--muted); }
        .bg-primary { background: var(--primary); }
        .text-primary-foreground { color: var(--primary-foreground); }
        .text-destructive { color: var(--destructive); }
        .border-border { border-color: var(--border); }
      `}</style>
    </div>
  );
};

export default MyProfile;