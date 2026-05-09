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
<header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl bg-background rounded-3xl ">
  <div
    className="
      flex items-center
      h-16
      px-3 md:px-5
      rounded-3xl
      border border-white/10
      bg-background/80
      backdrop-blur-2xl
      shadow-[0_8px_30px_rgba(0,0,0,0.08)]
    "
  >
    {/* LOGO */}
    <Link to="/" className="flex items-center shrink-0">
      <img
        src={bmwlogo}
        className="object-contain w-auto h-8 md:h-10"
        alt="BMW Logo"
      />
    </Link>

    {/* NAV DESKTOP */}
    <nav className="items-center hidden gap-5 ml-6 lg:flex">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
  relative
  text-sm
  font-medium
  text-blue-500
  transition-all duration-300
  ${
    isActive
      ? "text-foreground"
      : "hover:text-indigo-700"
  }
`}
          >
            {item.label}

            {isActive && (
              <span
                className="
                  absolute
                  left-0
                  -bottom-1
                  h-[2px]
                  w-full
                  rounded-full
                  bg-indigo-600
                "
              />
            )}
          </button>
        );
      })}
    </nav>

    {/* SEARCH */}
    <div
      className="flex items-center flex-1 px-3 py-2 mx-1 border md:mx-6 rounded-2xl border-color bg-background backdrop-blur-lg focus-within:ring-2 focus-within:ring-indigo-700/40"
    >
      <Search
        size={18}
        className="text-foreground"
      />

      <input
        type="search"
        placeholder="Search cars..."
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
        onKeyDown={(e) =>
          e.key === "Enter" && handleSearch()
        }
        className="flex-1 px-2 text-sm bg-transparent outline-none text-foreground"
      />

      <button
        onClick={handleSearch}
        className="
          px-3 py-1.5
          rounded-xl
          bg-indigo-600
          text-xs md:text-sm
          font-medium
          text-white
          transition-all duration-300
          hover:bg-indigo-700
          active:scale-95
        "
      >
        Go
      </button>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-1 md:gap-2 shrink-0">

      {/* CALL */}
      <button
        className="items-center hidden gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-indigo-600 shadow-lg md:flex rounded-2xl hover:bg-indigo-700 active:scale-95"
      >
        <Phone size={16} />
        Call
      </button>

      {/* THEME */}
      <button
        onClick={toggleTheme}
        className="
          p-2.5
          rounded-2xl
          transition-all duration-300
          hover:bg-white/10
        "
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* AUTH */}
      {isLoading ? (
        <div className="w-12 h-8 bg-muted animate-pulse rounded-xl" />
      ) : !user ? (
        <button
          onClick={() => navigate("/login")}
          className="px-3 py-2 text-sm font-medium transition-all duration-300 border rounded-2xl border-border hover:bg-white/10 text-foreground "
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-1 md:gap-2">

          {/* NOTIFICATION */}
          <div
            className="
              hidden md:flex
              p-2.5
              rounded-2xl
              transition-all duration-300
              hover:bg-white/10
            "
          >
            <NotificationBell />
          </div>

          {/* PROFILE */}
          <div
            onClick={() => navigate("/myProfile")}
            className="flex items-center gap-2 px-3 py-2 transition-all duration-300 cursor-pointer rounded-2xl hover:bg-white/10"
          >
            <User size={18} />

            <span className="hidden text-sm font-medium md:block">
              {user?.userName || "Profile"}
            </span>

            <ChevronDown
              size={14}
              className="hidden md:block"
            />
          </div>
        </div>
      )}
    </div>
  </div>
</header>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Header;