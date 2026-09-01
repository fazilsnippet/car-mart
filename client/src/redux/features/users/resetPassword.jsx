// import { useState } from "react";
// import { useResetPasswordMutation } from "./userApi";

// const ResetPassword = () => {
//   const [form, setForm] = useState({
//     email: "",
//     otp: "",
//     newPassword: "",
//   });

//   const [resetPassword, { isLoading }] = useResetPasswordMutation();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await resetPassword(form).unwrap();
//       alert(res.message);
//     } catch (err) {
//       alert(err?.data?.message || "Reset failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         name="email"
//         placeholder="Email"
//         onChange={handleChange}
//       />
//       <input
//         name="otp"
//         placeholder="OTP"
//         onChange={handleChange}
//       />
//       <input
//         name="newPassword"
//         type="password"
//         placeholder="New Password"
//         onChange={handleChange}
//       />
//       <button disabled={isLoading}>
//         {isLoading ? "Resetting..." : "Reset Password"}
//       </button>
//     </form>
//   );
// };

// export default ResetPassword;


import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useResetPasswordMutation } from "./userApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Email passed from ForgotPassword page
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword({
        email,
        otp,
        newPassword,
      }).unwrap();

      console.log(response);

      // Password successfully changed
      navigate("/login");

    } catch (error) {
      console.error(error);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center">
          <p className="mb-4 text-zinc-400">
            Invalid password reset session.
          </p>

          <Link
            to="/forgot-password"
            className="text-amber-400 hover:text-amber-300"
          >
            Request a new OTP
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-zinc-950">

      <div className="w-full max-w-md">

        <div className="p-8 border shadow-2xl bg-zinc-900 border-zinc-800 rounded-2xl">

          {/* Header */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-semibold text-white">
              Reset Password
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Enter the OTP sent to
            </p>

            <p className="mt-1 text-sm text-amber-400">
              {email}
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* OTP */}
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-300">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter 6-digit OTP"
                className="
                  w-full
                  bg-zinc-950
                  border border-zinc-700
                  rounded-xl
                  px-4 py-3
                  text-white
                  text-center
                  tracking-[0.5em]
                  placeholder:text-zinc-600
                  placeholder:tracking-normal
                  outline-none
                  focus:border-amber-500
                  focus:ring-1
                  focus:ring-amber-500
                "
                required
              />
            </div>

            {/* New password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-300">
                New password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 text-white border outline-none  bg-zinc-950 border-zinc-700 rounded-xl placeholder:text-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-zinc-300">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 text-white border outline-none  bg-zinc-950 border-zinc-700 rounded-xl placeholder:text-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold transition  bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 rounded-xl"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm transition text-zinc-400 hover:text-amber-400"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;