import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineViewGrid,
  HiOutlineTruck,
  HiOutlineViewList,
  HiOutlineCog,
  HiOutlineMenuAlt2,
  HiOutlineUserCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineSearch
} from "react-icons/hi";

import NotificationBell from "../redux/features/notification/notificationbell.jsx";
import logo from "../assets/carmartH.png";

const baseNavGroups = [
  {
    title: "Explore",
    items: [
      { to: "/", label: "Home", icon: HiOutlineViewGrid },
      { to: "/cars-list", label: "Browse Cars", icon: HiOutlineViewList },
    ],
  },
  {
    title: "My activity",
    items: [
      { to: "/myBooking", label: "My Bookings", icon: HiOutlineTruck },
      { to: "/wishlist", label: "My Wishlist", icon: HiOutlineHeart },
    ],
  },
];

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // 🔒 PROTECT LAYOUT
  if (!user) return <Navigate to="/" replace />;

  const isAdmin = user?.role === "ADMIN";

  const navGroups = [
    ...baseNavGroups,
    ...(isAdmin
      ? [
          {
            title: "Administration",
            items: [{ to: "/admin", label: "Admin Center", icon: HiOutlineShieldCheck }],
          },
        ]
      : []),
  ];

  const [searchText, setSearchText] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    const value = searchText.trim();
    const params = new URLSearchParams(location.search);

    if (value) params.set("title", value);
    else params.delete("title");

    navigate(`/cars-list?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* SIDEBAR */}
      <aside className="hidden w-64 border-r lg:flex lg:flex-col bg-background">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/">
            <img src={logo} alt="CarMart" className="h-9" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-xs font-bold text-gray-400 uppercase">
                {group.title}
              </h3>

              {group.items.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname.startsWith(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <header className="flex items-center justify-between h-16 px-6 border-b bg-background">

          {/* LEFT */}
          <div className="flex items-center w-full max-w-md gap-4">
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <HiOutlineMenuAlt2 className="w-6 h-6" />
            </button>

            <div className="relative w-full">
              <HiOutlineSearch
                onClick={handleSearch}
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer"
              />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search cars..."
                className="w-full py-2 pl-10 pr-3 border rounded-lg"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="items-center hidden gap-2 px-3 py-1 text-xs bg-indigo-100 rounded-full sm:flex"
              >
                <HiOutlineShieldCheck className="w-4 h-4" />
                Admin
              </button>
            )}

            <NotificationBell />

            <button onClick={() => navigate("/myProfile")}>
              <HiOutlineUserCircle className="w-8 h-8 text-gray-500" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}