import { useNavigate } from "react-router-dom";

export default function CarCard({ car }) {
  const navigate = useNavigate();

  const brandName = car?.brand?.name || car?.brand || "";

  const metaLine = [car?.year, car?.fuelType, car?.transmission]
    .filter(Boolean)
    .join(" • ");

  const locationLine = [
    car?.kmDriven != null
      ? `${car.kmDriven.toLocaleString()} km`
      : null,
    car?.location?.city,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div
      onClick={() => navigate(`/car/${car.slug}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer group"
    >
      {/* IMAGE */}
      <div className="relative w-full h-48 overflow-hidden">
        {car?.images?.[0]?.url ? (
          <img
            src={car.images[0].url}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
            No Image
          </div>
        )}

        {/* OPTIONAL BADGE */}
        {car?.year && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
            {car.year}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {brandName && (
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {brandName}
          </p>
        )}

        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {car?.title}
        </h3>

        {metaLine && (
          <p className="text-sm text-gray-500">{metaLine}</p>
        )}

        {locationLine && (
          <p className="text-sm text-gray-500">{locationLine}</p>
        )}

        {/* PRICE */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ₹ {car?.price?.toLocaleString("en-IN")}
          </p>

          <span className="text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}