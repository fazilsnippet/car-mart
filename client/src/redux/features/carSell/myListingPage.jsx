import { useGetCarsSellQuery, useDeleteCarSellMutation } from "./carSellApi";

import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const MyListingsPage = () => {
  const { data: cars = [], isLoading, isError } = useGetCarsSellQuery();
  const [deleteCar] = useDeleteCarSellMutation();
  const navigate = useNavigate();
  

  // ✅ Memoize listings for performance
  const listings = useMemo(() => cars, [cars]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteCar(id);
    }
  };

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Error loading listings</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold">My Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">No listings yet. Create one!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((car) => (
            <div key={car._id} className="p-4 space-y-3 bg-white shadow rounded-xl">
              <img 
                src={car.images?.[0]} 
                alt={car.title} 
                className="object-cover w-full h-48 rounded-lg"
              />
              <h2 className="text-lg font-semibold">{car.title}</h2>
              <p className="font-bold text-indigo-600">₹ {car.expectedPrice?.toLocaleString("en-IN")}</p>
              <p className="text-sm text-gray-500">{car.brand} • {car.year}</p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => navigate(`/edit-listing/${car._id}`)}
                  className="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="flex-1 py-2 text-sm text-red-600 border rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
