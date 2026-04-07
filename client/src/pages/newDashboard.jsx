import { lazy, Suspense, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineArrowRight } from "react-icons/hi";

// 🔹 Lazy-loaded modules
const AdminBookings = lazy(() => import("../redux/features/bookings/adminBookings.jsx"));
const AdminCars = lazy(() => import("../redux/features/cars/carList.jsx"));
const AdminUsers = lazy(() => import("../redux/features/users/allUsers.jsx"));
const AdminChatPage = lazy(() => import("../redux/features/chats/adminChatPage.jsx"));
const AdminBrands = lazy(() => import("../redux/features/brands/adminBrand.jsx"));

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings", admin: true },
  { key: "cars", label: "Cars", admin: true },
  { key: "users", label: "Users", admin: true },
  { key: "chat", label: "Chats", admin: true },
  { key: "brands", label: "Brands", admin: true },
];

// 🔹 Component map (clean pattern)
const TAB_COMPONENTS = {
  bookings: AdminBookings,
  cars: AdminCars,
  users: AdminUsers,
  chat: AdminChatPage,
  brands: AdminBrands,
};

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        active ? "bg-slate-900 text-white" : "bg-white border text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function Loading() {
  return <div className="py-10 text-sm text-slate-500">Loading...</div>;
}

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Correct useMemo (this is a good use-case)
  const visibleTabs = useMemo(() => {
    return TABS.filter((tab) => (tab.admin ? isAdmin : true));
  }, [isAdmin]);

  // ✅ Clean renderer (no misuse of useMemo)
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.fullName || user?.userName}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? "Manage your platform efficiently"
              : "Explore latest car listings"}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("bookings")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-slate-900"
          >
            Quick Actions <HiOutlineArrowRight />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {visibleTabs.map((tab) => (
          <TabButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Content */}
      <div className="p-5 bg-white border rounded-2xl border-slate-200">
        {activeTab === "overview" ? (
          <div className="text-sm text-slate-500">
            Overview content
          </div>
        ) : ActiveComponent ? (
          <Suspense fallback={<Loading />}>
            <ActiveComponent />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}