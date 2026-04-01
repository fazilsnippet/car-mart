// import { useState, useEffect } from "react";
// import { Outlet, Link, useLocation ,useNavigate } from "react-router-dom";
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
//   HiOutlineX,
// } from "react-icons/hi";


// const navGroups = [
//   {
//     title: "Explore",
//     items: [
//       { to: "/", label: "Home", icon: HiOutlineViewGrid },
//       { to: "/cars-list", label: "Browse Cars", icon: HiOutlineViewList },
//       { to: "/brandList", label: "Brands", icon: HiOutlineClipboardList },
//     ],
//   },
//   {
//     title: "My activity",
//     items: [
//       { to: "/booking", label: "My Bookings", icon: HiOutlineTruck },
//     ],
//   },
// ];

// export default function DashboardLayout() {
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [drawerSlideOpen, setDrawerSlideOpen] = useState(false);
//   const navigate = useNavigate();

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

//   const navContent = (
//     <>
//       <nav className="flex-1 p-4 py-6 space-y-8 overflow-y-auto">
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
//       <div className="p-4 space-y-1 border-t border-slate-100">
//         <Link
//           to="/settings"
//           onClick={closeMobileMenu}
//           className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
//         >
//           <HiOutlineCog className="w-5 h-5 shrink-0" />
//           Settings
//         </Link>
//         <button
//           type="button"
//           className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer text-left"
//         >
//           <HiOutlineQuestionMarkCircle className="w-5 h-5 shrink-0" />
//           Help Center
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div className="flex min-h-screen font-sans bg-slate-50/50 text-slate-900">
//       {/* Mobile menu overlay */}
//       {showOverlay && (
//         <div
//           className="fixed inset-0 z-50 lg:hidden"
//           aria-hidden="true"
//         >
//           <div
//             className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
//               drawerSlideOpen && !isClosing ? "opacity-100" : "opacity-0"
//             }`}
//             onClick={closeMobileMenu}
//             aria-label="Close menu"
//           />
//           <aside
//             className={`absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-out ${
//               drawerSlideOpen && !isClosing ? "translate-x-0" : "-translate-x-full"
//             }`}
//           >
//             <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
//               <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
//                 <div className="flex items-center justify-center bg-indigo-600 rounded-lg shadow-lg w-9 h-9 shadow-indigo-200">
//                   <HiOutlineTruck className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xl font-bold tracking-tight text-slate-800">
//                   Car<span className="text-indigo-600">Mart</span>
//                 </span>
//               </Link>
//               <button
//                 type="button"
//                 onClick={closeMobileMenu}
//                 className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
//                 aria-label="Close menu"
//               >
//                 <HiOutlineX className="w-6 h-6" />
//               </button>
//             </div>
//             {navContent}
//           </aside>
//         </div>
//       )}

//       {/* Desktop sidebar - hidden on small screens */}
//       <aside
//         className={`hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:z-40 lg:border-r lg:border-slate-200 lg:bg-white lg:overflow-hidden lg:transition-[width] lg:duration-300 lg:ease-in-out ${
//           isSidebarOpen ? "lg:w-64" : "lg:w-20"
//         }`}
//       >
//         {/* Brand Header */}
//         <div className="flex items-center h-16 min-w-0 px-6 border-b border-slate-100 shrink-0">
//           <Link to="/" className="flex items-center min-w-0 gap-3 group">
//             <div className="flex items-center justify-center transition-transform duration-200 bg-indigo-600 rounded-lg shadow-lg w-9 h-9 shadow-indigo-200 group-hover:scale-110 shrink-0">
//               <HiOutlineTruck className="w-5 h-5 text-white" />
//             </div>
//             <span
//               className={`text-xl font-bold tracking-tight text-slate-800 overflow-hidden transition-opacity duration-300 ${
//                 isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
//               }`}
//             >
//               Car<span className="text-indigo-600">Mart</span>
//             </span>
//           </Link>
//         </div>

//         {/* Navigation Groups */}
//         <nav className="flex-1 p-4 py-6 space-y-8 overflow-x-hidden overflow-y-auto">
//           {navGroups.map((group) => (
//             <div key={group.title} className="min-w-0">
//               <h3
//                 className={`px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 overflow-hidden transition-opacity duration-300 ${
//                   isSidebarOpen ? "opacity-100" : "opacity-0 h-0 mb-0"
//                 }`}
//               >
//                 {group.title}
//               </h3>
//               <div className="space-y-1">
//                 {group.items.map(({ to, label, icon: Icon }) => {
//                   const isActive =
//                     location.pathname === to ||
//                     (to !== "/" && location.pathname.startsWith(to));
//                   return (
//                     <Link
//                       key={to}
//                       to={to}
//                       title={!isSidebarOpen ? label : ""}
//                       className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-w-0 ${
//                         isActive
//                           ? "bg-indigo-50 text-indigo-700"
//                           : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//                       }`}
//                     >
//                       <Icon
//                         className={`w-5 h-5 shrink-0 ${
//                           isActive ? "text-indigo-600" : "text-slate-400"
//                         }`}
//                       />
//                       <span
//                         className={`overflow-hidden transition-opacity duration-300 whitespace-nowrap ${
//                           isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
//                         }`}
//                       >
//                         {label}
//                       </span>
//                       {isActive && isSidebarOpen && (
//                         <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </nav>

//         {/* Sidebar Footer */}
//         <div className="min-w-0 p-4 space-y-1 border-t border-slate-100">
//           <Link
//             to="/settings"
//             className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 min-w-0"
//           >
//             <HiOutlineCog className="w-5 h-5 shrink-0" />
//             <span
//               className={`overflow-hidden transition-opacity duration-300 whitespace-nowrap ${
//                 isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
//               }`}
//             >
//               Settings
//             </span>
//           </Link>
//           <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer text-left min-w-0">
//             <HiOutlineQuestionMarkCircle className="w-5 h-5 shrink-0" />
//             <span
//               className={`overflow-hidden transition-opacity duration-300 whitespace-nowrap ${
//                 isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
//               }`}
//             >
//               Help Center
//             </span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-1 min-w-0 min-h-screen">
//         {/* Top Header */}
//         <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sm:px-6 lg:px-8">
//           <div className="flex items-center flex-1 min-w-0 gap-4">
//             {/* Mobile: open drawer. Desktop: collapse sidebar */}
//             <button
//               type="button"
//               onClick={() => setIsMobileMenuOpen((o) => !o)}
//               className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden shrink-0"
//               aria-label="Open menu"
//             >
//               <HiOutlineMenuAlt2 className="w-6 h-6" />
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsSidebarOpen((o) => !o)}
//               className="hidden p-2 rounded-lg lg:flex hover:bg-slate-100 text-slate-500 shrink-0"
//               aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
//             >
//               <HiOutlineMenuAlt2 className="w-5 h-5" />
//             </button>
//             <div className="relative hidden w-full max-w-md sm:block">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <HiOutlineSearch className="w-4 h-4 text-slate-400" />
//               </span>
//               <input
//                 type="text"
//                 placeholder="Search cars, brands..."
//                 className="block w-full py-2 pl-10 pr-3 text-sm transition-all duration-200 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <button className="relative p-2 transition-colors rounded-lg text-slate-500 hover:bg-slate-100">
//               <HiOutlineBell className="w-5 h-5" />
//               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
//             </button>
            
//             <div className="hidden w-px h-8 mx-1 bg-slate-200 sm:block"></div>
            
//             <button className="flex items-center gap-3 pl-2 group">
//               <div className="hidden text-right sm:block">
// <p
//   onClick={() => navigate("/myProfile")}
//   className="text-sm font-semibold leading-tight transition-colors cursor-pointer text-slate-800 hover:text-emerald-600"
// >
//   My Account
// </p>                <p className="text-[10px] text-slate-500">Profile & settings</p>
//               </div>
//               <div className="flex items-center justify-center overflow-hidden transition-colors border-2 border-white rounded-full shadow-sm w-9 h-9 bg-slate-200 group-hover:border-indigo-100">
//                 <HiOutlineUserCircle className="w-7 h-7 text-slate-400" />
//               </div>
//             </button>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 p-8">
//           <div className="mx-auto max-w-7xl">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineViewGrid,
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
} from "react-icons/hi";
import NotificationBell from "../redux/features/notification/notificationbell";
import logo from "../assets/carmartH.png";

const baseNavGroups = [
  {
    title: "Explore",
    items: [
      { to: "/", label: "Home", icon: HiOutlineViewGrid },
      { to: "/cars-list", label: "Browse Cars", icon: HiOutlineViewList },
      { to: "/brandList", label: "Brands", icon: HiOutlineClipboardList },
    ],
  },
  {
    title: "My activity",
    items: [{ to: "/myBooking", label: "My Bookings", icon: HiOutlineTruck }],
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
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

  /* ---------------- NAVIGATION CONTENT ---------------- */

  const navContent = (
    <>
      <nav className="flex-1 p-4 py-6 space-y-8 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />

                    <span>{label}</span>

                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-100">
        <Link
          to="/settings"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
        >
          <HiOutlineCog className="w-5 h-5 shrink-0" />
          Settings
        </Link>

        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left">
          <HiOutlineQuestionMarkCircle className="w-5 h-5 shrink-0" />
          Help Center
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen font-sans bg-slate-50/50 text-slate-900">

      {/* MOBILE MENU */}

      {showOverlay && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              drawerSlideOpen && !isClosing ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          />

          <aside
            className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ${
              drawerSlideOpen && !isClosing
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* SIDEBAR */}

      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-slate-200 lg:bg-white transition-[width] duration-300 ${
          isSidebarOpen ? "lg:w-64" : "lg:w-20"
        }`}
      >
        <div className="flex items-center h-16 px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            {/* <div className="flex items-center justify-center bg-indigo-600 rounded-lg w-9 h-9">
              <HiOutlineTruck className="w-5 h-5 text-white" />
            </div> */}

           <img
  src={logo}
  alt="CarMart"
  className={`h-9 pl-4 transition-all duration-300 ${
    isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
  }`}
/>
          </Link>
        </div>

        {navContent}
      </aside>

      {/* MAIN AREA */}

      <div className="flex flex-col flex-1 min-h-screen">

        {/* HEADER */}

        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b bg-white/80 backdrop-blur-md">

          <div className="flex items-center flex-1 gap-4">

            <button
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="lg:hidden"
            >
              <HiOutlineMenuAlt2 className="w-6 h-6" />
            </button>

            {/* SEARCH */}

            <div className="relative hidden w-full max-w-md sm:block">

              <span
                onClick={handleSearch}
                className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              >
                <HiOutlineSearch className="w-4 h-4 text-slate-400" />
              </span>

              <input
                type="text"
                placeholder="Search cars, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full py-2 pl-10 pr-3 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/20"
              />

            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="hidden items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:inline-flex"
              >
                <HiOutlineShieldCheck className="w-4 h-4" />
                Admin Center
              </button>
            )}

            <button className="relative p-2 rounded-lg hover:bg-slate-100">
                   <NotificationBell  className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/myProfile")}
              className="flex items-center gap-3"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">My Account</p>
                <p className="text-[10px] text-slate-500">
                  {isAdmin ? "Admin & profile access" : "Profile & settings"}
                </p>
              </div>

              <div className="flex items-center justify-center rounded-full w-9 h-9 bg-slate-200">
                <HiOutlineUserCircle className="w-7 h-7 text-slate-400" />
              </div>
            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
