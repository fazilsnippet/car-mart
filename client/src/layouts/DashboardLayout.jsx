
// import { useState, useEffect } from "react";
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import {
//   HiOutlineViewGrid,
//   HiOutlineTruck,
//   HiOutlineClipboardList,
//   HiOutlineViewList,
//   HiOutlineCog,
//   HiOutlineBell,
//   HiOutlineSearch,
//   HiOutlineMenuAlt2,
//   HiOutlineUserCircle,
//   HiOutlineQuestionMarkCircle,
//   HiOutlineShieldCheck,
//   HiOutlineX,
//   HiOutlineHeart
// } from "react-icons/hi";
// import NotificationBell from "../redux/features/notification/notificationbell";
// import MobileBottomNav from "./mobileBottomNav";

// export default function DashboardLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);
//   const isAdmin = user?.role === "ADMIN";
//   const navGroups = [
//     // ...baseNavGroups,
//     ...(isAdmin
//       ? [
//           {
//             title: "Administration",
//             items: [{ to: "/admin", label: "Admin Center", icon: HiOutlineShieldCheck }],
//           },
//         ]
//       : []),
//   ];

//   const [searchText, setSearchText] = useState("");

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [drawerSlideOpen, setDrawerSlideOpen] = useState(false);

//   /* ---------------- SEARCH LOGIC ---------------- */

//  const handleSearch = () => {
//   const value = searchText.trim();
//   const params = new URLSearchParams(location.search);

//   if (value) {
//     params.set("title", value);
//   } else {
//     params.delete("title");
//   }

//   navigate(`/cars-list?${params.toString()}`);
// };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   /* ---------------- MOBILE MENU ANIMATION ---------------- */

//   useEffect(() => {
//     if (isMobileMenuOpen && !isClosing) {
//       setDrawerSlideOpen(false);
//       const id = requestAnimationFrame(() => {
//         requestAnimationFrame(() => setDrawerSlideOpen(true));
//       });
//       return () => cancelAnimationFrame(id);
//     }
//     if (!isMobileMenuOpen) setDrawerSlideOpen(false);
//   }, [isMobileMenuOpen, isClosing]);

//   const closeMobileMenu = () => {
//     setIsClosing(true);
//     setDrawerSlideOpen(false);
//     const t = setTimeout(() => {
//       setIsMobileMenuOpen(false);
//       setIsClosing(false);
//     }, 280);
//     return () => clearTimeout(t);
//   };

//   const showOverlay = isMobileMenuOpen || isClosing;

//   /* ---------------- NAVIGATION CONTENT ---------------- */

//   const navContent = (
//     <>
//       <nav className="flex-1 p-4 py-6 space-y-8 overflow-y-auto bg-background text-foreground">
//         {navGroups.map((group) => (
//           <div key={group.title}>
//             <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//               {group.title}
//             </h3>

//             <div className="space-y-1">
//               {group.items.map(({ to, label, icon: Icon }) => {
//                 const isActive =
//                   location.pathname === to ||
//                   (to !== "/" && location.pathname.startsWith(to));

//                 return (
//                   <Link
//                     key={to}
//                     to={to}
//                     onClick={closeMobileMenu}
//                     className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
//                       isActive
//                         ? "bg-indigo-50 text-indigo-700"
//                         : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//                     }`}
//                   >
//                     <Icon
//                       className={`w-5 h-5 shrink-0 ${
//                         isActive ? "text-indigo-600" : "text-slate-400"
//                       }`}
//                     />

//                     <span>{label}</span>

//                     {isActive && (
//                       <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </nav>
//     </>
//   );

//   return (
//     <div className="flex min-h-screen font-sans bg-slate-50/50 text-slate-900 bg-background text-foreground">

//       {/* MOBILE MENU */}

//       {showOverlay && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div
//             className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
//               drawerSlideOpen && !isClosing ? "opacity-100" : "opacity-0"
//             }`}
//             onClick={closeMobileMenu}
//           />

//           <aside
//             className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ${
//               drawerSlideOpen && !isClosing
//                 ? "translate-x-0"
//                 : "-translate-x-full"
//             }`}
//           >
//             {navContent}
//           </aside>
//         </div>
//       )}

//       {/* SIDEBAR */}

//       <aside
//         className={`hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-slate-200 lg:bg-white transition-[width] duration-300 bg-background text-foreground${
//           isSidebarOpen ? "lg:w-64" : "lg:w-20"
//         }`}
//       >
       

//         {navContent}
//       </aside>

//       {/* MAIN AREA */}

//       <div className="flex flex-col flex-1 min-h-screen bg-background text-foreground">
// <main className="flex-1 p-4 md:p-8 pb-28">
//      {/* <main className="flex-1 p-8 h-[120vh]"> */}
//   <div className="mx-auto max-w-7xl">
//     <Outlet />
//   </div>
//   <MobileBottomNav />
// </main>


//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineTruck,
  HiOutlineClipboardList,
  HiOutlineViewList,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineMenuAlt2,
  HiOutlineUserCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
   HiOutlineHome 

} from "react-icons/hi";
import NotificationBell from "../redux/features/notification/notificationbell";
import MobileBottomNav from "./mobileBottomNav";

const baseNavGroups = [
  {
    title: "Main",
    items: [
      { to: "/", label: "Home", icon: HiOutlineHome },
      { to: "/cars-list", label: "Browse Cars", icon: HiOutlineTruck },
      { to: "/myListings", label: "My Listings", icon: HiOutlineViewList },
      { to: "/myBooking", label: "My Bookings", icon: HiOutlineClipboardList },
      { to: "/wishlist", label: "Wishlist", icon: HiOutlineHeart },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/myProfile", label: "Profile", icon: HiOutlineUserCircle },
      { to: "/settings", label: "Settings", icon: HiOutlineCog },
      { to: "/help", label: "Help & Support", icon: HiOutlineQuestionMarkCircle },
    ],
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";



useEffect(() => {
  if (!user) return;

  if (isAdmin && location.pathname === "/") {
    navigate("/admin", { replace: true });
  }
}, [user, isAdmin, location.pathname, navigate]);

  const navGroups = [
    ...baseNavGroups,
    ...(isAdmin
      ? [
          {
            title: "Administration",
            items: [
              { to: "/admin", label: "Admin Center", icon: HiOutlineShieldCheck },
            ],
          },
        ]
      : []),
  ];

  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [drawerSlideOpen, setDrawerSlideOpen] = useState(false);

  /* ---------------- SEARCH LOGIC ---------------- */

  const handleSearch = () => {
    const value = searchText.trim();
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }
    navigate(`/cars-list?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /* ---------------- MOBILE MENU ANIMATION ---------------- */

  useEffect(() => {
    if (isMobileMenuOpen && !isClosing) {
      setDrawerSlideOpen(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setDrawerSlideOpen(true));
      });
      return () => cancelAnimationFrame(id);
    }
    if (!isMobileMenuOpen) setDrawerSlideOpen(false);
  }, [isMobileMenuOpen, isClosing]);

  const closeMobileMenu = () => {
    setIsClosing(true);
    setDrawerSlideOpen(false);
    const t = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 280);
    return () => clearTimeout(t);
  };

  const showOverlay = isMobileMenuOpen || isClosing;

  /* ---------------- NAV CONTENT ---------------- */

  const navContent = (
    <nav className="flex-1 p-4 py-6 space-y-8 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.title}>
          {/* Hide group title when sidebar is collapsed on desktop */}
          <h3
            className={`px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 transition-opacity duration-200 ${
              !isSidebarOpen ? "lg:opacity-0 lg:pointer-events-none" : ""
            }`}
          >
            {group.title}
          </h3>

          <div className="space-y-1">
            {group.items.map(({ to, label, icon: Icon }) => {
              const isActive =
                location.pathname === to ||
                (to !== "/" && location.pathname.startsWith(to));

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  title={!isSidebarOpen ? label : undefined}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  } ${!isSidebarOpen ? "lg:justify-center lg:px-2" : ""}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />

                  <span
                    className={`transition-all duration-200 ${
                      !isSidebarOpen ? "lg:hidden" : ""
                    }`}
                  >
                    {label}
                  </span>

                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900">

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              drawerSlideOpen && !isClosing ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          />

          {/* drawer */}
          <aside
            className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ${
              drawerSlideOpen && !isClosing ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* drawer header */}
            <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 shrink-0">
              <span className="text-lg font-bold text-slate-900">Menu</span>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {navContent}
          </aside>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      {/* FIX: was missing a space before the width class → "text-foregroundlg:w-64" */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-slate-200 lg:bg-white transition-[width] duration-300 ${
          isSidebarOpen ? "lg:w-64" : "lg:w-20"
        }`}
      >
        {/* sidebar logo + collapse toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0">
          <span
            className={`text-lg font-bold text-slate-900 transition-all duration-200 ${
              !isSidebarOpen ? "lg:hidden" : ""
            }`}
          >
            AutoResale
          </span>

          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-2 transition-colors rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            {isSidebarOpen ? (
              <HiOutlineChevronLeft className="w-5 h-5" />
            ) : (
              <HiOutlineChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {navContent}
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* ── TOPBAR ── */}
        {/* <header className="sticky top-0 z-40 flex items-center h-16 gap-3 px-4 bg-white border-b md:px-6 border-slate-200 shrink-0"> */}

          {/* hamburger — mobile only */}
          {/* <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden"
          >
            <HiOutlineMenuAlt2 className="w-5 h-5" />
          </button> */}

          {/* search bar */}
          {/* <div className="flex items-center flex-1 max-w-md gap-2 px-3 py-2 rounded-xl bg-slate-100">
            <HiOutlineSearch className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            )}
          </div> */}

          {/* right actions */}
          {/* <div className="flex items-center gap-1 ml-auto">
            <NotificationBell />

            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <HiOutlineUserCircle className="w-5 h-5" />
            </button>
          </div> */}
        {/* </header> */}

        {/* ── PAGE CONTENT ── */}
        {/* FIX: MobileBottomNav moved outside <main> so it doesn't interfere with scroll */}
        <main className="flex-1 p-4 pb-24 md:p-8 lg:pb-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* FIX: MobileBottomNav is now a sibling to main, not nested inside it */}
        <MobileBottomNav />
      </div>
    </div>
  );
}