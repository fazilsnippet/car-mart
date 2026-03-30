import { useNavigate } from "react-router-dom";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const brandName = car?.brand?.name || car?.brand || "";
  const metaLine = [car?.year, car?.fuelType, car?.transmission]
    .filter(Boolean)
    .join(" • ");
  const locationLine = [
    car?.kmDriven != null ? `${car.kmDriven.toLocaleString()} km` : null,
    car?.location?.city,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="flex flex-col p-4 transition bg-white shadow rounded-xl hover:shadow-lg">
      <div
        onClick={() => navigate(`/car/${car.slug}`)}
        className="overflow-hidden transition bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
      >
        <div className="w-full h-48 overflow-hidden bg-gray-200 rounded-lg">
          {car?.images?.[0]?.url ? (
            <img
              src={car.images[0].url}
              alt={car.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 mt-4 space-y-1">
        {brandName && (
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {brandName}
          </p>
        )}

        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {car?.title}
        </h3>

        {metaLine && <p className="text-sm text-gray-600">{metaLine}</p>}
        {locationLine && <p className="text-sm text-gray-600">{locationLine}</p>}
      </div>

      <div className="mt-4">
        <p className="text-xl font-bold text-slate-900">
          ₹ {car?.price?.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
