import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../api/baseApi";
export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseApi }),
  tagTypes: ["CarSell"],
  endpoints: (builder) => ({
   createCarSell: builder.mutation({
      query: (data) => {
        const formData = new FormData();

        // 🔥 Append all text fields
        Object.keys(data).forEach((key) => {
          if (key !== "images") {
            formData.append(key, data[key]);
          }
        });

        // 🔥 Append images (important)
        if (data.images && data.images.length > 0) {
          data.images.forEach((file) => {
            formData.append("images", file); // field name must match multer config
          });
        }

        return {
          url: "/carSell",
          method: "POST",
          body: formData,
          // ❌ DO NOT set Content-Type manually
        };
      },
      invalidatesTags: ["CarSell"],
    }),
getCarsSell: builder.query({
  query: ({
    page = 1,
    limit = 10,
    brand,
    fuelType,
    minPrice,
    maxPrice,
    sortBy,
    order,
    search,
  } = {}) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (brand) params.append("brand", brand);
    if (fuelType) params.append("fuelType", fuelType);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sortBy) params.append("sortBy", sortBy);
    if (order) params.append("order", order);
    if (search) params.append("search", search);

    return `/carSell?${params.toString()}`;
  },

  providesTags: ["Car"],
}),
    getCarSellById: builder.query({ query: (id) => `/carSell/${id}`, providesTags: ["CarSell"] }),
  updateCarSell: builder.mutation({
  query: ({ id, images, ...data }) => {
    const formData = new FormData();

    // 🔥 append text fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // 🔥 append images ONLY if provided
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    return {
      url: `/carSell/${id}`,
      method: "PUT",
      body: formData,
    };
  },

  invalidatesTags: ["CarSell"],
}),
    deleteCarSell: builder.mutation({ 
      query: (id) => ({ url: `/carSell/${id}`, method: "DELETE" }),
      invalidatesTags: ["CarSell"]
    }),
    getMyCars: builder.query({
  query: ({ page = 1, limit = 10 } = {}) =>
    `/carSell/my-listings?page=${page}&limit=${limit}`,
  providesTags: ["CarSell"],
}),
  })
});

export const { useGetCarsSellQuery, useGetCarSellByIdQuery, useCreateCarSellMutation, useUpdateCarSellMutation, useDeleteCarSellMutation } = carsApi;
