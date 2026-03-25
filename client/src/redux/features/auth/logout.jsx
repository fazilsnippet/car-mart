import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../../../redux/api/baseApi.js";
import { logout } from "../../../redux/features/auth/authSlice";
import { useLogoutUserMutation } from "../../../redux/features/auth/authApi.js";

export default function LogoutButton({ className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      // 🔥 Call backend logout (clears cookie/session)
      await logoutUser().unwrap();

    } catch (err) {
      console.warn("Logout API failed, forcing logout anyway");
    } finally {
      // ✅ ALWAYS clear frontend state (even if API fails)

      // 1. Clear auth slice
      dispatch(logout());

      // 2. 🔥 Reset ALL RTK Query cache (CRITICAL)
      dispatch(baseApi.util.resetApiState());


      // 4. Redirect
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 ${className}`}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}