// // src/redux/features/cars/carsApi.js
// import { baseApi } from "../../api/baseApi";

// export const carsApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
    
//     // =========================
//     // CREATE CAR
//     // =========================
//     createCarSell: builder.mutation({
//       query: (data) => {
//         const formData = new FormData();

//         Object.keys(data).forEach((key) => {
//           if (key === "images") return;

//           const value = data[key];

//           if (Array.isArray(value)) {
//             value.forEach((v) => formData.append(key, v));
//           } else {
//             formData.append(key, value);
//           }
//         });

//         if (data.images?.length > 0) {
//           data.images.forEach((file) => {
//             formData.append("images", file);
//           });
//         }

//         return {
//           url: "/carSell",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["CarSell"],
//     }),

//     // =========================
//     // GET ALL
//     // =========================
//     getCarsSell: builder.query({
//       query: (params = {}) => {
//         const query = new URLSearchParams();

//         Object.entries(params).forEach(([key, value]) => {
//           if (value !== undefined && value !== null && value !== "") {
//             query.append(key, value);
//           }
//         });

//         return `/carSell?${query.toString()}`;
//       },
//       providesTags: ["CarSell"],
//     }),

//     // =========================
//     // GET BY ID
//     // =========================
//     getCarSellById: builder.query({
//       query: (id) => `/carSell/${id}`,
//       providesTags: ["CarSell"],
//     }),

//     // =========================
//     // UPDATE
//     // =========================
//     updateCarSell: builder.mutation({
//       query: ({ id, images, ...data }) => {
//         const formData = new FormData();

//         Object.keys(data).forEach((key) => {
//           const value = data[key];

//           if (value === undefined || value === null) return;

//           if (Array.isArray(value)) {
//             value.forEach((v) => formData.append(key, v));
//           } else {
//             formData.append(key, value);
//           }
//         });

//         if (images?.length > 0) {
//           images.forEach((file) => {
//             formData.append("images", file);
//           });
//         }

//         return {
//           url: `/carSell/${id}`,
//           method: "PUT",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["CarSell"],
//     }),

//     // =========================
//     // DELETE
//     // =========================
//     deleteCarSell: builder.mutation({
//       query: (id) => ({
//         url: `/carSell/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["CarSell"],
//     }),

//     // =========================
//     // MY CARS
//     // =========================
//     getMyCars: builder.query({
//       query: ({ page = 1, limit = 10 } = {}) =>
//         `/carSell/my-listings?page=${page}&limit=${limit}`,
//       providesTags: ["CarSell"],
//     }),
//   }),

//   overrideExisting: false,
// });

// export const {
//   useCreateCarSellMutation,
//   useGetCarsSellQuery,
//   useGetCarSellByIdQuery,
//   useUpdateCarSellMutation,
//   useDeleteCarSellMutation,
//   useGetMyCarsQuery,
// } = carsApi;


// src/redux/features/cars/carsApi.js
import { baseApi } from "../../api/baseApi";

export const carsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ CREATE CAR (matches backend exactly)
//   createCarSell: builder.mutation({
//   query: (data) => {
//     const formData = new FormData();

//     const allowedFields = [
//       "title",
//       "brand",
//       "year",
//       "fuelType",
//       "transmission",
//       "kmDriven",
//       "owners",
//       "registrationNumber",
//       "expectedPrice",
//       "features",
//       "conditionNotes",
//     ];

//     allowedFields.forEach((key) => {
//       const value = data[key];
//       if (value == null) return;

//       if (Array.isArray(value)) {
//         value.forEach((item) => formData.append(key, item));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     data.images?.forEach((file) => {
//       formData.append("images", file);
//     });

//     return {
//       url: "/carSell",
//       method: "POST",
//       body: formData,
//     };
//   },

//   transformErrorResponse: (response) => {
//     return {
//       status: response.status,
//       data: response.data,
//     };
//   },

//   invalidatesTags: [{ type: "CarSell", id: "LIST" }],
// }),

createCarSell: builder.mutation({
  query: (data) => {
    const formData = new FormData();

    const allowedFields = [
      "title",
      "brand",
      "year",
      "fuelType",
      "transmission",
      "kmDriven",
      "owners",
      "registrationNumber",
      "expectedPrice",
      "features",
      "conditionNotes",
      "phoneNumber",
      "location",
    ];

    allowedFields.forEach((key) => {
      const value = data[key];
      if (value == null) return;

      if (key === "features" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });

    data.images?.forEach((file) => {
      formData.append("images", file);
    });

    return {
      url: "/carSell",
      method: "POST",
      body: formData,
    };
  },

  invalidatesTags: [{ type: "CarSell", id: "LIST" }],
}),
    // =========================
    // GET ALL
    // =========================
    getCarsSell: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
          }
        });

        return `/carSell?${query.toString()}`;
      },

      // ✅ Proper caching
      providesTags: (result) =>
        result
          ? [
              ...result.map((car) => ({
                type: "CarSell",
                id: car._id,
              })),
              { type: "CarSell", id: "LIST" },
            ]
          : [{ type: "CarSell", id: "LIST" }],
    }),

    // =========================
    // GET BY ID
    // =========================
    getCarSellById: builder.query({
      query: (id) => `/carSell/${id}`,
      providesTags: (result, error, id) => [
        { type: "CarSell", id },
      ],
    }),

    // =========================
    // DELETE
    // =========================
    deleteCarSell: builder.mutation({
      query: (id) => ({
        url: `/carSell/${id}`,
        method: "DELETE",
      }),

      // ✅ precise invalidation
      invalidatesTags: (result, error, id) => [
        { type: "CarSell", id },
        { type: "CarSell", id: "LIST" },
      ],
    }),

    // =========================
    // MY CARS
    // =========================
// getMyCars: builder.query({
//   query: ({ page = 1, limit = 10 }) =>
//     `/carSell/my-listings?page=${page}&limit=${limit}`,

//   serializeQueryArgs: ({ endpointName }) => endpointName,

//   transformResponse: (response) => ({
//     cars: response.data,
//     pagination: response.pagination,
//   }),

//   merge: (currentCache, newData) => {
//     // 🔥 FIRST LOAD FIX
//     if (!currentCache.cars) {
//       currentCache.cars = [];
//     }

//     const existingIds = new Set(
//       currentCache.cars.map((c) => c._id)
//     );

//     const newCars = newData.cars.filter(
//       (c) => !existingIds.has(c._id)
//     );

//     currentCache.cars.push(...newCars);
//     currentCache.pagination = newData.pagination;
//   },

//   forceRefetch({ currentArg, previousArg }) {
//     return currentArg?.page !== previousArg?.page;
//   },

//   providesTags: [{ type: "CarSell", id: "MY_LIST" }],
// }),
getMyCars: builder.query({
  query: () => `/carSell/my-listings`,

  transformResponse: (response) => response.cars, // 🔥 consistent shape

  providesTags: [{ type: "CarSell", id: "MY_LIST" }],
}),

    updateCarSell: builder.mutation({
  query: ({ id, data }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value == null) return;

      if (key === "features" || key === "removedImages") {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });

    return {
      url: `/carSell/${id}`,
      method: "PUT",
      body: formData,
    };
  },
}),

  }),

  overrideExisting: false,
});

export const {
  useCreateCarSellMutation,
  useGetCarsSellQuery,
  useGetCarSellByIdQuery,
  useDeleteCarSellMutation,
  useGetMyCarsQuery,
  useUpdateCarSellMutation,
} = carsApi;