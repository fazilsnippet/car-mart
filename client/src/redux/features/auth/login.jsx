// import { useState } from "react";
// import { useLoginUserMutation } from "./authApi";
// import { useDispatch } from "react-redux";
// import { setUser } from "./authSlice";
// import { useNavigate , Link} from "react-router-dom";
// import { z } from "zod";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [loginUser, { isLoading }] = useLoginUserMutation();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const result = loginSchema.safeParse(formData);

//     if (!result.success) {
//       const formattedErrors = {};
//       result.error.errors.forEach((err) => {
//         formattedErrors[err.path[0]] = err.message;
//       });
//       setErrors(formattedErrors);
//       return;
//     }

//     setErrors({});

//     try {
//       const response = await loginUser(formData).unwrap();
//       dispatch(setUser(response.user));
//       navigate("/");
//     } catch (err) {
//       setErrors({
//         server: err?.data?.message || "Login failed",
//       });
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground">
      
//       <div className="w-full max-w-md p-6 shadow-xl bg-card rounded-2xl">
        
//         {/* TITLE */}
//         <h2 className="mb-6 text-2xl font-semibold text-center">
//           Welcome Back 👋
//         </h2>

//         {/* FORM */}
//         <form onSubmit={handleLogin} className="space-y-4">
          
//           {/* EMAIL */}
//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//             )}
//           </div>

//           {/* SERVER ERROR */}
//           {errors.server && (
//             <p className="text-sm text-center text-red-500">
//               {errors.server}
//             </p>
//           )}

//           {/* BUTTON */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* FOOTER */}
//         <p className="mt-5 text-sm text-center text-gray-500">
//           Don't have an account?{" "}
//           <button
//             onClick={() => navigate("/register")}
//             className="w-full p-3 text-blue-600 rounded-lg hover:underline"
//           >
//             Register
//           </button>
//         </p>
//         <Link to="/forgot-password">
//   Forgot password?
// </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useLoginUserMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

// ==============================
// VALIDATION SCHEMA
// ==============================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

// ==============================
// LOGIN COMPONENT
// ==============================

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      server: "",
    }));
  };

  // ==============================
  // HANDLE LOGIN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ZOD VALIDATION
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};

      result.error.issues.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });

      setErrors(formattedErrors);
      return;
    }

    setErrors({});

    try {
      const response = await loginUser(formData).unwrap();

      // Save logged-in user in Redux
      dispatch(setUser(response.user));

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      setErrors({
        server:
          err?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden font-sans bg-slate-950">

      {/* ================= BACKGROUND ================= */}

      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/80 lg:via-slate-950/50 lg:to-slate-950/90" />
      </div>

      {/* ================= CONTENT ================= */}

      <div
        className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen gap-8 px-4 py-12 mx-auto  max-w-7xl sm:px-6 lg:px-8 lg:flex-row lg:justify-between lg:gap-12"
      >

        {/* ================= LEFT HERO ================= */}

        <div
          className="max-w-md pt-6 space-y-3 text-center text-white  lg:text-left lg:max-w-lg lg:pt-0"
        >
          <h1
            className="text-4xl font-extrabold tracking-tight  sm:text-5xl lg:text-6xl"
          >
            Welcome{" "}
            <span className="text-amber-400">
              Back
            </span>
          </h1>

          <p
            className="text-sm font-normal leading-relaxed  text-slate-300 sm:text-base lg:text-lg"
          >
            Sign in to continue your journey with premium cars,
            trusted by thousands of customers.
          </p>
        </div>

        {/* ================= LOGIN CARD ================= */}

        <div
          className="
            w-full
            max-w-md

            bg-[#0d1117]/90
            backdrop-blur-md

            border
            border-slate-800

            rounded-2xl

            p-6

            sm:p-8

            shadow-2xl
          "
        >

          {/* ================= LOGO ================= */}

          <div className="flex justify-center mb-4">
            <div
              className="
                w-12
                h-12

                rounded-full

                border
                border-slate-700

                bg-slate-900

                flex
                items-center
                justify-center

                p-0.5

                shadow-md
              "
            >
              {/* CUSTOM LOGO */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full rounded-full"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="#111"
                  stroke="#fff"
                  strokeWidth="3"
                />

                <path
                  d="M50 50 L50 2 A48 48 0 0 1 98 50 Z"
                  fill="#0066B1"
                />

                <path
                  d="M50 50 L2 50 A48 48 0 0 1 50 2 Z"
                  fill="#FFFFFF"
                />

                <path
                  d="M50 50 L50 98 A48 48 0 0 1 2 50 Z"
                  fill="#0066B1"
                />

                <path
                  d="M50 50 L98 50 A48 48 0 0 1 50 98 Z"
                  fill="#FFFFFF"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* ================= HEADER ================= */}

          <div className="mb-6 space-y-1 text-center">

            <h2
              className="text-xl font-bold tracking-wide text-white  sm:text-2xl"
            >
              Login to{" "}
              <span className="text-amber-400">
                Your Account
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400">
              Access your account and explore premium cars.
            </p>

          </div>

          {/* ================= LOGIN FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ================= EMAIL ================= */}

            <div className="space-y-1.5">

              <label className="block text-xs font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">

                <div
                  className="
                    absolute
                    inset-y-0
                    left-0
                    pl-3.5

                    flex
                    items-center

                    pointer-events-none
                    text-slate-400
                  "
                >
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={`
                    w-full
                    pl-10
                    pr-4
                    py-2.5

                    bg-[#161b22]

                    border
                    rounded-lg

                    text-sm
                    text-white

                    placeholder-slate-500

                    outline-none

                    transition-colors

                    ${
                      errors.email
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-700/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    }
                  `}
                />

              </div>

              {/* EMAIL ERROR */}

              {errors.email && (
                <p className="text-xs text-red-400">
                  {errors.email}
                </p>
              )}

            </div>

            {/* ================= PASSWORD ================= */}

            <div className="space-y-1.5">

              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>

              <div className="relative">

                <div
                  className="
                    absolute
                    inset-y-0
                    left-0
                    pl-3.5

                    flex
                    items-center

                    pointer-events-none
                    text-slate-400
                  "
                >
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`
                    w-full
                    pl-10
                    pr-10
                    py-2.5

                    bg-[#161b22]

                    border
                    rounded-lg

                    text-sm
                    text-white

                    placeholder-slate-500

                    outline-none

                    transition-colors

                    ${
                      errors.password
                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-700/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    }
                  `}
                />

                {/* PASSWORD VISIBILITY */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    inset-y-0
                    right-0
                    pr-3.5

                    flex
                    items-center

                    text-slate-400

                    hover:text-slate-200
                    transition-colors
                  "
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

              {/* PASSWORD ERROR */}

              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password}
                </p>
              )}

            </div>

            {/* ================= FORGOT PASSWORD ================= */}

            <div className="flex justify-end pt-0.5">

              <Link
                to="/forgot-password"
                className="text-xs transition-colors  text-amber-400 hover:text-amber-300"
              >
                Forgot Password?
              </Link>

            </div>

            {/* ================= SERVER ERROR ================= */}

            {errors.server && (
              <div
                className="
                  px-3
                  py-2.5

                  border
                  border-red-500/30

                  bg-red-500/10

                  rounded-lg
                "
              >
                <p className="text-xs text-center text-red-400">
                  {errors.server}
                </p>
              </div>
            )}

            {/* ================= SUBMIT BUTTON ================= */}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                py-2.5
                px-4

                bg-gradient-to-r
                from-amber-400
                to-amber-500

                hover:from-amber-500
                hover:to-amber-600

                text-slate-950
                font-semibold

                rounded-lg

                shadow-md
                hover:shadow-amber-500/20

                flex
                items-center
                justify-center
                space-x-2

                transition-all
                transform

                active:scale-[0.99]

                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:active:scale-100
              "
            >
              {isLoading ? (
                <>
                  <span>Logging in...</span>

                  <div
                    className="w-4 h-4 border-2 rounded-full  border-slate-900/30 border-t-slate-900 animate-spin"
                  />
                </>
              ) : (
                <>
                  <span>Login</span>

                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

          </form>

          {/* ================= DIVIDER ================= */}

          <div className="relative flex items-center justify-center my-6">

            <div className="w-full border-t border-slate-800" />

            <span
              className="
                absolute

                bg-[#0d1117]

                px-3

                text-[10px]
                font-medium
                tracking-widest

                text-slate-500

                uppercase
              "
            >
              OR
            </span>

          </div>

          {/* ================= REGISTER ================= */}

          <p className="text-xs text-center text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium transition-colors  text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>
      </div>
    </div>
  );
}