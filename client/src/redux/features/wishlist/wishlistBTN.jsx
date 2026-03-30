import { useMemo } from "react";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "./wishlistApi.js";

const AddToWishlistButton = ({ carId }) => {
  const { data: wishlist = [], isLoading: wishlistLoading } =
    useGetWishlistQuery();

  const [toggleWishlist, { isLoading: toggleLoading }] =
    useToggleWishlistMutation();

  const isWishlisted = useMemo(() => {
    return wishlist.some((item) => item.car?._id === carId);
  }, [wishlist, carId]);

  const handleToggle = async () => {
    try {
      await toggleWishlist(carId).unwrap();
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  if (wishlistLoading) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={toggleLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
        isWishlisted
          ? "border-rose-500 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${toggleLoading ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {toggleLoading
        ? "Updating..."
        : isWishlisted
        ? "Remove from Wishlist"
        : "Add to Wishlist"}
    </button>
  );
};

export default AddToWishlistButton;