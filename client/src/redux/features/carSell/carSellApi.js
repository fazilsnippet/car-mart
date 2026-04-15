import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../api/baseApi";
export const carsApi = createApi({
  reducerPath: "carsApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseApi }),
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCarsSell: builder.query({ query: () => "/carSell", providesTags: ["Car"] }),
    getCarSellById: builder.query({ query: (id) => `/carSell/${id}`, providesTags: ["Car"] }),
    createCarSell: builder.mutation({ 
      query: (body) => ({ url: "/carSell", method: "POST", body }),
      invalidatesTags: ["Car"]
    }),
    updateCarSell: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `/carSell/${id}`, method: "PUT", body }),
      invalidatesTags: ["Car"]
    }),
    deleteCarSell: builder.mutation({ 
      query: (id) => ({ url: `/carSell/${id}`, method: "DELETE" }),
      invalidatesTags: ["Car"]
    })
  })
});

export const { useGetCarsSellQuery, useGetCarSellByIdQuery, useCreateCarSellMutation, useUpdateCarSellMutation, useDeleteCarSellMutation } = carsApi;
