import { useSelector } from "react-redux";
import { Phone, Search, ChevronDown, User } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../utils/theme.jsx";
import NotificationBell from "../redux/features/notification/notificationbell.jsx";
import bmwlogo from "../assets/bmwlogo.png"
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const { user, isLoading } = useSelector((state) => state.auth);

  const [searchText, setSearchText] = useState("");

  // Sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get("q") || "");
  }, [location.search]);

  const navItems = [
    { label: "Buy used car", path: "/cars-list" },
    { label: "Sell car", path: "/sell-car" },
    { label: "Car finance", path: "/emiCalculator" },
    { label: "Chat", path: "/chat" },
    { label: "Car services", path: "/services" },
  ];

  const handleSearch = () => {
    const value = searchText.trim();
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    navigate(`/cars-list?${params.toString()}`);
  };

  return (
    <>
<header className="fixed top-0 left-0 right-0 z-50 w-full h-16 border-b shadow-sm border-white/20 bg-background/70 backdrop-blur-xl">
        <div className="flex items-center h-16 gap-2 px-3 mx-auto max-w-7xl bg-background text-foreground">

          {/* LOGO */}
         <Link to="/" className="flex items-center shrink-0">
  <img
    src={bmwlogo}
    className="object-contain w-auto h-8 md:h-10 lg:h-12"
    alt="BMW Logo"
  />
</Link>

          {/* NAV (desktop only) */}
          <nav className="items-center hidden gap-6 ml-4 text-sm md:flex text-foreground">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative transition-all duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-foreground hover:text-indigo-600"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* SEARCH */}
          <div className="flex items-center flex-1 px-2 py-1.5 md:mx-6 bg-background text-foreground backdrop-blur border border-color rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
            <Search size={16} className="text-gray-400" />

            <input
              type="search"
              placeholder="Search cars..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-2 text-sm bg-transparent outline-none"
            />

            <button
              onClick={handleSearch}
              className="px-2 py-1 text-xs text-white transition bg-indigo-600 rounded-md md:text-sm hover:bg-indigo-700"
            >
              Go
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">

            {/* CALL (desktop only) */}
            <button className="items-center hidden gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-indigo-600 shadow-sm md:flex rounded-xl hover:bg-indigo-700 active:scale-95">
              <Phone size={16} />
              Call
            </button>

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 transition rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* AUTH */}
            {isLoading ? (
              <div className="w-12 h-8 bg-gray-200 rounded-lg animate-pulse" />
            ) : !user ? (
              <button
                onClick={() => navigate("/login")}
                className="px-2 py-1 text-xs transition border rounded-lg md:px-4 md:py-2 md:text-sm border-black/10 hover:bg-black/5"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-1 md:gap-2">

                {/* NOTIFICATIONS (desktop only) */}
                <div className="hidden p-2 transition md:block rounded-xl hover:bg-black/5 dark:hover:bg-white/10">
                  <NotificationBell />
                </div>

                {/* PROFILE */}
                <div
                  onClick={() => navigate("/myProfile")}
                  className="flex items-center gap-1 px-2 py-1 transition cursor-pointer md:gap-2 md:px-3 md:py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <User size={18} />
                  <span className="hidden text-sm font-medium md:block">
                    {user?.userName || "Profile"}
                  </span>
                  <ChevronDown size={14} className="hidden md:block" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Header;