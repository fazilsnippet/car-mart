import { baseApi } from "../../api/baseApi";

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
getCars: builder.query({
  query: (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== "" && v !== null && v !== undefined) {
            searchParams.append(key, v);
          }
        });
      } else {
        searchParams.append(key, value);
      }
    });

    return { url: `/car?${searchParams.toString()}` };
  },


      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Car",
                id: _id
              })),
              { type: "Car", id: "LIST" }
            ]
          : [{ type: "Car", id: "LIST" }]
    }),
getCarBySlug: builder.query({
  query: (slug) => `/car/slug/${slug}`,
  transformResponse: (response) => response.data,
}),

    createCar: builder.mutation({
      query: (formData) => ({
        url: "/car",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Car"],
    }),
   markCarAsSold: builder.mutation({
  query: (carId) => ({
    url: `/cars/${carId}/sell`,
    method: "PATCH",
  }),

  async onQueryStarted(carId, { dispatch, queryFulfilled }) {

    // ✅ Safe: update only single car cache
    const patchCar = dispatch(
      carApi.util.updateQueryData("getCarById", carId, (draft) => {
        if (draft) {
          draft.lifecycleStatus = "SOLD";
        }
      })
    );

    try {
      await queryFulfilled;
    } catch {
      patchCar.undo();
    }
  },

  // ✅ Let server be source of truth for lists
  invalidatesTags: (result, error, carId) => [
    { type: "Car", id: carId },
    { type: "Car", id: "LIST" },
    { type: "Wishlist", id: "LIST" },
  ],
}),
  }),
});

export const {
  useGetCarsQuery,
  useCreateCarMutation,
  useGetCarBySlugQuery,
  useMarkCarAsSoldMutation,
} = carApi;
