import { useState } from "react";
import { useResetPasswordMutation } from "./userApi";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(form).unwrap();
      alert(res.message);
    } catch (err) {
      alert(err?.data?.message || "Reset failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="otp"
        placeholder="OTP"
        onChange={handleChange}
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New Password"
        onChange={handleChange}
      />
      <button disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;