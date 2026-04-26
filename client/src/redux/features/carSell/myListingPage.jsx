import { useGetMyCarsQuery } from "../store/carsApi";
import { Link } from "react-router-dom";

const MyListingsPage = () => {
  const { data, isLoading, isError } = useGetMyCarsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Failed to load</p>;

  const cars = data?.data || [];

  if (cars.length === 0) {
    return <p className="text-gray-500">No listings yet</p>;
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">My Listings</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <div
            key={car._id}
            className="p-4 border rounded-xl shadow-sm"
          >
            {/* IMAGE */}
            {car.images?.[0]?.url && (
              <img
                src={car.images[0].url}
                alt={car.title}
                className="object-cover w-full h-40 mb-3 rounded"
              />
            )}

            {/* TITLE */}
            <h2 className="text-lg font-semibold">{car.title}</h2>

            {/* PRICE */}
            <p className="text-indigo-600 font-bold">
              ₹{car.price}
            </p>

            {/* DETAILS */}
            <p className="text-sm text-gray-500">
              {car.year} • {car.fuelType} • {car.kmDriven} km
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <Link
                to={`/edit/${car._id}`}
                className="px-3 py-1 text-white bg-blue-500 rounded"
              >
                Edit
              </Link>

              <button className="px-3 py-1 text-white bg-red-500 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListingsPage;