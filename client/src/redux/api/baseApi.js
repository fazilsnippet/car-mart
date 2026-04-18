import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const API_URL =
  import.meta.env.VITE_API_URL ?? import.meta.env.REACT_APP_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL || "",
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // 🚨 Detect offline OR network failure AFTER request
  if (result?.error?.status === "FETCH_ERROR") {
    const isOffline =
      typeof navigator !== "undefined" && !navigator.onLine;

    return {
      error: {
        status: isOffline ? "OFFLINE" : "NETWORK_ERROR",
        message: isOffline
          ? "No internet connection"
          : "Server unreachable",
      },
    };
  }

  // ✅ 401 refresh logic
  if (result?.error?.status === 401 && !extraOptions?.alreadyRetried) {
    const refreshResult = await rawBaseQuery(
      { url: "/users/refreshtoken", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.error) {
      api.dispatch(logout());

      if (typeof window !== "undefined") {
        const socket = window.__socket;
        socket?.disconnect?.();
      }

      return result;
    }

    result = await rawBaseQuery(args, api, {
      ...extraOptions,
      alreadyRetried: true,
    });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Brand",
    "Car",
    "Booking",
    "User",
    "RecentlyViewed",
    "Notification",
    "Conversation",
    "Message",
    "Wishlist",
  ],
  endpoints: () => ({}),
});