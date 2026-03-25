import { baseApi } from "../../api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/mount",
    }),

 getUserProfile: builder.query({
  query: () => "/users/me",
  providesTags: ["User"],
}),

 

    // 🔹 Refresh Token (optional manual call)
    refreshAccessToken: builder.mutation({
      query: () => ({
        url: "/users/refreshtoken",
        method: "POST",
      }),
    }),

    // 🔹 Change Password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/changepassword",
        method: "PATCH",
        body: data,
      }),
    }),

    // 🔹 Update Account Details (with avatar support)
    updateAccountDetails: builder.mutation({
      query: ({ fullName, email, avatar }) => {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        if (avatar) formData.append("avatar", avatar);

        return {
          url: "/users/updateaccount",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

    // 🔹 Update Address
    // updateUserAddress: builder.mutation({
    //   query: (address) => ({
    //     url: "/users/update-address",
    //     method: "PATCH",
    //     body: { address },
    //   }),
    //   invalidatesTags: ["User"],
    // }),

    // 🔹 Add Recently Viewed Car
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

    // 🔐 Verify OTP + Reset Password
    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "/otp/forgot/resetpassword",
        method: "POST",
        body: { email, otp, newPassword },
      }),
    }),

    // 🔹 Get Recently Viewed Cars
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
  useRefreshAccessTokenMutation,
  useChangePasswordMutation,
  useUpdateAccountDetailsMutation,
  useAddRecentlyViewedCarMutation,
  useGetRecentlyViewedCarsQuery,
  useGetMeQuery,
} = userApi;
