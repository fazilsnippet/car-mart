import React from "react";
import { useGetMyCarsQuery } from "./carSellApi.js";

const MyListingsPage = () => {
  const { data: cars = [], isLoading, isError } = useGetMyCarsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading listings...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        Failed to load listings
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Listings
        </h1>

        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No listings yet 🚗</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={car.images?.[0]?.url || "/placeholder.jpg"}
                    alt={car.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
                    {car.year}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {car.title}
                  </h2>

                  <p className="text-xl font-bold text-indigo-600 mb-2">
                    ₹{car.finalPrice ?? car.expectedPrice}
                  </p>

                  <div className="text-sm text-gray-500 space-y-1 mb-3">
                    <p>
                      {car.fuelType} • {car.kmDriven} km
                    </p>
                    <p>📍 {car.location}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      📞 {car.phoneNumber}
                    </span>

                    <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;