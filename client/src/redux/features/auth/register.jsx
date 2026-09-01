


import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import {
  useSendSignupOtpMutation,
  useRegisterUserMutation,
} from "./authApi";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";

// ==============================
// VALIDATION SCHEMAS
// ==============================

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  userName: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),

  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits"),
});

// ==============================
// SIGNUP COMPONENT
// ==============================

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==============================
  // STATES
  // ==============================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [otpTimer, setOtpTimer] = useState(0);

  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState({});

  const [otpSent, setOtpSent] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);

  // ==============================
  // API MUTATIONS
  // ==============================

  const [sendOtp] = useSendSignupOtpMutation();

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  // ==============================
  // OTP TIMER
  // ==============================

  useEffect(() => {
    if (otpTimer <= 0) return;

    const timer = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimer]);

  // ==============================
  // PASSWORD STRENGTH
  // ==============================

  const getPasswordStrength = () => {
    const pwd = form.password;

    let score = 0;

    if (pwd.length >= 8) score++;

    if (/[A-Z]/.test(pwd)) score++;

    if (/[0-9]/.test(pwd)) score++;

    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return score;
  };

  const strength = getPasswordStrength();

  const strengthColor = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ][strength - 1] || "bg-slate-700";

  const strengthText = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ][strength];

  // ==============================
  // HANDLE FORM CHANGE
  // ==============================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      server: "",
    }));
  };

  // ==============================
  // SEND OTP
  // ==============================

  const handleSendOtp = async () => {
    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      setErrors({
        email: result.error.issues[0].message,
      });

      return;
    }

    try {
      setSendingOtp(true);

      setErrors({});

      await sendOtp({ email }).unwrap();

      setOtpTimer(60);

      setStep(2);

      setOtpSent(true);
    } catch (err) {
      setErrors({
        email:
          err?.data?.message ||
          "Failed to send OTP. Please try again.",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // ==============================
  // CHANGE EMAIL
  // ==============================

  const handleChangeEmail = () => {
    setStep(1);
    setOtpSent(false);
    setOtpTimer(0);

    setErrors({});
  };

  // ==============================
  // REGISTER USER
  // ==============================

  const handleRegister = async (e) => {
    e?.preventDefault();

    const result = registerSchema.safeParse(form);

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
      const response = await registerUser({
        ...form,
        email,
      }).unwrap();

      dispatch(setUser(response.user));

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setErrors({
        server:
          err?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  // ==============================
  // SUCCESS SCREEN
  // ==============================

  if (success) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-950">

        {/* BACKGROUND */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2000&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
        </div>

        {/* SUCCESS CARD */}
        <div className="relative z-10 w-full max-w-sm p-8 mx-4 text-center border shadow-2xl bg-[#0d1117]/95 border-slate-800 rounded-2xl">

          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-16 h-16 border rounded-full bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="text-green-400 w-9 h-9" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">
            Welcome to{" "}
            <span className="text-amber-400">
              Wish Wheels
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Your account has been created successfully.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
            <div className="w-3 h-3 border-2 rounded-full border-amber-400/30 border-t-amber-400 animate-spin" />
            Redirecting you to your journey...
          </div>

        </div>
      </div>
    );
  }

  // ==============================
  // MAIN UI
  // ==============================

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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/60 lg:to-slate-950/90" />
      </div>

      {/* ================= CONTENT ================= */}

      <div
        className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen gap-8 px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:flex-row lg:justify-between lg:gap-16"
      >

        {/* ================= LEFT HERO ================= */}

        <div
          className="max-w-md pt-4 space-y-4 text-center text-white lg:text-left lg:max-w-lg lg:pt-0"
        >

          <div className="inline-flex items-center px-3 py-1 text-xs font-medium border rounded-full bg-amber-400/10 border-amber-400/20 text-amber-400">
            JOIN THE JOURNEY
          </div>

          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Find Your Next{" "}
            <span className="text-amber-400">
              Drive
            </span>
          </h1>

          <p
            className="max-w-md text-sm font-normal leading-relaxed text-slate-300 sm:text-base lg:text-lg"
          >
            Create your account and unlock a smarter way to
            discover, explore, and connect with premium cars.
          </p>

          {/* BENEFITS */}

          <div className="hidden pt-4 space-y-3 lg:block">

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Save your favorite vehicles
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Get personalized recommendations
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Book test drives instantly
            </div>

          </div>

        </div>

        {/* ================= SIGNUP CARD ================= */}

        <div
          className="
            w-full
            max-w-md

            bg-[#0d1117]/95
            backdrop-blur-xl

            border
            border-slate-800

            rounded-2xl

            p-6

            sm:p-8

            shadow-2xl
          "
        >

          {/* ================= HEADER ================= */}

          <div className="mb-6 text-center">

            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 border rounded-full bg-slate-900 border-slate-700">
              <User className="w-5 h-5 text-amber-400" />
            </div>

            <h2 className="text-xl font-bold tracking-wide text-white sm:text-2xl">

              Create Your{" "}

              <span className="text-amber-400">
                Account
              </span>

            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-400">

              {step === 1
                ? "Start by verifying your email address."
                : "Complete your details to join Wish Wheels."}

            </p>

          </div>

          {/* ================= PROGRESS ================= */}

          <div className="flex gap-2 mb-7">

            <div
              className={`
                h-1.5
                flex-1
                rounded-full
                transition-all
                duration-500

                ${
                  step >= 1
                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                    : "bg-slate-800"
                }
              `}
            />

            <div
              className={`
                h-1.5
                flex-1
                rounded-full
                transition-all
                duration-500

                ${
                  step >= 2
                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                    : "bg-slate-800"
                }
              `}
            />

          </div>

          {/* ================= STEP 1 ================= */}

          {step === 1 && (

            <div className="space-y-5">

              {/* EMAIL */}

              <div className="space-y-1.5">

                <label className="block text-xs font-medium text-slate-300">
                  Email Address
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }}
                    disabled={sendingOtp}
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

                {errors.email && (
                  <p className="text-xs text-red-400">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* SEND OTP */}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
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

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition-all

                  active:scale-[0.99]

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {sendingOtp ? (

                  <>
                    <div className="w-4 h-4 border-2 rounded-full border-slate-900/30 border-t-slate-900 animate-spin" />
                    Sending OTP...
                  </>

                ) : (

                  <>
                    Send Verification Code
                    <ArrowRight className="w-4 h-4" />
                  </>

                )}

              </button>

              {/* LOGIN */}

              <p className="pt-2 text-xs text-center text-slate-400">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-medium transition-colors text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>
          )}

          {/* ================= STEP 2 ================= */}

          {step === 2 && (

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* CHANGE EMAIL */}

              <button
                type="button"
                onClick={handleChangeEmail}
                className="
                  flex
                  items-center
                  gap-1.5

                  text-xs
                  text-slate-400

                  hover:text-amber-400
                  transition-colors
                "
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change email address
              </button>

              {/* READ ONLY EMAIL */}

              <div className="relative">

                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  value={email}
                  readOnly
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5

                    bg-slate-900/60
                    border
                    border-slate-800

                    rounded-lg

                    text-sm
                    text-slate-400

                    cursor-not-allowed
                  "
                />

              </div>

              {/* FULL NAME */}

              <FormField
                icon={<User className="w-4 h-4" />}
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleFormChange}
                error={errors.fullName}
              />

              {/* USERNAME */}

              <FormField
                icon={<User className="w-4 h-4" />}
                label="Username"
                name="userName"
                placeholder="Choose a username"
                value={form.userName}
                onChange={handleFormChange}
                error={errors.userName}
              />

              {/* PHONE */}

              <FormField
                icon={<Phone className="w-4 h-4" />}
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={handleFormChange}
                error={errors.phone}
                numericOnly
                maxLength={10}
              />

              {/* PASSWORD */}

              <div className="space-y-1.5">

                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleFormChange}
                    autoComplete="new-password"
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

                      ${
                        errors.password
                          ? "border-red-500"
                          : "border-slate-700/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      inset-y-0
                      right-0

                      flex
                      items-center

                      pr-3.5

                      text-slate-400
                      hover:text-white
                    "
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

                {/* PASSWORD STRENGTH */}

                <div className="pt-1">

                  <div className="flex justify-between mb-1.5">

                    <span className="text-[10px] text-slate-500">
                      Password strength
                    </span>

                    {strength > 0 && (
                      <span className="text-[10px] text-slate-400">
                        {strengthText}
                      </span>
                    )}

                  </div>

                  <div className="flex gap-1">

                    {[1, 2, 3, 4].map((level) => (

                      <div
                        key={level}
                        className={`
                          h-1
                          flex-1
                          rounded-full
                          transition-all

                          ${
                            strength >= level
                              ? strengthColor
                              : "bg-slate-800"
                          }
                        `}
                      />

                    ))}

                  </div>

                </div>

              </div>

              {/* OTP */}

              <FormField
                icon={<KeyRound className="w-4 h-4" />}
                label="Verification Code"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={form.otp}
                onChange={handleFormChange}
                error={errors.otp}
                maxLength={6}
                numericOnly
              />

              {/* OTP TIMER */}

              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Didn't receive the code?
                </span>

                {otpTimer > 0 ? (

                  <span className="text-xs text-slate-400">
                    Resend in {otpTimer}s
                  </span>

                ) : (

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Resend OTP
                  </button>

                )}

              </div>

              {/* SERVER ERROR */}

              {errors.server && (

                <div className="px-3 py-2.5 border rounded-lg bg-red-500/10 border-red-500/30">

                  <p className="text-xs text-center text-red-400">
                    {errors.server}
                  </p>

                </div>

              )}

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={isRegistering}
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

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition-all

                  active:scale-[0.99]

                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {isRegistering ? (

                  <>
                    <div className="w-4 h-4 border-2 rounded-full border-slate-900/30 border-t-slate-900 animate-spin" />
                    Creating Account...
                  </>

                ) : (

                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>

                )}

              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}


// ==============================
// REUSABLE FORM FIELD
// ==============================

function FormField({
  icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  numericOnly = false,
}) {
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Block letters and allow only numbers
    if (numericOnly) {
      inputValue = inputValue.replace(/\D/g, "");
    }

    onChange({
      target: {
        name,
        value: inputValue,
      },
    });
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <div
          className="
            absolute
            inset-y-0
            left-0
            flex
            items-center
            pl-3.5
            pointer-events-none
            text-slate-400
          "
        >
          {icon}
        </div>

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          inputMode={numericOnly ? "numeric" : undefined}
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
              error
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-slate-700/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            }
          `}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}