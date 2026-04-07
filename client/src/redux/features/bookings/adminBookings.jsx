import { useEffect, useMemo, useState } from "react";
import { useGetAllBookingsQuery } from "./bookingApi.js";

const STATUS_OPTIONS = ["", "NEW", "CONTACTED", "COMPLETED", "CANCELLED"];

export default function AdminBookings() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 debounce (important for performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 memoized params (prevents unnecessary refetch)
  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      status,
      search: debouncedSearch,
    };
  }, [page, status, debouncedSearch]);

  const { data, isLoading, isFetching } = useGetAllBookingsQuery(queryParams);

  const bookings = data?.data?.bookings || [];
  const totalPages = data?.data?.pages || 1;

  return (
    <div className="space-y-4">
      {/* 🔹 Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search message..."
          className="px-3 py-2 text-sm border rounded-lg border-slate-200"
        />

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

      {/* 🔹 Table */}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Car</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.userId?.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {b.userId?.email}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p>{b.carId?.title}</p>
                    <p className="text-xs text-slate-500">
                      ₹{b.carId?.price}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-slate-100">
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Pagination */}
      <div className="flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isFetching && (
        <p className="text-xs text-slate-400">Updating...</p>
      )}
    </div>
  );
}