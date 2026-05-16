


import {
  Home,
  MessageCircle,
  Plus,
  Heart,
  User,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: MessageCircle,
      label: "Chat",
      path: "/chat",
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
    },
    {
      icon: User,
      label: "Profile",
      path: "/myProfile",
      auth: true,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      <div
        className="
          relative
          flex items-center justify-between
          px-6
          pt-2
          pb-3
          bg-white
          border-t
          shadow-[0_-2px_10px_rgba(0,0,0,0.06)]
        "
      >
        {/* LEFT ITEMS */}
        <div className="flex items-center justify-between flex-1">
          {navItems.slice(0, 2).map((item, i) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-1"
              >
                <Icon
                  size={22}
                  strokeWidth={2.2}
                  className={
                    isActive
                      ? "text-black"
                      : "text-gray-400"
                  }
                />

                <span
                  className={`text-[11px] font-medium ${
                    isActive
                      ? "text-black"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* CENTER SPACE */}
        {/* <div className="w-20" /> */}
        <div className="w-27.5 shrink-0" />

        {/* RIGHT ITEMS */}
        <div className="flex items-center justify-between flex-1">
          {navItems.slice(2).map((item, i) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={i}
                onClick={() =>
                  navigate(
                    item.auth && !user
                      ? "/login"
                      : item.path
                  )
                }
                className="flex flex-col items-center justify-center gap-1"
              >
                <Icon
                  size={22}
                  strokeWidth={2.2}
                  className={
                    isActive
                      ? "text-black"
                      : "text-gray-400"
                  }
                />

                <span
                  className={`text-[11px] font-medium ${
                    isActive
                      ? "text-black"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* CENTER SELL BUTTON */}
        <button
          onClick={() => navigate("/sell-car")}
          className="
            absolute
            left-1/2
            -translate-x-1/2
            -top-5
            flex items-center justify-center
            w-16 h-16
            rounded-full
            bg-[#002f34]
            border-4 border-white
            shadow-lg
            active:scale-95
            transition
          "
        >
          <Plus
            size={30}
            strokeWidth={3}
            className="text-white"
          />
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;