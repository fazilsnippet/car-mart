import { useEffect, useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useToggleBanUserMutation,
} from "./userApi.js";

const FILTERS = ["all", "active", "banned"];

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 memo query params
  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      filter,
      search: debouncedSearch,
    };
  }, [page, filter, debouncedSearch]);

  const { data, isLoading, isFetching } = useGetAllUsersQuery(queryParams);

  const [toggleBanUser, { isLoading: toggling }] =
    useToggleBanUserMutation();

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};
  const counts = data?.data?.counts || {};

  const totalPages = pagination.totalPages || 1;

  // 🔥 handle ban/unban
  const handleToggleBan = async (user) => {
    try {
      await toggleBanUser({
        userId: user._id,
        isBanned: !user.isBanned,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Top Stats (using your backend counts properly) */}
      <div className="flex gap-4">
        <div className="p-3 text-sm rounded-lg bg-slate-100">
          Total Users: {counts.totalUsers || 0}
        </div>
        <div className="p-3 text-sm rounded-lg bg-rose-100 text-rose-600">
          Banned: {counts.bannedUsers || 0}
        </div>
      </div>

      {/* 🔹 Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, username, email..."
          className="px-3 py-2 text-sm border rounded-lg border-slate-200"
        />

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-2 text-sm rounded-lg ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Table */}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-500">No users found.</p>
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
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.fullName || user.userName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </td>

                  <td className="px-4 py-3">{user.role}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.isBanned
                          ? "bg-rose-100 text-rose-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {user.isBanned ? "BANNED" : "ACTIVE"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleBan(user)}
                      disabled={toggling || user.role === "ADMIN"}
                      className={`px-3 py-1 text-xs text-white rounded ${
                        user.isBanned
                          ? "bg-emerald-600"
                          : "bg-rose-600"
                      } ${
                        user.role === "ADMIN"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
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
        <p className="text-xs text-slate-400">Refreshing...</p>
      )}
    </div>
  );
}