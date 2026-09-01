


// import { useSelector } from "react-redux";
// import {
//   Phone,
//   Search,
//   ChevronDown,
//   User,
//   // Menu,
//   Bell,
// } from "lucide-react";

// import {
//   useNavigate,
//   Link,
//   useLocation,
// } from "react-router-dom";

// import { useState, useEffect } from "react";
// import { useTheme } from "../utils/theme.jsx";
// import NotificationBell from "../redux/features/notification/notificationbell.jsx";

// import bmwlogo from "../assets/bmwlogo.png";

// const Header = () => {
//   const [showHeader, setShowHeader] =
//   useState(true);

// useEffect(() => {
//   let lastScrollY = window.scrollY;

//   const handleScroll = () => {
//     // desktop always visible
//     if (window.innerWidth >= 1024) {
//       setShowHeader(true);
//       return;
//     }

//     const currentScrollY =
//       window.scrollY;

//     // always show at top
//     if (currentScrollY <= 10) {
//       setShowHeader(true);
//     }

//     // scrolling down -> hide
//     else if (
//       currentScrollY > lastScrollY
//     ) {
//       setShowHeader(false);
//     }

//     // scrolling up -> show
//     else {
//       setShowHeader(true);
//     }

//     lastScrollY = currentScrollY;
//   };

//   window.addEventListener(
//     "scroll",
//     handleScroll
//   );

//   return () => {
//     window.removeEventListener(
//       "scroll",
//       handleScroll
//     );
//   };
// }, []);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { theme, toggleTheme } = useTheme();

//   const { user, isLoading } = useSelector(
//     (state) => state.auth
//   );

//   const [searchText, setSearchText] =
//     useState("");

//   useEffect(() => {
//     const params = new URLSearchParams(
//       location.search
//     );

//     setSearchText(params.get("q") || "");
//   }, [location.search]);

//   const navItems = [
//     {
//       label: "Buy used car",
//       path: "/cars-list",
//     },
//     {
//       label: "Sell car",
//       path: "/sell-car",
//     },
//     {
//       label: "Car finance",
//       path: "/emiCalculator",
//     },
//     {
//       label: "Chat",
//       path: "/chat",
//     },
//     {
//       label: "Services",
//       path: "/services",
//     },
//   ];

//   const handleSearch = () => {
//     const value = searchText.trim();

//     const params = new URLSearchParams();

//     if (value) params.set("q", value);

//     navigate(`/cars-list?${params.toString()}`);
//   };

//   return (
//     <>
//     <header
//   className={`
//     fixed top-0 left-0 right-0 z-50
//     border-b bg-background border-color
//     transition-all duration-300 
//     ease-in-out
//     lg:translate-y-0
//     ${
//       showHeader
//         ? "translate-y-0 opacity-100"
//         : "-translate-y-full opacity-0"
//     }
//   `}
// >
//     {/* <header className="sticky top-0 z-50 w-full border-b bg-background border-color"> */}
//         {/* TOP BAR */}
//         <div className="flex items-center justify-between px-4 h-14">

//           {/* LEFT */}
//           <div className="flex items-center gap-3">

//             {/* MOBILE MENU */}
//             {/* <button className="lg:hidden">
//               <Menu
//                 size={24}
//                 className="text-gray-700"
//               />
//             </button> */}

//             {/* LOGO */}
//             <Link
//               to="/"
//               className="flex items-center"
//             >
//               <img
//                 src={bmwlogo}
//                 alt="Logo"
//                 className="object-contain h-8"
//               />
//             </Link>
//           </div>

//           {/* DESKTOP NAV */}
//           <nav className="items-center hidden gap-6 lg:flex">
//             {navItems.map((item) => {
//               const isActive =
//                 location.pathname === item.path;

//               return (
//                 <button
//                   key={item.path}
//                   onClick={() =>
//                     navigate(item.path)
//                   }
//                   className={`text-sm font-medium transition ${
//                     isActive
//                       ? "text-foreground"
//                       : "text-foreground hover:text-black"
//                   }`}
//                 >
//                   {item.label}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* RIGHT */}
//           <div className="flex items-center gap-2">

//             {/* THEME */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-full hover:bg-card"
//             >
//               {theme === "dark"
//                 ? "🌙"
//                 : "☀️"}
//             </button>

//             {/* NOTIFICATIONS */}
//             {user && (
//               <div className="hidden md:block">
//                 <NotificationBell />
//               </div>
//             )}

//             {/* AUTH */}
//             {isLoading ? (
//               <div className="w-10 h-10 rounded-full bg-card animate-pulse" />
//             ) : !user ? (
//               <button
//                 onClick={() =>
//                   navigate("/login")
//                 }
//                 className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
//               >
//                 Login
//               </button>
//             ) : (
//               <button
//                 onClick={() =>
//                   navigate("/myProfile")
//                 }
//                 className="flex items-center justify-center w-10 h-10 rounded-full bg-card "
//               >
//                 <User size={18} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="px-4 pb-3">
//           <div
//             className="flex items-center h-12 px-4 rounded-full bg-card "
//           >
//             <Search
//               size={18}
//               className="text-foreground"
//             />

//             <input
//               type="search"
//               placeholder="Search cars..."
//               value={searchText}
//               onChange={(e) =>
//                 setSearchText(
//                   e.target.value
//                 )
//               }
//               onKeyDown={(e) =>
//                 e.key === "Enter" &&
//                 handleSearch()
//               }
//               className="flex-1 px-3 text-sm bg-transparent outline-none text-foreground "
//             />

//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* SPACER */}
// {/* <div className="h-32 lg:h-2" />  */}
// <div className="h-32 lg:h-0" />  

//   </>
//   );
// };

// export default Header;

import { useEffect, useState, useRef } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Menu,
  X,
  Search,
  User,
  Bell,
  ChevronRight,
} from "lucide-react";
import { HiOutlineBell } from "react-icons/hi";



import bmwlogo from "../assets/bmwlogo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading } = useSelector(
    (state) => state.auth
  );

  const searchInputRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [showHeader, setShowHeader] =
    useState(true);

  const [scrolled, setScrolled] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

    

  // -----------------------------
  // NAVIGATION
  // -----------------------------

  const navItems = [
    {
      label: "Buy Cars",
      path: "/cars-list",
    },
    {
      label: "Sell Car",
      path: "/sell-car",
    },
    {
      label: "Finance",
      path: "/emiCalculator",
    },
    {
      label: "Services",
      path: "/services",
    },
    {
      label: "Chat",
      path: "/chat",
    },
  ];

  // -----------------------------
  // SCROLL EFFECT
  // -----------------------------

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      setScrolled(currentScrollY > 10);

      // Desktop always visible
      if (window.innerWidth >= 1024) {
        setShowHeader(true);
        return;
      }

      // Mobile hide/show
      if (currentScrollY <= 10) {
        setShowHeader(true);
      } else if (
        currentScrollY > lastScrollY
      ) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // -----------------------------
  // SEARCH
  // -----------------------------

useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Handle typing inside the input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // If deleting characters
    if (inputValue.length < searchText.slice(0, 12).length) {
      setSearchText((prev) => prev.slice(0, -1));
      return;
    }

    // Append new character to the full text
    const addedChar = inputValue.slice(-1);
    setSearchText((prev) => prev + addedChar);
  };

  const handleSearch = () => {
    const value = searchText.trim();
    const params = new URLSearchParams();

    if (value) params.set("q", value);

    navigate(`/cars-list?${params.toString()}`);
    setSearchOpen(false);
  };

  return (
    <>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

   <header
  className={`overflow-x-hidden
    fixed top-0 left-0 right-0 z-50
    transition-all duration-300
    border-b
    ${
      showHeader
        ? "translate-y-0"
        : "-translate-y-full"
    }
    
bg-[linear-gradient(265deg,rgba(80,76,78,0.96)_0%,rgba(170,172,166,0.96)_100%)]
    backdrop-blur-xl
    ${
      scrolled
        ? "border-white/10 shadow-lg"
        : "border-transparent"
    }
  `}
>

<div className="overflow-x-hidden h-[64px] px-3 sm:px-4 lg:h-[72px] lg:px-10">
            <div className="flex items-center justify-between h-full">

            {/* ========================= */}
            {/* LEFT */}
            {/* ========================= */}

            {/* <div className="flex items-center gap-3"> */}
            <div className="flex items-center gap-2 sm:gap-3 ">
              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="flex items-center justify-center w-10 h-10 text-white border rounded-full lg:hidden bg-white/10 backdrop-blur-md border-white/10"
              >
                <Menu size={20} />
              </button>

              {/* LOGO */}
              <Link
                to="/"
                className="flex items-center"
              >
                <img
                  src={bmwlogo}
                  alt="Logo"
className="object-contain h-8 sm:h-9"
                />
              </Link>
            </div>

            {/* ========================= */}
            {/* DESKTOP NAV */}
            {/* ========================= */}

            <nav className="items-center hidden gap-10 lg:flex">
              {navItems.map((item) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() =>
                      navigate(item.path)
                    }
                    className="
                      relative
                      text-[14px]
                      uppercase
                      tracking-[0.18em]
                      text-white/80
                      hover:text-white
                      transition-all
                      duration-300
                      group
                    "
                  >
                    {item.label}

                    <span
                      className={`
                        absolute
                        left-0
                        -bottom-2
                        h-[1px]
                        bg-white
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }
                      `}
                    />
                  </button>
                );
              })}
            </nav>

            {/* ========================= */}
            {/* RIGHT */}
            {/* ========================= */}

<div className="flex items-center flex-shrink-0 gap-1.5 sm:gap-2 lg:gap-3">
              {/* SEARCH */}
              <button
                onClick={() =>
                  setSearchOpen(true)
                }
                className="flex items-center justify-center w-10 h-10 text-white transition border rounded-full bg-white/10 border-white/10 backdrop-blur-md hover:bg-white/20"
              >
                <Search size={18} />
              </button>

            

              {/* NOTIFICATIONS */}
              {user && (
                <div className="hidden md:block">
                  <button
                  onClick={() =>
                    navigate("/notifications")
                  }
                  className="flex items-center justify-center w-10 h-10 text-white border rounded-full bg-white/10 border-white/10 backdrop-blur-md hover:bg-white/20"
                >
                  <HiOutlineBell />
                </button>
                
                </div>
              )}

              {/* AUTH */}
              {isLoading ? (
                <div
                  className="w-10 h-10 rounded-full bg-white/10 animate-pulse"
                />
              ) : !user ? (
                <button
                  onClick={() =>
                    navigate("/login")
                  }
                  className="
                  px-4 sm:px-5 h-10
                    rounded-full
                    bg-white
                    text-black
                    text-sm
                    font-medium
                    hover:scale-[1.03]
                    transition
                  "
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate("/myProfile")
                  }
                  className="
                    flex items-center justify-center
                    w-10 h-10
                    rounded-full
                    bg-white text-black
                    hover:scale-[1.05]
                    transition
                  "
                >
                  <User size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================= */}
      {/* MOBILE MENU */}
      {/* ========================= */}

      <div
        className={`
          fixed inset-0 z-[60]
          transition-all duration-300
          ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* BACKDROP */}
        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* DRAWER */}
        <div
          className={`
            absolute top-0 left-0
            h-full w-[85%] max-w-[380px]
            bg-black
            border-r border-white/10
            transition-transform duration-300
            ${
              mobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* TOP */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">

            <img
              src={bmwlogo}
              alt="Logo"
              className="h-9"
            />

            <button
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* LINKS */}
          <div className="flex flex-col p-5">

            {navItems.map((item) => {
              const isActive =
                location.pathname ===
                item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);

                    setMobileMenuOpen(
                      false
                    );
                  }}
                  className={`
                    flex items-center justify-between
                    py-4
                    border-b border-white/10
                    text-left
                    transition
                    ${
                      isActive
                        ? "text-white"
                        : "text-white/70"
                    }
                  `}
                >
                  <span className="text-[15px] tracking-wide uppercase">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={18}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* SEARCH MODAL */}
      {/* ========================= */}

      <div
        className={`
          fixed inset-0 z-[70]
          transition-all duration-300
          ${
            searchOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          onClick={() =>
            setSearchOpen(false)
          }
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <div
          className="relative flex items-start justify-center px-4 pt-32 "
        >
          <div
            className="w-full max-w-3xl p-4 border rounded-3xl border-white/10 bg-black/90 backdrop-blur-2xl"
          >
            <div
              className="flex items-center gap-3 "
            >
              <Search
                size={20}
                className="text-white/60"
              />

              {/* <input
                type="search"
                placeholder="Search luxury cars..."
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
                autoFocus
                className="flex-1 text-lg text-white bg-transparent outline-none placeholder:text-white/40"
              /> */}
              <input
  ref={searchInputRef}
  type="search"
  placeholder="Search luxury cars..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  className="flex-1 text-lg text-white bg-transparent outline-none placeholder:text-white/40"
/>

              <button
                onClick={handleSearch}
                className="px-5 text-sm font-medium text-black bg-white rounded-full h-11"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER SPACER */}
<div className="h-[64px] lg:h-[72px]" />    </>
  );
};

export default Header;