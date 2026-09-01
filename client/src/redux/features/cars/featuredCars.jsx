cimport { useNavigate } from "react-router-dom";

const FeaturedCarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/car/${car._id}`)
      }
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        cursor-pointer
        bg-neutral-900
      "
    >
      {/* IMAGE */}
      <div className="relative h-[320px] overflow-hidden">

        <img
          src={car?.images?.[0]?.url}
          alt={car?.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* OVERLAY */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
        />

        {/* TOP BADGE */}
        <div
          className="absolute px-4 py-2 text-xs tracking-widest text-white uppercase rounded-full top-4 left-4 bg-black/40 backdrop-blur-md"
        >
          Featured
        </div>

        {/* CONTENT */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 "
        >
          <h3
            className="text-2xl font-bold text-white "
          >
            {car?.model}
          </h3>

          <p className="mt-2 text-white/70">
            {car?.year} • {car?.fuelType} •{" "}
            {car?.transmission}
          </p>

          <div className="flex items-center justify-between mt-5">

            <p
              className="text-2xl font-semibold text-orange-400 "
            >
              ₹
              {Number(
                car?.price
              ).toLocaleString()}
            </p>

            <button
              className="px-5 py-2 text-sm font-medium text-black transition bg-white rounded-full hover:scale-105"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarCard;