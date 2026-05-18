


import { useSelector } from "react-redux";
import {
  Phone,
  Search,
  ChevronDown,
  User,
  // Menu,
  Bell,
} from "lucide-react";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";
import { useTheme } from "../utils/theme.jsx";
import NotificationBell from "../redux/features/notification/notificationbell.jsx";

import bmwlogo from "../assets/bmwlogo.png";

const Header = () => {
  const [showHeader, setShowHeader] =
  useState(true);

useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    // desktop always visible
    if (window.innerWidth >= 1024) {
      setShowHeader(true);
      return;
    }

    const currentScrollY =
      window.scrollY;

    // always show at top
    if (currentScrollY <= 10) {
      setShowHeader(true);
    }

    // scrolling down -> hide
    else if (
      currentScrollY > lastScrollY
    ) {
      setShowHeader(false);
    }

    // scrolling up -> show
    else {
      setShowHeader(true);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  return () => {
    window.removeEventListener(
      "scroll",
      handleScroll
    );
  };
}, []);
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const { user, isLoading } = useSelector(
    (state) => state.auth
  );

  const [searchText, setSearchText] =
    useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    setSearchText(params.get("q") || "");
  }, [location.search]);

  const navItems = [
    {
      label: "Buy used car",
      path: "/cars-list",
    },
    {
      label: "Sell car",
      path: "/sell-car",
    },
    {
      label: "Car finance",
      path: "/emiCalculator",
    },
    {
      label: "Chat",
      path: "/chat",
    },
    {
      label: "Services",
      path: "/services",
    },
  ];

  const handleSearch = () => {
    const value = searchText.trim();

    const params = new URLSearchParams();

    if (value) params.set("q", value);

    navigate(`/cars-list?${params.toString()}`);
  };

  return (
    <>
    <header
  className={`
    fixed top-0 left-0 right-0 z-50
    border-b bg-background border-color
    transition-all duration-300 
    ease-in-out
    lg:translate-y-0
    ${
      showHeader
        ? "translate-y-0 opacity-100"
        : "-translate-y-full opacity-0"
    }
  `}
>
    {/* <header className="sticky top-0 z-50 w-full border-b bg-background border-color"> */}
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 h-14">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            {/* <button className="lg:hidden">
              <Menu
                size={24}
                className="text-gray-700"
              />
            </button> */}

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center"
            >
              <img
                src={bmwlogo}
                alt="Logo"
                className="object-contain h-8"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="items-center hidden gap-6 lg:flex">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className={`text-sm font-medium transition ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-card"
            >
              {theme === "dark"
                ? "🌙"
                : "☀️"}
            </button>

            {/* NOTIFICATIONS */}
            {user && (
              <div className="hidden md:block">
                <NotificationBell />
              </div>
            )}

            {/* AUTH */}
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-card animate-pulse" />
            ) : !user ? (
              <button
                onClick={() =>
                  navigate("/login")
                }
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate("/myProfile")
                }
                className="flex items-center justify-center w-10 h-10 rounded-full bg-card "
              >
                <User size={18} />
              </button>
            )}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center h-12 px-4 rounded-full bg-card "
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
                setSearchText(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSearch()
              }
              className="flex-1 px-3 text-sm bg-transparent outline-none text-foreground "
            />

            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* SPACER */}
{/* <div className="h-32 lg:h-2" />  */}
<div className="h-32 lg:h-0" />  

  </>
  );
};

export default Header;