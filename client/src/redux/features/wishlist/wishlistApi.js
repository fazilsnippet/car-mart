import { baseApi } from "../../api/baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // -------------------------
    // Get Wishlist
    // -------------------------
    getWishlist: builder.query({
      query: () => "/wishlist",
      transformResponse: (res) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Wishlist",
                id: item.car._id,
              })),
              { type: "Wishlist", id: "LIST" },
            ]
          : [{ type: "Wishlist", id: "LIST" }],
    }),

    // -------------------------
    // Toggle Wishlist
    // -------------------------
  toggleWishlist: builder.mutation({
  query: (carId) => ({
    url: `/wishlist/${carId}`,
    method: "POST",
  }),

  async onQueryStarted(carId, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      wishlistApi.util.updateQueryData(
        "getWishlist",
        undefined,
        (draft) => {
          const index = draft.findIndex(
            (item) => item.car?._id === carId
          );

          if (index > -1) {
            // remove
            draft.splice(index, 1);
          } else {
            // add (minimal structure)
            draft.push({
              car: { _id: carId }
            });
          }
        }
      )
    );

    try {
      await queryFulfilled;
    } catch {
      patchResult.undo(); // rollback
    }
  },
}),

    // -------------------------
    // Clear Wishlist
    // -------------------------
    clearWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist/clear",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData("getWishlist", undefined, () => [])
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    // -------------------------
    // Admin
    // -------------------------
    getWishlistAdmin: builder.query({
      query: () => "/wishlist/admin",
      transformResponse: (res) => res.data,
      providesTags: ["Wishlist"],
    }),

  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useClearWishlistMutation,
  useGetWishlistAdminQuery,
} = wishlistApi;