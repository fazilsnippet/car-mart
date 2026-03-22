import { useState } from "react";
import { useLoginUserMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const Login = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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

      navigate("/"); // 🔥 Redirect to homepage
    } catch (err) {
      setErrors({
        server: err?.data?.message || "Login failed"
      });
    }
  };

  return (
    <>
    <form onSubmit={handleLogin} className="flex flex-col max-w-sm gap-3 mx-auto mt-10 align-middle:center">
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="p-2 text-white bg-blue-600 rounded"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {errors.server && <p className="text-red-500">{errors.server}</p>}
    </form>

    <div className="mt-4 text-center">
      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
    </>
  );
};

export default Login;