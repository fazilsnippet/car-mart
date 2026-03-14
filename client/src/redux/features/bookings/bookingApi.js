import { baseApi } from "../../api/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/booking",
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
  }),
});

export const {
  useGetBookingsQuery,
  useCreateBookingMutation,
} = bookingApi;
