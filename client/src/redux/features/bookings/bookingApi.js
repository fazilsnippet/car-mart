import { baseApi } from "../../api/baseApi";

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return;
    searchParams.append(key, value);
  });

  return searchParams.toString();
};


export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/booking/my?page=${page}&limit=${limit}`,
      providesTags: ["Booking"],
    }),

    getAllBookings: builder.query({
      query: (params = {}) => {
        const queryString = buildQueryString(params);
        return `/booking${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      query: (id) => `/booking/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }, "Booking"],
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
        body: { type },
      }),
      invalidatesTags: ["Booking"],
    }),

    assignBooking: builder.mutation({
      query: ({ id, adminId }) => ({
        url: `/booking/${id}/assign`,
        method: "PUT",
        body: { adminId },
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useAssignBookingMutation,
  useCreateBookingMutation,
} = bookingApi;
