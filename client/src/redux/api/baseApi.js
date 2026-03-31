import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8001/api",
  credentials: "include", // 🔥 cookies only
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // normalize args
  const url = typeof args === "string" ? args : args.url;

  let result = await rawBaseQuery(args, api, extraOptions);

  // ❌ stop if already retried
  if (args?._retry) return result;

  // 🔥 handle 401 (only for protected routes)
  if (
    result?.error?.status === 401 &&
    !url.includes("/users/login") &&
    !url.includes("/users/refreshtoken") &&
    !url.includes("/users/me") &&
    !url.includes("/users/mount")
  ) {
    const refreshResult = await rawBaseQuery(
      { url: "/users/refreshtoken", method: "POST" },
      api,
      extraOptions
    );

    // ❌ refresh failed → logout + STOP
    if (refreshResult?.error) {
      api.dispatch(logout());
      return result;
    }

    // ✅ retry once
    result = await rawBaseQuery(
      { ...args, _retry: true },
      api,
      extraOptions
    );
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