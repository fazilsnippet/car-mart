import { useState, useEffect } from "react";
import { z } from "zod";
import {
  useSendSignupOtpMutation,
  useRegisterUserMutation
} from "./authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email")
});

const registerSchema = z.object({
  fullName: z.string().min(3),
  userName: z.string().min(3),
  password: z.string().min(8),
  phone: z.string().regex(/^[0-9]{10}$/),
  otp: z.string().length(6)
});

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    phone: "",
    otp: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState({});
  const [sendOtp] = useSendSignupOtpMutation();
  const [registerUser] = useRegisterUserMutation();

  // 🔥 OTP TIMER
  useEffect(() => {
    if (otpTimer <= 0) return;

    const timer = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpTimer]);

  // 🔐 PASSWORD STRENGTH
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
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500"
  ][strength - 1] || "bg-gray-200";

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      setErrors({ email: result.error.issues[0].message });
      return;
    }

    setErrors({});
    await sendOtp({ email }).unwrap();
    setOtpTimer(60);
    setStep(2);
  };

  // 🔹 REGISTER
  const handleRegister = async () => {
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const formatted = {};
      result.error.issues.forEach((e) => {
        formatted[e.path[0]] = e.message;
      });
      setErrors(formatted);
      return;
    }

    try {
      const response = await registerUser({
        ...form,
        email
      }).unwrap();

      dispatch(setUser(response.user));

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setErrors({ server: "Registration failed" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-900 to-slate-800">

      {/* 🎉 SUCCESS */}
      {success && (
        <div className="absolute text-center text-white animate-pulse">
          <h2 className="text-3xl font-bold">🎉 Success!</h2>
          <p>Redirecting...</p>
        </div>
      )}

      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-xl rounded-2xl">

        <h2 className="text-2xl font-bold text-center">
          Create Account
        </h2>

        {/* PROGRESS */}
        <div className="flex gap-2">
          <div className={`h-2 flex-1 ${step >= 1 ? "bg-blue-500" : "bg-gray-200"}`} />
          <div className={`h-2 flex-1 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`} />
        </div>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <button
              onClick={handleSendOtp}
              className="w-full p-3 text-white bg-blue-600 rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500"
            >
              ← Change Email
            </button>

            {["fullName", "userName", "phone", "otp"].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
            ))}

            {/* PASSWORD */}
            <div>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 border rounded-lg"
                >
                  👁
                </button>
              </div>

              {/* STRENGTH BAR */}
              <div className="h-2 mt-2 bg-gray-200 rounded">
                <div
                  className={`h-2 ${strengthColor} rounded`}
                  style={{ width: `${strength * 25}%` }}
                />
              </div>
            </div>

            {/* OTP TIMER */}
            <div className="text-sm text-gray-500">
              {otpTimer > 0 ? (
                `Resend OTP in ${otpTimer}s`
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-blue-600"
                >
                  Resend OTP
                </button>
              )}
                <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="p-3 text-white bg-blue-400 rounded-lg hover:underline"
          >
Login 
          </button>
        </p>
            </div>

            <button
              onClick={handleRegister}
              className="w-full p-3 text-white bg-green-600 rounded-lg"
            >
              Register
            </button>
          </>
        )}

        {errors.server && (
          <p className="text-center text-red-500">{errors.server}</p>
        )}
      </div>
    </div>
  );
}