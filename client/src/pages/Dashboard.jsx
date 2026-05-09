import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import CarCard from "../redux/features/cars/carCard";
import CarForm from "../redux/features/cars/CarForm";
import {
  HiOutlineTrendingUp,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineClipboardList,
  HiOutlineTruck,
} from "react-icons/hi";

const FUEL_SECTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const LISTINGS_PER_BLOCK = 6;
const LISTINGS_PER_FUEL = 4;
const ADMIN_TABS = ["overview", "bookings", "cars", "users", "wishlist"];

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
      return "bg-emerald-50 text-emerald-700";
    case "CONTACTED":
    case "SOLD":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
    case "INACTIVE_BY_CAR":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

function StatCard({ icon: Icon, label, value, helper, tone = "indigo" }) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${toneClasses[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs text-slate-500">{helper}</span>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function AdminDashboard({ user }) {
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

  const { data: bookingDetailsResponse, isFetching: bookingDetailsLoading } = useGetBookingByIdQuery(
    selectedBookingId,
    { skip: !selectedBookingId }
  );
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
    <div className="space-y-6 duration-700 animate-in fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin control center</h1>
          <p className="text-sm text-slate-500">
            Manage bookings, cars, wishlist activity, and users from one place.
          </p>
        </div>
        <div className="text-sm text-slate-500">Signed in as {user?.fullName || user?.userName}</div>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HiOutlineCollection} label="Active inventory" value={totalCars} helper="Cars live" tone="blue" />
        <StatCard icon={HiOutlineClipboardList} label="Total bookings" value={bookingTotal} helper="All requests" tone="indigo" />
        <StatCard icon={HiOutlineShieldCheck} label="Banned users" value={counts.bannedUsers} helper="Safety control" tone="amber" />
        <StatCard icon={HiOutlineCurrencyDollar} label="Active wishlists" value={activeWishlistCount} helper="Saved interest" tone="emerald" />
      </div>

      <div className="flex flex-wrap gap-2">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {(activeTab === "overview" || activeTab === "bookings") && (
        <section className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Bookings</h2>
              <p className="text-sm text-slate-500">Review requests, open details, and assign them.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search message"
                className="px-3 py-2 text-sm border rounded-lg border-slate-200"
              />
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
                className="px-3 py-2 text-sm border rounded-lg border-slate-200"
              >
                <option value="">All statuses</option>
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {bookingsLoading ? (
            <div className="py-8 text-sm text-slate-500">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-sm text-slate-500">No bookings found for the current filter.</div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[1.5fr,1fr]">
              <div className="overflow-x-auto border rounded-xl border-slate-200">
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
                      <tr key={booking._id} className="border-t border-slate-100">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{booking.userId?.fullName || "Unknown"}</div>
                          <div className="text-xs text-slate-500">{booking.userId?.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{booking.carId?.title || "Car"}</div>
                          <div className="text-xs text-slate-500">{booking.bookingType}</div>
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
                              className="px-3 py-1 text-xs font-medium border rounded-lg border-slate-200"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAssignBooking(booking._id)}
                              disabled={assigningBooking}
                              className="px-3 py-1 text-xs font-medium text-white rounded-lg bg-slate-900"
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

              <div className="p-4 border rounded-xl border-slate-200 bg-slate-50/70">
                <h3 className="mb-3 font-semibold text-slate-900">Booking details</h3>
                {!selectedBookingId ? (
                  <p className="text-sm text-slate-500">Select a booking to inspect full details.</p>
                ) : bookingDetailsLoading ? (
                  <p className="text-sm text-slate-500">Loading details...</p>
                ) : bookingDetails ? (
                  <div className="space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold">{bookingDetails.userId?.fullName}</p>
                      <p>{bookingDetails.userId?.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{bookingDetails.carId?.title}</p>
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
        </section>
      )}

      {(activeTab === "overview" || activeTab === "cars") && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedCar ? "Update car details" : "Create a new car"}
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              {selectedCar
                ? "Update car details without touching the price."
                : "Add a new vehicle to the active inventory."}
            </p>
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
                className="mt-3 text-sm font-medium text-slate-600"
              >
                Cancel editing
              </button>
            )}
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Inventory actions</h2>
                <p className="text-sm text-slate-500">Update price, mark sold, edit, or remove cars.</p>
              </div>
            </div>

            {carsLoading ? (
              <div className="py-8 text-sm text-slate-500">Loading cars...</div>
            ) : cars.length === 0 ? (
              <div className="py-8 text-sm text-slate-500">No active cars available.</div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <div key={car._id} className="p-4 border rounded-xl border-slate-200">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{car.title}</h3>
                        <p className="text-sm text-slate-500">
                          {car.variant} • {car.year} • {car.fuelType}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">{formatCurrency(car.price)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCar(car)}
                          className="px-3 py-2 text-xs font-medium border rounded-lg border-slate-200"
                        >
                          Edit details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkSold(car._id)}
                          disabled={sellingCar}
                          className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg"
                        >
                          Mark sold
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCar(car._id)}
                          disabled={deletingCar}
                          className="px-3 py-2 text-xs font-medium text-white rounded-lg bg-rose-600"
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
                        className="px-3 py-2 text-sm border rounded-lg border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handlePriceUpdate(car._id, car.price)}
                        disabled={updatingPrice}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-slate-900"
                      >
                        Update price
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {(activeTab === "overview" || activeTab === "users") && (
        <section className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Users</h2>
              <p className="text-sm text-slate-500">Filter banned users and toggle access.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users"
                className="px-3 py-2 text-sm border rounded-lg border-slate-200"
              />
              <div className="flex gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Banned", value: "banned" },
                  { label: "Active", value: "active" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setUserFilter(item.value)}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      userFilter === item.value
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 text-slate-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {usersLoading ? (
            <div className="py-8 text-sm text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-sm text-slate-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto border rounded-xl border-slate-200">
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
                        <div className="font-medium text-slate-800">{person.fullName || person.userName}</div>
                        <div className="text-xs text-slate-500">{person.email}</div>
                      </td>
                      <td className="px-4 py-3">{person.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            person.isBanned ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
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
                          className={`rounded-lg px-3 py-2 text-xs font-medium text-white ${
                            person.isBanned ? "bg-emerald-600" : "bg-rose-600"
                          } ${person.role === "ADMIN" ? "opacity-50 cursor-not-allowed" : ""}`}
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
        </section>
      )}

      {(activeTab === "overview" || activeTab === "wishlist") && (
        <section className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Wishlist overview</h2>
            <p className="text-sm text-slate-500">Monitor saved cars and inactive wishlist entries.</p>
          </div>

          {wishlistLoading ? (
            <div className="py-8 text-sm text-slate-500">Loading wishlist activity...</div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-8 text-sm text-slate-500">No wishlist records found.</div>
          ) : (
            <div className="overflow-x-auto border rounded-xl border-slate-200">
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
                        <div className="font-medium text-slate-800">{item.car?.title || "Unavailable car"}</div>
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
        </section>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const { data: newestResponse, isLoading: newestLoading } = useGetCarsQuery({
    page: 1,
    limit: 6,
    sortBy: "createdAt",
    order: "desc",
  });

  const newestListings = newestResponse?.data ?? [];

  const fuelQueries = FUEL_SECTIONS.map((fuel) =>
    useGetCarsQuery({
      fuelType: [fuel],
      page: 1,
      limit: LISTINGS_PER_FUEL,
    })
  );

  const byFuel = FUEL_SECTIONS.map((fuel, index) => ({
    fuel,
    list: fuelQueries[index].data?.data ?? [],
    loading: fuelQueries[index].isLoading,
  })).filter((section) => section.list.length > 0);

  return (
    <div className="space-y-10 duration-500 animate-in fade-in">
      {isAdmin && (
        <section className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-indigo-900 p-6 text-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                <HiOutlineShieldCheck className="w-4 h-4" />
                Admin access enabled
              </div>
              <h2 className="text-2xl font-bold">Your premium admin center is ready</h2>
              <p className="max-w-2xl mt-2 text-sm text-slate-300">
                Manage bookings, inventory, user access, and wishlist insights from the dedicated `/admin` workspace.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white rounded-full text-slate-900"
            >
              Open admin center <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Newest listings</h2>
            <p className="text-sm text-slate-500 mt-0.5">Recently added cars</p>
          </div>
          <button
            onClick={() => navigate("/cars-list")}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        </div>

        {newestLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(LISTINGS_PER_BLOCK)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : newestListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newestListings.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 rounded-xl bg-slate-50">
            No listings yet. Check back later.
          </div>
        )}
      </section>

      {byFuel.map(({ fuel, list, loading }) => (
        <section key={fuel}>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{fuel}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {list.length} listing{list.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <button
              onClick={() => navigate(`/cars-list?fuelType=${fuel}`)}
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(LISTINGS_PER_FUEL)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}