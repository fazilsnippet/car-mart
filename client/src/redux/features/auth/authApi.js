import { baseApi } from "../../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

   sendSignupOtp: builder.mutation({
     query: (email) => ({ url: "/otp/signup/sendotp",
       method: "POST",
        body: { email }, 
      }), 
    }), 
   registerUser: builder.mutation({
     query: (formData) => ({ url: "/users/register",
       method: "POST",
        body: formData, 
        }), invalidatesTags: ["User"], 
      }), 
        getCurrentUser: builder.query({
           query: () => ({ url: "/users/me", 
             method: "GET", }), 
             providesTags: ["User"], 
            }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

       logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
          credentials: "include",
      }),
      invalidatesTags: ["User", "RecentlyViewed"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/users/refreshtoken",
        method: "POST",
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useSendSignupOtpMutation,
  useGetCurrentUserQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,

} = authApi;