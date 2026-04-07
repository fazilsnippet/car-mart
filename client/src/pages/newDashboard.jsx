import { lazy, Suspense, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineArrowRight } from "react-icons/hi";

// 🔹 Lazy-loaded modules
const AdminBookings = lazy(() => import("./modules/bookings/AdminBookings"));
const AdminCars = lazy(() => import("./modules/cars/AdminCars"));
const AdminUsers = lazy(() => import("./modules/users/AdminUsers"));
const AdminWishlist = lazy(() => import("./modules/wishlist/AdminWishlist"));
const AdminChats = lazy(() => import("./modules/chats/AdminChats"));
const AdminBrands = lazy(() => import("./modules/brands/AdminBrands"));

const UserListings = lazy(() => import("./modules/user/UserListings"));

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings", admin: true },
  { key: "cars", label: "Cars", admin: true },
  { key: "users", label: "Users", admin: true },
  { key: "wishlist", label: "Wishlist", admin: true },
  { key: "chat", label: "Chats", admin: true },
  { key: "brands", label: "Brands", admin: true },
];

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

export default function newDashboard() {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const [activeTab, setActiveTab] = useState("overview");

  // 🔹 Memoized visible tabs
  const visibleTabs = useMemo(() => {
    return TABS.filter((tab) => (tab.admin ? isAdmin : true));
  }, [isAdmin]);

  // 🔹 Memoized tab renderer
  const renderTab = useMemo(() => {
    switch (activeTab) {
      case "bookings":
        return (
          <Suspense fallback={<Loading />}>
            <AdminBookings />
          </Suspense>
        );

      case "cars":
        return (
          <Suspense fallback={<Loading />}>
            <AdminCars />
          </Suspense>
        );

      case "users":
        return (
          <Suspense fallback={<Loading />}>
            <AdminUsers />
          </Suspense>
        );

      case "wishlist":
        return (
          <Suspense fallback={<Loading />}>
            <AdminWishlist />
          </Suspense>
        );

      case "chat":
        return (
          <Suspense fallback={<Loading />}>
            <AdminChats />
          </Suspense>
        );

      case "brands":
        return (
          <Suspense fallback={<Loading />}>
            <AdminBrands />
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<Loading />}>
            <UserListings />
          </Suspense>
        );
    }
  }, [activeTab]);

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
        {renderTab}
      </div>
    </div>
  );
}
