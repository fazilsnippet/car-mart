import { useEffect, useMemo, useState } from "react";
import { useGetAllBookingsQuery } from "./bookingApi.js";

const STATUS_OPTIONS = ["", "NEW", "CONTACTED", "COMPLETED", "CANCELLED"];

const statusStyles = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminBookings() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 stable query params
  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      status,
      search: debouncedSearch,
    };
  }, [page, status, debouncedSearch]);

  const { data, isLoading, isFetching } =
    useGetAllBookingsQuery(queryParams);

  const bookings = data?.data?.bookings || [];
  const totalPages = data?.data?.pages || 1;

  return (
    <div className="space-y-5">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Bookings
        </h1>
        <p className="text-sm text-foreground/60">
          Manage customer bookings
        </p>
      </div>

      {/* 🔹 FILTERS */}
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or car..."
          className="w-full px-3 py-2 text-sm border rounded-lg sm:max-w-xs border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm border rounded-lg border-slate-200"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Status"}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 TABLE */}
      <div className="border rounded-2xl bg-background text-foreground border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-foreground/60">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-foreground/60">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-foreground/70">
                <tr>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Car</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t hover:bg-slate-50/50 transition"
                  >
                    {/* CUSTOMER */}
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {b.userId?.fullName || "—"}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {b.userId?.email}
                      </p>
                    </td>

                    {/* CAR */}
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {b.carId?.title || "—"}
                      </p>
                      <p className="text-xs text-foreground/60">
                        ₹ {b.carId?.price?.toLocaleString("en-IN")}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusStyles[b.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔹 PAGINATION */}
      <div className="flex items-center justify-between">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm border rounded-lg border-slate-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-foreground/70">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm border rounded-lg border-slate-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 🔹 FETCHING INDICATOR */}
      {isFetching && (
        <p className="text-xs text-foreground/50">
          Updating...
        </p>
      )}
    </div>
  );
}