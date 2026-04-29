import { Outlet, useLocation } from "react-router-dom";

export default function ChatLayout() {
  const location = useLocation();

  // Detect if we're inside a conversation route (optional pattern)
  const isChatOpen = location.pathname.includes("/chat/");

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-50">

      {/* LEFT: CONVERSATION LIST */}
      <div
        className={`
          w-full md:w-[35%] lg:w-[30%]
          border-r border-gray-200
          bg-white
          flex flex-col
          transition-all duration-300
          ${isChatOpen ? "hidden md:flex" : "flex"}
        `}
      >
        <Outlet context={{ panel: "list" }} />
      </div>

      {/* RIGHT: CHAT WINDOW */}
      <div
        className={`
          w-full md:flex-1
          flex flex-col
          bg-white
          transition-all duration-300
          ${!isChatOpen ? "hidden md:flex" : "flex"}
        `}
      >
        <Outlet context={{ panel: "chat" }} />
      </div>
    </div>
  );
}