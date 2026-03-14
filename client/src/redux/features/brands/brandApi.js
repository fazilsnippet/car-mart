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
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
} = brandApi;