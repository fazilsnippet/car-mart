// components/MobileBottomNav.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, MessageCircle, User, Menu } from "lucide-react";

const MobileBottomNav = ({ onOpenMore }) => {
  const { pathname } = useLocation();

  const navItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex flex-col items-center text-xs ${
        pathname === to ? "text-black font-semibold" : "text-gray-500"
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 z-50 flex items-center justify-around w-full h-16 bg-white border-t md:hidden">
      
      {navItem("/", <Home size={22} />, "Home")}
      {navItem("/chat", <MessageCircle size={22} />, "Chat")}
      {navItem("/myProfile", <User size={22} />, "Profile")}

      {/* More */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center text-gray-500"
      >
        <Menu size={22} />
        More
      </button>

    </div>
  );
};

export default MobileBottomNav;