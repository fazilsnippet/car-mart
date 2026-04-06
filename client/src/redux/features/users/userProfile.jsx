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

/* ================== SHARED UI ================== */

const Input = ({ value, onChange, type = "text", placeholder }) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 border rounded-xl"
  />
);

const Button = ({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className="px-4 py-2 text-white bg-indigo-600 rounded-xl disabled:opacity-50"
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
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold">Profile</h2>

      <div className="flex gap-4 mt-4">
        <img
          src={preview || user?.avatar?.url}
          className="object-cover w-20 h-20 rounded-full"
        />

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      <div className="mt-4">
        <Input
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
          placeholder="Full Name"
        />
      </div>

      <Button onClick={handleUpdate} loading={isLoading}>
        Save
      </Button>
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
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold">Change Password</h2>

      <div className="mt-4 space-y-2">
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

      <Button onClick={handleSubmit} loading={isLoading}>
        Update Password
      </Button>
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
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold">Forgot Password</h2>

      {step === "email" && (
        <>
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Button onClick={sendOtp}>Send OTP</Button>
        </>
      )}

      {step === "otp" && (
        <>
          <Input
            placeholder="OTP"
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
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

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

/* ================== MAIN ================== */

const MyProfile = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError, refetch } =
    useGetUserProfileQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !isAuthenticated)
    return <Navigate to="/login" replace />;

  const user = data?.data;

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6">
      <ProfileInfo user={user} refetch={refetch} />
      <ChangePassword />
      <ForgotPassword />
    </div>
  );
};

export default MyProfile;