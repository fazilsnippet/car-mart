import { useState, useRef, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation
} from "./notificationApi.js";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null); // 👈 NEW

  const { data } = useGetNotificationsQuery();
  const { data: countData } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.data || [];
  const unreadCount = countData?.count || 0;

  // 👇 OUTSIDE CLICK HANDLER
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = async (n) => {
    await markAsRead(n._id);

    if (n.type === "new-message") {
      navigate("/chat");
    } else if (n.data?.carId) {
      navigate(`/cars/${n.data.carId}`);
    }

    setOpen(false); // 👈 also close after clicking item (better UX)
  };

  return (
    <div ref={containerRef} className="relative">
      {/* 🔔 BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg hover:bg-slate-100"
      >
        <HiOutlineBell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📦 DROPDOWN */}
      {open && (
        <div className="absolute right-0 z-50 p-3 mt-2 overflow-y-auto bg-white shadow-lg w-80 rounded-xl max-h-96">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                  n.read ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
            ))
          )}

          <div
            onClick={() => {
              navigate("/notifications");
              setOpen(false); // 👈 close here too
            }}
            className="mt-2 text-sm text-center text-blue-600 cursor-pointer"
          >
            View All Notifications
          </div>
        </div>
      )}
    </div>
  );
}