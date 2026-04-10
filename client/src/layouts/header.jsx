import { useSelector } from "react-redux";
import { ChevronDown, Phone, User, Bell } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";
import carmartH from "../assets/carmartH.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  // ✅ CENTRALIZED NAV CONFIG
  const navItems = useMemo(() => [
    { label: "Buy used car", path: "/buy" },
    { label: "Sell car", path: "/sell" },
    { label: "Car finance", path: "/finance" },
    { label: "New cars", path: "/new-cars" },
    { label: "Car services", path: "/services" },
  ], []);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white border-b">
        <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img
                src={carmartH}
                alt="CarMart"
                className="object-contain w-24 h-auto cursor-pointer"
              />
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-1 cursor-pointer hover:text-black"
                >
                  {item.label}
                  <ChevronDown size={14} />
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* CALL BUTTON */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-black rounded-lg">
              <Phone size={16} />
              Call us
            </button>

            {/* AUTH */}
            {isLoading ? (
              <div className="text-sm text-gray-400">...</div>
            ) : !user ? (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-4">

                {/* NOTIFICATIONS */}
                <div
                  onClick={() => navigate("/notifications")}
                  className="relative cursor-pointer"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    3
                  </span>
                </div>

                {/* PROFILE */}
                <div
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                >
                  <User size={18} />
                  {user?.name || "Profile"}
                  <ChevronDown size={14} />
                </div>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* SPACER */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;