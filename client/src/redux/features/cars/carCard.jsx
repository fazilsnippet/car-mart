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
   <div className="flex flex-col p-4 transition shadow bg-background/50 text-foreground rounded-xl hover:shadow-lg">
  <div
    onClick={() => navigate(`/car/${car.slug}`)}
    className="overflow-hidden transition rounded-lg shadow cursor-pointer bg-background/80 backdrop-blur hover:shadow-lg"
  >
    <div className="w-full h-48 overflow-hidden rounded-lg bg-background/80 backdrop-blur">
      {car?.images?.[0]?.url ? (
        <img
          src={car.images[0].url}
          alt={car.title}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-foreground/60">
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

    <h3 className="text-lg font-semibold text-foreground line-clamp-2">
      {car?.title}
    </h3>

    {metaLine && (
      <p className="text-sm text-foreground/70">{metaLine}</p>
    )}

    {locationLine && (
      <p className="text-sm text-foreground/70">{locationLine}</p>
    )}
  </div>

  <div className="mt-4">
    <p className="text-xl font-bold text-foreground">
      ₹ {car?.price?.toLocaleString("en-IN")}
    </p>
  </div>
</div>
  );
}
