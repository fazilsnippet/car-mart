import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8001/api",
  credentials: "include", // ensures cookies are sent/received
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // attempt refresh — backend should refresh via cookies automatically
    const refreshResult = await baseQuery(
      { url: "/users/refreshtoken", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.error) {
      // refresh failed, log out
      api.dispatch(logout());
    } else {
      // retry original request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Brand", "Car", "Booking", "User", "RecentlyViewed"],
  endpoints: () => ({}),
});
