import { useNavigate } from "react-router-dom";

export default function CarCard({ car }) {
  const navigate = useNavigate();

  // const brandName = car?.brand?.name || car?.brand || "";

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
      className="overflow-hidden transition duration-300 shadow-sm cursor-pointer text-foreground rounded-2xl hover:shadow-lg group"
    >
      {/* IMAGE */}
      <div className="relative w-full h-48 overflow-hidden">
        {car?.images?.[0]?.url ? (
          <img
            src={car.images[0].url}
            alt={car.title}
            className="object-cover w-full h-full transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-foreground">
            No Image
          </div>
        )}

        {/* OPTIONAL BADGE */}
        {car?.year && (
          <span className="absolute px-3 py-1 text-xs text-white bg-indigo-600 rounded-full shadow top-3 left-3">
            {car.year}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* {brandName && (
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            {brandName}
          </p>
        )} */}

        <h3 className="text-base font-semibold text-foreground line-clamp-2">
          {car?.title}
        </h3>

        {metaLine && (
          <p className="text-sm text-foreground">{metaLine}</p>
        )}

        {locationLine && (
          <p className="text-sm text-foreground">{locationLine}</p>
        )}

        {/* PRICE */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-foreground">
            ₹ {car?.price?.toLocaleString("en-IN")}
          </p>

          <span className="text-sm font-medium text-indigo-600 transition opacity-0 group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}