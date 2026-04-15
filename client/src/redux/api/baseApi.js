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

  // ✅ Only retry once using meta flag (NOT args)
  if (result?.error?.status === 401 && !extraOptions?.alreadyRetried) {
    const refreshResult = await rawBaseQuery(
      { url: "/users/refreshtoken", method: "POST" },
      api,
      extraOptions
    );

    // ❌ refresh failed → logout + cleanup
    if (refreshResult?.error) {
      api.dispatch(logout());

      // 🔥 VERY IMPORTANT: disconnect socket
      if (typeof window !== "undefined") {
        const socket = window.__socket;
        socket?.disconnect?.();
      }

      return result;
    }

    // ✅ retry request safely
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