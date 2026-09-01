// import { useState } from "react";
// import { useForgotPasswordMutation } from "./userApi";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await forgotPassword(email).unwrap();
//       alert(res.message);
//     } catch (err) {
//       alert(err?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button disabled={isLoading}>
//         {isLoading ? "Sending..." : "Send OTP"}
//       </button>
//     </form>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "./userApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email).unwrap();

      // OTP was sent
      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-zinc-950">
      <div className="w-full max-w-md">

        <div className="p-8 border shadow-2xl bg-zinc-900 border-zinc-800 rounded-2xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-white">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Enter your email address and we'll send you an OTP
              to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 text-white transition border outline-none  bg-zinc-950 border-zinc-700 rounded-xl placeholder:text-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold transition  rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm transition  text-zinc-400 hover:text-amber-400"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
