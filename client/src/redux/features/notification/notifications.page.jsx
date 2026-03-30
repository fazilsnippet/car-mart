import {
  useGetNotificationsQuery,
  useMarkAsReadMutation
} from "./notificationApi.js";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const navigate = useNavigate();

  const notifications = data?.data || [];

  const handleClick = async (n) => {
    await markAsRead(n._id);

    if (n.type === "new-message") {
      navigate("/chat");
    } else if (n.data?.carId) {
      navigate(`/cars/${n.data.carId}`);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClick(n)}
              className={`p-4 rounded-xl shadow cursor-pointer transition ${
                n.read ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{n.title}</p>
                {!n.read && (
                  <span className="text-xs text-blue-600 font-medium">
                    NEW
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1">{n.message}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}