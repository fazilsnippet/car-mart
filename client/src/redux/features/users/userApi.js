import { baseApi } from "../../api/baseApi";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return;
    searchParams.append(key, value);
  });

  return searchParams.toString();
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/mount",
      providesTags: ["User"],
    }),

    getUserProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: (params = {}) => {
        const queryString = buildQueryString(params);
        return `/users/all${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["User"],
    }),

    refreshAccessToken: builder.mutation({
      query: () => ({
        url: "/users/refreshtoken",
        method: "POST",
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/changepassword",
        method: "PATCH",
        body: data,
      }),
    }),

    updateAccountDetails: builder.mutation({
      query: ({ fullName, avatar }) => {
        const formData = new FormData();
        formData.append("fullName", fullName);
        if (avatar) formData.append("avatar", avatar);

        return {
          url: "/users/updateaccount",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    toggleBanUser: builder.mutation({
      query: ({ userId, isBanned }) => ({
        url: `/users/ban/${userId}`,
        method: "PATCH",
        body: { isBanned },
      }),
      invalidatesTags: ["User"],
    }),

    addRecentlyViewedCar: builder.mutation({
      query: (carId) => ({
        url: `/users/recentlyviewed/${carId}`,
        method: "POST",
      }),
      invalidatesTags: ["RecentlyViewed"],
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/users/forgotPassword",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "/otp/forgot/resetpassword",
        method: "POST",
        body: { email, otp, newPassword },
      }),
    }),

    getRecentlyViewedCars: builder.query({
      query: () => "/users/recentlyviewedcars",
      providesTags: ["RecentlyViewed"],
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useToggleBanUserMutation,
  useRefreshAccessTokenMutation,
  useChangePasswordMutation,
  useUpdateAccountDetailsMutation,
  useAddRecentlyViewedCarMutation,
  useGetRecentlyViewedCarsQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
} = userApi;
