// components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";


const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex items-center justify-between w-full h-16 px-6 text-white bg-black">
      
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        CarZone
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button className="px-2 py-1 bg-gray-700 rounded">
          🌙
        </button>

        {user ? (
          <>
            {/* Notification */}
            <button className="relative">
              <Bell size={22} />
              <span className="absolute px-1 text-xs bg-red-500 rounded -top-1 -right-1">
                3
              </span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;