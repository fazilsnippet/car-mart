// import { useSelector } from "react-redux";
// import { ChevronDown, Phone, User, Bell, Search } from "lucide-react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useMemo, useState, useEffect } from "react";

// import kiaA from "../assets/kiaA.png";
// import kiaB from "../assets/kiaB.jpeg";
// import { useTheme } from "../utils/theme.jsx";
// import kia from "../assets/kia.png";


// import NotificationBell from "../redux/features/notification/notificationbell.jsx";
// import { fromJSON } from "postcss";

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { theme } = useTheme();

//   const { user, isLoading } = useSelector((state) => state.auth);

//   const [searchText, setSearchText] = useState("");

//   // ✅ Sync input with URL (important)
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setSearchText(params.get("q") || "");
//   }, [location.search]);

//   // ✅ CENTRALIZED NAV
//   const navItems = useMemo(() => [
//     { label: "Buy used car", path: "/cars-list" },
//     { label: "Sell car", path: "/sell-car" },
//     { label: "Car finance", path: "/emiCalculator" },
//     { label: "Chat", path: "/chat" },
//     { label: "Car services", path: "/services" },
//   ], []);

//   // 🔥 SEARCH HANDLER (URL DRIVEN)
//   const handleSearch = () => {
//     const value = searchText.trim();

//     const params = new URLSearchParams();
//     if (value) params.set("q", value);

//     navigate(`/cars-list?${params.toString()}`);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   return (
//     <>
//       <header className="fixed top-0 left-0 z-50 w-full bg-white border-b bg-background text-foreground">
        
//         {/* 🔥 MAIN ROW */}
//         <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">

//           {/* LEFT */}
//           <div className="flex items-center gap-8">

//             {/* LOGO */}
//             <Link to="/" className="flex items-center">
//   {/* Light logo */}
//   {/* <img
//     src={kiaA}
//     alt="CarMart"
//     className="object-contain w-24 h-auto cursor-pointer dark:hidden"
//   />

//   <img
//     src={kiaB} // 👈 your dark version
//     alt="CarMart"
//     className="hidden object-contain w-24 h-auto cursor-pointer dark:block"
//   /> */}

// <img
//   src={theme === "dark" ? kiaA : kiaA}
//   className="object-contain w-24"
//   alt="CarMart Logo"
// />
// </Link>

//             {/* NAV (desktop only) */}
//             <nav className="items-center hidden gap-6 text-sm font-medium text-gray-700 md:flex bg-background text-foreground">
//               {navItems.map((item) => (
//                 <div
//                   key={item.path}
//                   onClick={() => navigate(item.path)}
//                   className="flex items-center gap-1 cursor-pointer hover:text-black"
//                 >
//                   {item.label}
//                   <ChevronDown size={14} />
//                 </div>
//               ))}
//             </nav>
//           </div>

//           {/* 🔥 SEARCH BAR (DESKTOP) */}
//           <div className="flex-1 hidden max-w-xl mx-6 md:flex bg-background text-foreground">
//             <div className="flex w-full overflow-hidden border rounded-lg">
//  <input
//   type="search"
//   name="q"
//   autoComplete="off"
//   inputMode="search"
//   value={searchText}
//   onChange={(e) => setSearchText(e.target.value)}
//   onKeyDown={handleKeyDown}
//                 className="flex-1 px-4 py-2 outline-none"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="flex items-center justify-center px-4 text-white bg-orange-300"
//               >
//                 <Search size={18} />
//               </button>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="flex items-center gap-4">

//             {/* CALL */}
//             <button className="items-center hidden gap-2 px-4 py-2 text-sm text-white bg-orange-300 rounded-lg md:flex">
//               <Phone size={16} />
//               Call us
//             </button>

//             {/* AUTH */}
//             {isLoading ? (
//               <div className="text-sm text-gray-400">...</div>
//             ) : !user ? (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
//               >
//                 Login
//               </button>
//             ) : (
//               <div className="flex items-center gap-4">

//                 {/* NOTIFICATIONS */}
//                 {/* <div
//                   onClick={() => navigate("/notifications")}
//                   className="relative cursor-pointer"
//                 >
//                   <Bell size={20} />
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                    
//                   </span>
//                 </div> */}
//                   <div className="relative p-2 rounded-lg hover:bg-slate-100">
//                    <NotificationBell  className="w-5 h-5" />
//             </div>

//                 {/* PROFILE */}
//                 <div
//                   onClick={() => navigate("/myProfile")}
//                   className="flex items-center gap-1 text-sm font-medium cursor-pointer"
//                 >
//                   <User size={18} />
//                   {user?.userName || "Profile"}
//                   <ChevronDown size={14} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 🔥 MOBILE SEARCH BAR */}
//         <div className="px-4 pb-3 md:hidden bg-background text-foreground">
//           <div className="flex overflow-hidden border rounded-lg">
// <input
//   type="search"
//   name="q"
//   autoComplete="off"
//   inputMode="search"
//   value={searchText}
//   onChange={(e) => setSearchText(e.target.value)}
//   onKeyDown={handleKeyDown}
//               className="flex-1 px-4 py-2 outline-none"
//             />
//             <button
//               onClick={handleSearch}
//               className="flex items-center justify-center px-4 text-white bg-black"
//             >
//               <Search size={18} />
//             </button>
//           </div>
//         </div>

//       </header>

//       {/* SPACER */}
//       <div className="h-22 md:h-16"></div>
//     </>
//   );
// };

// export default Header;

import { useSelector } from "react-redux";
import { Phone, Search } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { useTheme } from "../utils/theme.jsx";
import NotificationBell from "../redux/features/notification/notificationbell.jsx";
import kia from "../assets/kia.png";

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
      <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
  
  <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">

    {/* LEFT */}
    <div className="flex items-center gap-6">
      <Link to="/">
        <img src={kia} className="w-24 object-contain" />
      </Link>

      {/* NAV */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`transition ${
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>

    {/* SEARCH */}
    <div className="hidden md:flex flex-1 max-w-xl mx-6">
      <div className="flex items-center w-full bg-gray-100 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
        <Search size={18} className="text-gray-500" />

        <input
          type="search"
          placeholder="Search cars, brands..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent px-3 outline-none text-sm"
        />

        <button
          onClick={handleSearch}
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-3">

      {/* CALL */}
      <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
        <Phone size={16} />
        Call
      </button>

      {/* THEME */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl hover:bg-gray-100 transition"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* AUTH */}
      {isLoading ? (
        <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse" />
      ) : !user ? (
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-3">

          {/* NOTIFICATIONS */}
          <div className="p-2 rounded-xl hover:bg-gray-100">
            <NotificationBell />
          </div>

          {/* PROFILE */}
          <div
            onClick={() => navigate("/myProfile")}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition"
          >
            <User size={18} />
            <span className="text-sm font-medium">
              {user?.userName || "Profile"}
            </span>
            <ChevronDown size={14} />
          </div>
        </div>
      )}
    </div>
  </div>

  {/* MOBILE SEARCH */}
  <div className="px-4 pb-3 md:hidden">
    <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
      <Search size={18} className="text-gray-500" />

      <input
        type="search"
        placeholder="Search cars..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 bg-transparent px-3 outline-none text-sm"
      />

      <button
        onClick={handleSearch}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg"
      >
        Go
      </button>
    </div>
  </div>
</header>

      <div className="h-20 md:h-16" />
    </>
  );
};

export default Header;