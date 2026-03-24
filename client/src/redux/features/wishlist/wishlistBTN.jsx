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

  // ✅ Check if car is already in wishlist
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

  if (wishlistLoading) return null; // or skeleton

  return (
    <button
      onClick={handleToggle}
      disabled={toggleLoading}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition 
        ${
           isWishlisted ? "❤️" : "🤍"}
        }
        ${toggleLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {toggleLoading
        ? "..."
        : isWishlisted
        ? "Remove from Wishlist"
        : "Add to Wishlist"}
    </button>
  );
};

export default AddToWishlistButton;