import { Link } from "react-router-dom";
import CarCard from "../cars/carCard.jsx";
import {
  useClearWishlistMutation,
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "./wishlistApi.js";

export default function GetWishlists() {
  const {
    data: wishlist = [],
    isLoading,
    isError,
    refetch,
  } = useGetWishlistQuery();

  const [toggleWishlist, { isLoading: isRemoving }] =
    useToggleWishlistMutation();
  const [clearWishlist, { isLoading: isClearing }] =
    useClearWishlistMutation();

  const wishlistItems = wishlist.filter((item) => item?.car?._id);

  const handleRemove = async (carId) => {
    try {
      await toggleWishlist(carId).unwrap();
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  const handleClear = async () => {
    try {
      await clearWishlist().unwrap();
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    }
  };

  if (isLoading) {
    return <div className="max-w-6xl p-6 mx-auto">Loading wishlist...</div>;
  }

  if (isError) {
    return (
      <div className="max-w-3xl p-6 mx-auto">
        <div className="p-6 border border-red-100 rounded-2xl bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">
            Could not load wishlist
          </h2>
          <button
            onClick={refetch}
            className="px-4 py-2 mt-3 text-sm font-medium text-white bg-red-600 rounded-lg"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-sm text-slate-600">
            {wishlistItems.length} saved {wishlistItems.length === 1 ? "car" : "cars"}
          </p>
        </div>

        <button
          onClick={handleClear}
          disabled={!wishlistItems.length || isClearing}
          className="px-4 py-2 text-sm font-medium text-white transition bg-slate-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? "Clearing..." : "Clear Wishlist"}
        </button>
      </div>

      {!wishlistItems.length ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
          <h2 className="text-xl font-semibold text-slate-900">Wishlist is empty</h2>
          <p className="mt-2 text-slate-600">
            Save cars you like and they will appear here.
          </p>
          <Link
            to="/cars-list"
            className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-lg"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((item) => (
            <div key={item._id || item.car._id} className="space-y-3">
              <CarCard car={item.car} />
              <button
                onClick={() => handleRemove(item.car._id)}
                disabled={isRemoving}
                className="w-full px-4 py-2 text-sm font-medium text-red-600 transition border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
