import { useState } from "react";
import { z } from "zod";
import {
  useSendSignupOtpMutation,
  useRegisterUserMutation
} from "./authApi";
import { useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
import { setUser } from "./authSlice.js";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email")
});

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[0-9]/, "Must contain one number"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  otp: z.string().length(6, "OTP must be 6 digits")
});

const Signup = () => {
  const navigate = useNavigate(); // ✅ moved inside component
  const dispatch = useDispatch(); // ✅ initialize dispatch before using it

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    phone: "",
    otp: ""
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [sendOtp, { isLoading: otpLoading }] = useSendSignupOtpMutation();
  const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();

  // 🔹 Step 1 Validation
  const handleSendOtp = async () => {
    const result = emailSchema.safeParse({ email });

    if (!result.success) {
      setErrors({ email: result.error.issues[0].message }); // ✅ fixed to use issues
      return;
    }

    setErrors({});

    try {
await sendOtp(email).unwrap();
      setStep(2);
    } catch (err) {
      setErrors({
        server: err?.data?.message || "Failed to send OTP"
      });
    }
  };

  // 🔹 Step 2 Validation
const handleRegister = async () => {
  const result = registerSchema.safeParse(form);

  if (!result.success) {
    const formatted = {};
    result.error.issues.forEach((err) => {
      formatted[err.path[0]] = err.message;
    });
    setErrors(formatted);
    return;
  }

  setErrors({});

  try {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    const response = await registerUser(formData).unwrap();

    dispatch(setUser(response.user));

    // ✅ navigate to dashboard/home instead of login
    navigate("/");
  } catch (err) {
    setErrors({
      server: err?.data?.message || err?.error || "Registration failed"
    });
  }
};


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-linear-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl">

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            Create Account
          </h2>
          <p className="text-sm text-slate-500">
            Step {step} of 2
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={otpLoading}
              className="w-full p-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {otpLoading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>

            {errors.server && (
              <p className="text-sm text-center text-red-500">
                {errors.server}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {["fullName", "userName", "password", "phone", "otp"].map((field) => (
              <div key={field}>
                <input
                  type={field === "password" ? "password" : "text"}
                  value={form[field]} // ✅ controlled input
                  placeholder={
                    field === "fullName"
                      ? "Full Name"
                      : field === "userName"
                      ? "Username"
                      : field === "password"
                      ? "Password"
                      : field === "phone"
                      ? "Phone"
                      : "OTP"
                  }
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center gap-4">
              <label className="px-4 py-2 transition border rounded-lg cursor-pointer bg-slate-100 hover:bg-slate-200">
                Upload Avatar
                <input type="file" hidden onChange={handleAvatarChange} />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="object-cover w-12 h-12 border rounded-full"
                />
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={registerLoading}
              className="w-full p-3 text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {registerLoading ? "Registering..." : "Register"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>

            {errors.server && (
              <p className="text-sm text-center text-red-500">
                {errors.server}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
