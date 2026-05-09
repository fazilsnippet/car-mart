// import { Home, MessageCircle, PlusCircle, Heart, User } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// const MobileBottomNav = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useSelector((state) => state.auth);

// const navItems = [
//   { icon: Home, path: "/", size: 28 },
//   { icon: MessageCircle, path: "/chat", size: 28 },
//   { icon: PlusCircle, path: "/sell-car", size: 32 }, // maybe bigger for emphasis
//   { icon: Heart, path: "/wishlist", size: 28 },
//   { icon: User, path: "/myProfile", auth: true, size: 28 },
// ];

//   return (
//     <div className="fixed bottom-0 left-0 w-full border-t z-60 bg-background md:hidden">
//   <div className="flex justify-around h-16">
//     {navItems.map((item, i) => {
//       if (item.auth && !user) return null;

//       const ActiveIcon = item.icon;
//       const isActive = location.pathname === item.path;

//       return (
//         <button
//           key={i}
//           onClick={() => navigate(item.path)}
//           className={`flex flex-col items-center text-xs ${
//             isActive ? "text-orange-500" : "text-gray-500"
//           }`}
//         >
//           <ActiveIcon size={24} />
//         </button>
//       );
//     })}
//   </div>
// </div>

//   );
// };

// export default MobileBottomNav;

import {
  Home,
  MessageCircle,
  PlusCircle,
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
    { icon: Home, path: "/" },
    { icon: MessageCircle, path: "/chat" },
    { icon: PlusCircle, path: "/sell-car", special: true },
    { icon: Heart, path: "/wishlist" },
    { icon: User, path: "/myProfile", auth: true },
  ];

  return (
    <div
      className="
        fixed bottom-4 left-1/2
        -translate-x-1/2
        z-50
        w-[95%] max-w-md
        md:hidden
      "
    >
      <div
        className="
          relative
          flex items-center justify-around
          h-20
          rounded-[2rem]
          border border-color
          bg-background/90
          backdrop-blur-xl
          shadow-2xl
        "
      >
        {/* {navItems.map((item, i) => {
          if (item.auth && !user) return null;

          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          // CENTER FLOATING BUTTON
          if (item.special) {
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="absolute top-0 flex items-center justify-center w-20 h-20 text-white transition-transform duration-300 -translate-x-1/2 bg-orange-500 rounded-full shadow-xl left-1/2 -translate-y-1/3 ring-8 ring-background active:scale-95"
              >
                <Icon size={34} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 "
            >
              <Icon
                size={24}
                className={`
                  transition-all duration-300
                  ${
                    isActive
                      ? "text-orange-500 scale-110"
                      : "text-muted-foreground"
                  }
                `}
              />

              <span
                className={`
                  text-[11px] font-medium
                  transition-colors duration-300
                  ${
                    isActive
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  }
                `}
              >
                {item.path === "/"
                  ? "Home"
                  : item.path === "/chat"
                  ? "Chat"
                  : item.path === "/wishlist"
                  ? "Wishlist"
                  : "Profile"}
              </span>
            </button>
          );
        })} */}
        <div className="flex items-center justify-between w-full px-2">

  {/* LEFT SIDE */}
  <div className="flex items-center justify-around flex-1">
    {navItems.slice(0, 2).map((item, i) => {
      const Icon = item.icon;
      const isActive =
        location.pathname === item.path;

      return (
        <button
          key={i}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center gap-1 transition-all duration-300 "
        >
          <Icon
            size={24}
            className={
              isActive
                ? "text-indigo-700 scale-110"
                : "text-muted-foreground"
            }
          />

          <span
            className={`text-[11px] font-medium ${
              isActive
                ? "text-white"
                : "text-muted-foreground"
            }`}
          >
            {item.path === "/" ? "Home" : "Chat"}
          </span>
        </button>
      );
    })}
  </div>

  {/* CENTER GAP */}
  <div className="w-16"  />

  {/* RIGHT SIDE */}
  <div className="flex items-center justify-around flex-1">
    {navItems.slice(3).map((item, i) => {
      if (item.auth && !user) return null;

      const Icon = item.icon;

      const isActive =
        location.pathname === item.path;

      return (
        <button
          key={i}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center justify-center gap-1 transition-all duration-300 "
        >
          <Icon
            size={24}
            className={
              isActive
                ? "text-white scale-110"
                : "text-muted-foreground"
            }
          />

          <span
            className={`text-[11px] font-medium ${
              isActive
                ? "text-white"
                : "text-muted-foreground"
            }`}
          >
            {item.path === "/wishlist"
              ? "Wishlist"
              : "Profile"}
          </span>
        </button>
      );
    })}
  </div>

  {/* FLOATING BUTTON */}
  <button
    onClick={() => navigate("/sell-car")}
    className="absolute top-0 flex items-center justify-center w-16 h-16 text-white transition-transform duration-300 -translate-x-1/2 bg-indigo-600 rounded-full shadow-xl left-1/2 -translate-y-1/3 ring-2 ring-background active:scale-95"
  >
    <PlusCircle size={28} strokeWidth={2.5} />
  </button>
</div>
      </div>
    </div>
  );
};

export default MobileBottomNav;