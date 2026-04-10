import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineCog
} from "react-icons/hi";

export default function UserSidebar() {
  const location = useLocation();

  const navItems = [
    {
      label: "Wishlist",
      to: "/wishlist",
      icon: HiOutlineHeart,
    },
    {
      label: "My Bookings",
      to: "/myBooking",
      icon: HiOutlineTruck,
    },
    // {
    //   label: "Settings",
    //   to: "/settings", // make sure route exists
    //   icon: HiOutlineCog,
    // },
  ];

  return (
    <aside className="hidden border-r lg:flex lg:flex-col lg:w-64 bg-background text-foreground">

      {/* TITLE */}
      <div className="flex items-center h-16 px-6 border-b">
        <h2 className="text-lg font-semibold">My Account</h2>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ label, to, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER (optional future use) */}
      <div className="p-4 text-xs border-t text-slate-400">
        © CarMart
      </div>
    </aside>
  );
}