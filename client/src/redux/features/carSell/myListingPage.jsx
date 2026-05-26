import React from "react";
import { useGetMyCarsQuery } from "./carSellApi.js";

const MyListingsPage = () => {
  const { data: cars = [], isLoading, isError } = useGetMyCarsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading)
    return <p className="mt-10 text-center text-gray-500">Loading listings...</p>;

  if (isError)
    return (
      <p className="mt-10 font-medium text-center text-red-500">
        Failed to load listings
      </p>
    );

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          My Listings
        </h1>

        {cars.length === 0 ? (
          <div className="py-20 text-center bg-white shadow-sm rounded-xl">
            <p className="text-lg text-gray-500">No listings yet 🚗</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car._id}
                className="overflow-hidden transition duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg group"
              >
                <div className="relative">
                  <img
                    src={car.images?.[0]?.url || "/placeholder.jpg"}
                    alt={car.title}
                    className="object-cover w-full h-48 transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute px-3 py-1 text-xs text-white bg-indigo-600 rounded-full shadow top-3 left-3">
                    {car.year}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-1">
                    {car.title}
                  </h2>

                  <p className="mb-2 text-xl font-bold text-indigo-600">
                    ₹{car.finalPrice ?? car.expectedPrice}
                  </p>

                  <div className="mb-3 space-y-1 text-sm text-gray-500">
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