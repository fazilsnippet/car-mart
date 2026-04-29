import { useEffect, useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useToggleBanUserMutation,
} from "./userApi.js";

const FILTERS = ["all", "active", "banned"];

const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  banned: "bg-red-100 text-red-700",
};

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      filter,
      search: debouncedSearch,
    };
  }, [page, filter, debouncedSearch]);

  const { data, isLoading, isFetching } =
    useGetAllUsersQuery(queryParams);

  const [toggleBanUser, { isLoading: toggling }] =
    useToggleBanUserMutation();

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};
  const counts = data?.data?.counts || {};

  const totalPages = pagination.totalPages || 1;

  const handleToggleBan = async (user) => {
    const confirm = window.confirm(
      `${user.isBanned ? "Unban" : "Ban"} this user?`
    );
    if (!confirm) return;

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
    <div className="space-y-5">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Users
        </h1>
        <p className="text-sm text-foreground/60">
          Manage platform users
        </p>
      </div>

      {/* 🔹 STATS */}
      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="p-4 border rounded-xl bg-background">
          <p className="text-sm text-foreground/60">Total Users</p>
          <p className="text-lg font-semibold">
            {counts.totalUsers || 0}
          </p>
        </div>

        <div className="p-4 border rounded-xl bg-background">
          <p className="text-sm text-foreground/60">Banned</p>
          <p className="text-lg font-semibold text-red-600">
            {counts.bannedUsers || 0}
          </p>
        </div>
      </div>

      {/* 🔹 FILTERS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2 text-sm border rounded-lg sm:max-w-xs border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-2 text-sm rounded-lg capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 text-foreground/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 TABLE */}
      <div className="border rounded-2xl bg-background text-foreground border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-foreground/60">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-foreground/60">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-foreground/70">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isBanned = user.isBanned;

                  return (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-slate-50/50 transition"
                    >
                      {/* USER */}
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {user.fullName || user.userName}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {user.email}
                        </p>
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3 capitalize">
                        {user.role}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isBanned
                              ? statusStyles.banned
                              : statusStyles.active
                          }`}
                        >
                          {isBanned ? "BANNED" : "ACTIVE"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleBan(user)}
                          disabled={toggling || user.role === "ADMIN"}
                          className={`px-3 py-1 text-xs font-medium text-white rounded-lg ${
                            isBanned
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-red-500 hover:bg-red-600"
                          } ${
                            user.role === "ADMIN"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* 🔹 FETCHING */}
      {isFetching && (
        <p className="text-xs text-foreground/50">
          Updating...
        </p>
      )}
    </div>
  );
}