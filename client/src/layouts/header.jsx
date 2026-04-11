import { useSelector } from "react-redux";
import { ChevronDown, Phone, User, Bell, Search } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import carmartH from "../assets/carmartH.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading } = useSelector((state) => state.auth);

  const [searchText, setSearchText] = useState("");

  // ✅ Sync input with URL (important)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get("q") || "");
  }, [location.search]);

  // ✅ CENTRALIZED NAV
  const navItems = useMemo(() => [
    { label: "Buy used car", path: "/cars-list" },
    { label: "Sell car", path: "/chat" },
    { label: "Car finance", path: "/finance" },
    { label: "New cars", path: "/new-cars" },
    { label: "Car services", path: "/services" },
  ], []);

  // 🔥 SEARCH HANDLER (URL DRIVEN)
  const handleSearch = () => {
    const value = searchText.trim();

    const params = new URLSearchParams();
    if (value) params.set("q", value);

    navigate(`/cars-list?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white border-b bg-background text-foreground">
        
        {/* 🔥 MAIN ROW */}
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

            {/* NAV (desktop only) */}
            <nav className="items-center hidden gap-6 text-sm font-medium text-gray-700 md:flex bg-background text-foreground">
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

          {/* 🔥 SEARCH BAR (DESKTOP) */}
          <div className="flex-1 hidden max-w-xl mx-6 md:flex bg-background text-foreground">
            <div className="flex w-full overflow-hidden border rounded-lg">
              <input
                type="text"
                placeholder="Search cars (e.g. Swift, BMW...)"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 outline-none"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center px-4 text-white bg-black"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* CALL */}
            <button className="items-center hidden gap-2 px-4 py-2 text-sm text-white bg-black rounded-lg md:flex">
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
                  onClick={() => navigate("/myProfile")}
                  className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                >
                  <User size={18} />
                  {user?.userName || "Profile"}
                  <ChevronDown size={14} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 MOBILE SEARCH BAR */}
        <div className="px-4 pb-3 md:hidden bg-background text-foreground">
          <div className="flex overflow-hidden border rounded-lg">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 outline-none"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-4 text-white bg-black"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

      </header>

      {/* SPACER */}
      <div className="h-[88px] md:h-16"></div>
    </>
  );
};

export default Header;