import { Home, MessageCircle, PlusCircle, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { icon: Home, path: "/" },
    { icon: MessageCircle, path: "/chat" },
    { icon: PlusCircle, path: "/sell-car" },
    { icon: Heart, path: "/wishlist" },
    { icon: User, path: "/myProfile", auth: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full border-t z-60 bg-background md:hidden">
  <div className="flex justify-around h-16">
    {navItems.map((item, i) => {
      if (item.auth && !user) return null;

      const ActiveIcon = item.icon;
      const isActive = location.pathname === item.path;

      return (
        <button
          key={i}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-xs ${
            isActive ? "text-orange-500" : "text-gray-500"
          }`}
        >
          <ActiveIcon size={24} />
        </button>
      );
    })}
  </div>
</div>

  );
};

export default MobileBottomNav;