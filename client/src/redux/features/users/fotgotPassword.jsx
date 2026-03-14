import { useState } from "react";
import { useForgotPasswordMutation } from "./userApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email).unwrap();
      alert(res.message);
    } catch (err) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export default ForgotPassword;