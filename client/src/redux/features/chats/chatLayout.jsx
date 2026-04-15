import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="flex h-[calc(100vh-60px)]">

      {/* LEFT PANEL */}
      <div className="w-1/3 overflow-y-auto border-r">
        <Outlet context={{ panel: "list" }} />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col flex-1">
        <Outlet context={{ panel: "chat" }} />
      </div>

    </div>
  );
}