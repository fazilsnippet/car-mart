import { baseApi } from "../../api/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/booking/my?page=${page}&limit=${limit}`,
      providesTags: ["Booking"],
    }),

    createBooking: builder.mutation({
      query: (data) => ({
        url: "/booking",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),
  updateBooking: builder.mutation({
  query: ({ id, type }) => ({
    url: `/booking/${id}`,
    method: "PATCH",
    body: { type }, // ✅ ONLY send type
  }),
  invalidatesTags: ["Booking"],
}),
  }),
});

export const {
  useGetBookingsQuery,
  useUpdateBookingMutation,
  
  useCreateBookingMutation,
} = bookingApi;
