import { baseApi } from "../../api/baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "/brand",
      transformResponse: (res) => res.data,
      providesTags: ["Brand"],
    }),
    

    createBrand: builder.mutation({
      query: (formData) => ({
        url: "/brand",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;