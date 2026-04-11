import { baseApi } from "../../api/baseApi";

const toCarFormData = (data, { includePrice = true } = {}) => {
  if (data instanceof FormData) return data;

  const formData = new FormData();

  // 🔥 FIX features → always array
  const formattedFeatures =
    typeof data.features === "string"
      ? data.features.split(",").map(f => f.trim()).filter(Boolean)
      : data.features;

  // 🔥 FIX location → ensure nested object
  const location =
    data.location ||
    (data.city || data.state
      ? {
          city: data.city,
          state: data.state
        }
      : undefined);

  // 🔥 Build payload
  const payload = {
    ...data,
    features: formattedFeatures,
    location
  };

  // ❌ remove root-level city/state (important)
  delete payload.city;
  delete payload.state;

  if (!includePrice) {
    delete payload.price;
  }

  // 🔥 Separate images
  const images = payload.images || [];
  delete payload.images;

  // 🔥 Remove empty values
  Object.keys(payload).forEach((key) => {
    const value = payload[key];
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete payload[key];
    }
  });

  // 🔥 Send as ONE JSON field
  formData.append("data", JSON.stringify(payload));

  // 🔥 Append images
  if (Array.isArray(images)) {
    images.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });
  }

  return formData;
};

export const carApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   getCars: builder.query({
query: (params = {}) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== "" && value != null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          const filtered = value.filter((v) => v !== "" && v != null);
          return [key, filtered.join(",")]; // ✅ KEY FIX
        }
        return [key, value];
      })
  );

  return {
    url: "/car",
    params: cleanedParams,
  };
},

  // 🔥 Prevent unnecessary refetch
  serializeQueryArgs: ({ queryArgs }) => {
    return JSON.stringify(queryArgs);
  },

  providesTags: (result) =>
    result?.data
      ? [
          ...result.data.map(({ _id }) => ({
            type: "Car",
            id: _id,
          })),
          { type: "Car", id: "LIST" },
        ]
      : [{ type: "Car", id: "LIST" }],
}),

    getCarById: builder.query({
      query: (id) => `/car/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Car", id }],
    }),

    getCarBySlug: builder.query({
      query: (slug) => `/car/slug/${slug}`,
      transformResponse: (response) => response.data,
    }),

    createCar: builder.mutation({
      query: (carData) => ({
        url: "/car",
        method: "POST",
        body: toCarFormData(carData),
      }),
      invalidatesTags: [{ type: "Car", id: "LIST" }],
    }),

    updateCar: builder.mutation({
      query: ({ carId, ...carData }) => ({
        url: `/car/${carId}/update`,
        method: "PUT",
        body: toCarFormData(carData, { includePrice: false }),
      }),
      invalidatesTags: (result, error, { carId }) => [
        { type: "Car", id: carId },
        { type: "Car", id: "LIST" },
      ],
    }),

    updateCarPrice: builder.mutation({
      query: ({ carId, newPrice }) => ({
        url: "/car/update-price",
        method: "PATCH",
        body: { carId, newPrice },
      }),
      invalidatesTags: (result, error, { carId }) => [
        { type: "Car", id: carId },
        { type: "Car", id: "LIST" },
      ],
    }),

    markCarAsSold: builder.mutation({
      query: (carId) => ({
        url: `/car/${carId}/sell`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, carId) => [
        { type: "Car", id: carId },
        { type: "Car", id: "LIST" },
        { type: "Wishlist", id: "LIST" },
      ],
    }),

    deleteCar: builder.mutation({
      query: (carId) => ({
        url: `/car/${carId}/delete`,
        method: "DELETE",
      }),
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
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useUpdateCarPriceMutation,
  useDeleteCarMutation,
  useGetCarBySlugQuery,
  useMarkCarAsSoldMutation,
} = carApi;
