import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteCarMutation,
  useGetCarsQuery,
  useMarkCarAsSoldMutation,
  useUpdateCarPriceMutation,
} from "../redux/features/cars/carApi";
import {
  useAssignBookingMutation,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
} from "../redux/features/bookings/bookingApi";
import { useGetWishlistAdminQuery } from "../redux/features/wishlist/wishlistApi";
import {
  useGetAllUsersQuery,
  useToggleBanUserMutation,
} from "../redux/features/users/userApi";
import BrandCreation from "../redux/features/brands/brandCreation";
import ChatPage from "../redux/features/chats/chatPage";
import CarForm from "../redux/features/cars/CarForm";
import {
  HiOutlineArrowRight,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineUserCircle,
  HiOutlineViewGrid,
} from "react-icons/hi";

const ADMIN_TABS = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "Bookings" },
  { key: "cars", label: "Cars" },
  { key: "users", label: "Users" },
  { key: "wishlist", label: "Wishlist" },
  { key: "chatPage", label: "Chats" },
  {key: "brands", label: "Brands" },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
};

const getStatusClasses = (status) => {
  switch (status) {
    case "COMPLETED":
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "CONTACTED":
    case "SOLD":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    case "CANCELLED":
    case "INACTIVE_BY_CAR":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  }
};

function StatCard({ icon: Icon, label, value, helper, accent }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
      <div className={`h-1.5 w-full ${accent}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-500">{helper}</span>
        </div>
        <p className="text-sm text-slate-500">{label}</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

function SectionShell({ title, description, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [priceDrafts, setPriceDrafts] = useState({});
  const [feedback, setFeedback] = useState(null);

  const { data: carResponse, isLoading: carsLoading, refetch: refetchCars } = useGetCarsQuery({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    order: "desc",
  });
  const cars = carResponse?.data ?? [];
  const totalCars = carResponse?.total ?? 0;

  const { data: bookingsResponse, isLoading: bookingsLoading, refetch: refetchBookings } =
    useGetAllBookingsQuery({
      page: 1,
      limit: 20,
      status: bookingStatus,
      search: bookingSearch,
    });
  const bookings = bookingsResponse?.data?.bookings ?? [];
  const bookingTotal = bookingsResponse?.data?.total ?? 0;

  const { data: bookingDetailsResponse, isFetching: bookingDetailsLoading } =
    useGetBookingByIdQuery(selectedBookingId, {
      skip: !selectedBookingId,
    });
  const bookingDetails = bookingDetailsResponse?.data;

  const { data: wishlistResponse, isLoading: wishlistLoading } = useGetWishlistAdminQuery();
  const wishlistItems = wishlistResponse ?? [];

  const { data: usersResponse, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersQuery({
    filter: userFilter,
    search: userSearch,
    page: 1,
    limit: 20,
  });
  const users = usersResponse?.data?.users ?? [];
  const counts = usersResponse?.data?.counts ?? { totalUsers: 0, bannedUsers: 0 };

  const [assignBooking, { isLoading: assigningBooking }] = useAssignBookingMutation();
  const [updateCarPrice, { isLoading: updatingPrice }] = useUpdateCarPriceMutation();
  const [markCarAsSold, { isLoading: sellingCar }] = useMarkCarAsSoldMutation();
  const [deleteCar, { isLoading: deletingCar }] = useDeleteCarMutation();
  const [toggleBanUser, { isLoading: togglingBan }] = useToggleBanUserMutation();

  const activeWishlistCount = useMemo(
    () => wishlistItems.filter((item) => item.status === "ACTIVE").length,
    [wishlistItems]
  );

  const pushFeedback = (type, message) => setFeedback({ type, message });

  const handleAssignBooking = async (bookingId) => {
    try {
      await assignBooking({ id: bookingId, adminId: user?._id }).unwrap();
      pushFeedback("success", "Booking assigned successfully.");
      refetchBookings();
      setSelectedBookingId(bookingId);
    } catch (error) {
      pushFeedback("error", error?.data?.message || "Failed to assign booking.");
    }
  };

  const handlePriceUpdate = async (carId, fallbackPrice) => {
    const nextPrice = Number(priceDrafts[carId] ?? fallbackPrice);

    if (!nextPrice || nextPrice <= 0) {
      pushFeedback("error", "Enter a valid price before updating.");
      return;
    }

    try {
      await updateCarPrice({ carId, newPrice: nextPrice }).unwrap();
      pushFeedback("success", "Car price updated successfully.");
      setPriceDrafts((prev) => ({ ...prev, [carId]: "" }));
      refetchCars();
    } catch (error) {
      pushFeedback("error", error?.data?.message || "Failed to update car price.");
    }
  };

  const handleMarkSold = async (carId) => {
    if (!window.confirm("Mark this car as sold?")) return;

    try {
      await markCarAsSold(carId).unwrap();
      pushFeedback("success", "Car marked as sold.");
      refetchCars();
    } catch (error) {
      pushFeedback("error", error?.data?.message || "Failed to mark the car as sold.");
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Delete this car from active inventory?")) return;

    try {
      await deleteCar(carId).unwrap();
      pushFeedback("success", "Car removed from active inventory.");
      refetchCars();
      if (selectedCar?._id === carId) {
        setSelectedCar(null);
      }
    } catch (error) {
      pushFeedback("error", error?.data?.message || "Failed to delete the car.");
    }
  };

  const handleToggleBan = async (targetUser) => {
    try {
      await toggleBanUser({
        userId: targetUser._id,
        isBanned: !targetUser.isBanned,
      }).unwrap();
      pushFeedback(
        "success",
        `${targetUser.fullName || targetUser.userName} ${targetUser.isBanned ? "unbanned" : "banned"} successfully.`
      );
      refetchUsers();
    } catch (error) {
      pushFeedback("error", error?.data?.message || "Failed to update user status.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-950 via-slate-900 to-indigo-900 p-6 text-white shadow-[0_25px_80px_-35px_rgba(15,23,42,0.9)] sm:p-8">
        <div className="absolute w-40 h-40 rounded-full -right-12 -top-12 bg-indigo-400/20 blur-3xl" />
        <div className="absolute left-0 w-32 h-32 rounded-full -bottom-10 bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.5fr,1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100/90">
              Premium admin suite
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {user?.fullName || user?.userName}
            </h1>
            <p className="max-w-2xl mt-3 text-sm text-slate-300 sm:text-base">
              Review bookings, curate inventory, monitor wishlists, and manage access from a dedicated control center.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white rounded-full text-slate-900"
              >
                Open bookings <HiOutlineArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cars")}
                className="px-4 py-2 text-sm font-semibold border rounded-full border-white/20 text-white/90"
              >
                Manage inventory
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 border rounded-2xl border-white/10 bg-white/10 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Inventory</p>
              <p className="mt-2 text-2xl font-bold">{totalCars}</p>
            </div>
            <div className="p-4 border rounded-2xl border-white/10 bg-white/10 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Bookings</p>
              <p className="mt-2 text-2xl font-bold">{bookingTotal}</p>
            </div>
            <div className="p-4 border rounded-2xl border-white/10 bg-white/10 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Users</p>
              <p className="mt-2 text-2xl font-bold">{counts.totalUsers}</p>
            </div>
            <div className="p-4 border rounded-2xl border-white/10 bg-white/10 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Wishlists</p>
              <p className="mt-2 text-2xl font-bold">{activeWishlistCount}</p>
            </div>
          </div>
        </div>
      </section>

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={HiOutlineCollection}
          label="Active inventory"
          value={totalCars}
          helper="Live cars"
          accent="bg-gradient-to-r from-indigo-500 to-violet-500"
        />
        <StatCard
          icon={HiOutlineClipboardList}
          label="Total bookings"
          value={bookingTotal}
          helper="Requests"
          accent="bg-gradient-to-r from-sky-500 to-cyan-500"
        />
        <StatCard
          icon={HiOutlineShieldCheck}
          label="Banned users"
          value={counts.bannedUsers}
          helper="Restricted"
          accent="bg-gradient-to-r from-amber-500 to-orange-500"
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          label="Active wishlists"
          value={activeWishlistCount}
          helper="Saved interest"
          accent="bg-gradient-to-r from-emerald-500 to-teal-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-lg"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === "overview" || activeTab === "bookings") && (
        <SectionShell
          title="Booking management"
          description="Search requests, inspect booking details, and assign them instantly."
        >
          <div className="flex flex-col gap-2 mb-4 sm:flex-row">
            <input
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              placeholder="Search message"
              className="px-3 py-2 text-sm border rounded-xl border-slate-200"
            />
            <select
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="px-3 py-2 text-sm border rounded-xl border-slate-200"
            >
              <option value="">All statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {bookingsLoading ? (
            <p className="py-8 text-sm text-slate-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">No bookings found for the current filter.</p>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[1.55fr,1fr]">
              <div className="overflow-x-auto border rounded-2xl border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Car</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="align-top border-t border-slate-100">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{booking.userId?.fullName || "Unknown"}</p>
                          <p className="text-xs text-slate-500">{booking.userId?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{booking.carId?.title || "Car"}</p>
                          <p className="text-xs text-slate-500">{booking.bookingType}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingId(booking._id)}
                              className="px-3 py-1 text-xs font-semibold border rounded-lg border-slate-200 text-slate-700"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAssignBooking(booking._id)}
                              disabled={assigningBooking}
                              className="px-3 py-1 text-xs font-semibold text-white rounded-lg bg-slate-900"
                            >
                              Assign to me
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border rounded-2xl border-slate-200 bg-slate-50">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Selected booking
                </h3>
                {!selectedBookingId ? (
                  <p className="text-sm text-slate-500">Select a booking to inspect full details.</p>
                ) : bookingDetailsLoading ? (
                  <p className="text-sm text-slate-500">Loading details...</p>
                ) : bookingDetails ? (
                  <div className="space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-900">{bookingDetails.userId?.fullName}</p>
                      <p>{bookingDetails.userId?.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{bookingDetails.carId?.title}</p>
                      <p>{formatCurrency(bookingDetails.carId?.price)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-slate-500">Type</p>
                        <p>{bookingDetails.bookingType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Date</p>
                        <p>{formatDate(bookingDetails.preferredDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Message</p>
                      <p>{bookingDetails.message || "No message"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Handled by</p>
                      <p>{bookingDetails.handledBy?.fullName || "Not assigned"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Booking details unavailable.</p>
                )}
              </div>
            </div>
          )}
        </SectionShell>
      )}
{activeTab === "chatPage" && (
  <SectionShell
    title="chats"
    description="Mannage Messages."
  >
    <ChatPage />
  </SectionShell>
)}
      {(activeTab === "overview" || activeTab === "cars") && (
        <div className="grid gap-6 xl:grid-cols-[1.05fr,1.4fr]">
          <SectionShell
            title={selectedCar ? "Edit car details" : "Create new listing"}
            description={
              selectedCar
                ? "Update the vehicle details without changing the price."
                : "Add a fresh car listing to the active inventory."
            }
          >
            <CarForm
              mode={selectedCar ? "edit" : "create"}
              carId={selectedCar?._id}
              initialValues={selectedCar || {}}
              onSuccess={() => {
                pushFeedback("success", selectedCar ? "Car updated successfully." : "Car created successfully.");
                setSelectedCar(null);
                refetchCars();
              }}
            />
            {selectedCar && (
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="mt-3 text-sm font-semibold text-slate-600"
              >
                Cancel editing
              </button>
            )}
          </SectionShell>

          <SectionShell
            title="Inventory actions"
            description="Update prices, mark a car as sold, or remove it from the active catalog."
          >
            {carsLoading ? (
              <p className="py-8 text-sm text-slate-500">Loading cars...</p>
            ) : cars.length === 0 ? (
              <p className="py-8 text-sm text-slate-500">No active cars available.</p>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car._id} className="p-4 border rounded-2xl border-slate-200">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{car.title}</h3>
                        <p className="text-sm text-slate-500">
                          {car.variant} • {car.year} • {car.fuelType}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{formatCurrency(car.price)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCar(car)}
                          className="px-3 py-2 text-xs font-semibold border rounded-lg border-slate-200 text-slate-700"
                        >
                          Edit details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkSold(car._id)}
                          disabled={sellingCar}
                          className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                        >
                          Mark sold
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCar(car._id)}
                          disabled={deletingCar}
                          className="px-3 py-2 text-xs font-semibold text-white rounded-lg bg-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 sm:flex-row">
                      <input
                        type="number"
                        min="1"
                        value={priceDrafts[car._id] ?? car.price}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({ ...prev, [car._id]: e.target.value }))
                        }
                        className="px-3 py-2 text-sm border rounded-xl border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handlePriceUpdate(car._id, car.price)}
                        disabled={updatingPrice}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-slate-900"
                      >
                        Update price
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionShell>
        </div>
      )}

      {(activeTab === "overview" || activeTab === "users") && (
        <SectionShell
          title="User access control"
          description="Search members, filter banned users, and update access in one click."
        >
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users"
              className="px-3 py-2 text-sm border rounded-xl border-slate-200"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" },
                { label: "Banned", value: "banned" },
                { label: "Active", value: "active" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setUserFilter(item.value)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    userFilter === item.value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {usersLoading ? (
            <p className="py-8 text-sm text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-2xl border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((person) => (
                    <tr key={person._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{person.fullName || person.userName}</p>
                        <p className="text-xs text-slate-500">{person.email}</p>
                      </td>
                      <td className="px-4 py-3">{person.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            person.isBanned
                              ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          }`}
                        >
                          {person.isBanned ? "BANNED" : "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleBan(person)}
                          disabled={togglingBan || person.role === "ADMIN"}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                            person.isBanned ? "bg-emerald-600" : "bg-rose-600"
                          } ${person.role === "ADMIN" ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          {person.isBanned ? "Unban user" : "Ban user"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionShell>
      )}

{activeTab === "brands" && (
  <SectionShell
    title="Brand management"
    description="Create and manage car brands."
  >
    <BrandCreation />
  </SectionShell>
)}


      {(activeTab === "overview" || activeTab === "wishlist") && (
        <SectionShell
          title="Wishlist activity"
          description="Track saved cars and review items that became inactive after a status change."
        >
          {wishlistLoading ? (
            <p className="py-8 text-sm text-slate-500">Loading wishlist activity...</p>
          ) : wishlistItems.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">No wishlist records found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-2xl border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Car</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.slice(0, 20).map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{item.car?.title || "Unavailable car"}</p>
                      </td>
                      <td className="px-4 py-3">{formatCurrency(item.car?.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionShell>
      )}

      {activeTab === "overview" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-5 bg-white border shadow-sm rounded-3xl border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 text-indigo-600 rounded-2xl bg-indigo-50">
                <HiOutlineTruck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Fast booking response</h3>
                <p className="text-sm text-slate-500">Stay on top of new leads.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className="text-sm font-semibold text-indigo-600"
            >
              Review bookings →
            </button>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-3xl border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
                <HiOutlineViewGrid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Curate inventory</h3>
                <p className="text-sm text-slate-500">Edit listings with premium control.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("cars")}
              className="text-sm font-semibold text-sky-600"
            >
              Manage cars →
            </button>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-3xl border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <HiOutlineUserCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">User security</h3>
                <p className="text-sm text-slate-500">Moderate access with one click.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className="text-sm font-semibold text-emerald-600"
            >
              Open user controls →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
