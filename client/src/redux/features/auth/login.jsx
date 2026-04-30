import { useState } from "react";
import { useLoginUserMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});

    try {
      const response = await loginUser(formData).unwrap();
      dispatch(setUser(response.user));
      navigate("/");
    } catch (err) {
      setErrors({
        server: err?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background text-foreground">
      
      <div className="w-full max-w-md p-6 shadow-xl bg-card rounded-2xl">
        
        {/* TITLE */}
        <h2 className="mb-6 text-2xl font-semibold text-center">
          Welcome Back 👋
        </h2>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* SERVER ERROR */}
          {errors.server && (
            <p className="text-sm text-center text-red-500">
              {errors.server}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-5 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="w-full p-3 text-blue-600 rounded-lg hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;