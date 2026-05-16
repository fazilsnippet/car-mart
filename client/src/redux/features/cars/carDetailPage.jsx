



import { useParams, useNavigate } from "react-router-dom";
import { useGetCarBySlugQuery } from "./carApi";
import { useState, useRef } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineChatAlt2,
  HiOutlinePhone,
  HiOutlineCalculator,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import Loading from "../ui/loader.jsx";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../wishlist/wishlistApi.js";
import EmiCalculator from "../../../utils/emiCalculator.jsx";

import {
  CalendarDays,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  User,
  Cog,
  MapPin,
} from "lucide-react";

// ======================
// FORMAT HELPERS
// ======================
const formatTransmission = (t) => {
  if (t === "MT") return "Manual";
  if (t === "AT") return "Automatic";
  if (t === "OTHERS") return "Automatic";
  return t || "N/A";
};

const formatOwner = (n) => {
  if (!n) return "N/A";
  if (n === 1) return "1st Owner";
  if (n === 2) return "2nd Owner";
  if (n === 3) return "3rd Owner";
  return `${n} Owners`;
};

const formatKm = (km) =>
  km ? `${km.toLocaleString("en-IN")} km` : "N/A";

// ======================
// COMPONENT
// ======================
const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: carData, isLoading, isError } =
    useGetCarBySlugQuery(slug);

  const { data: wishlist = [] } = useGetWishlistQuery();

  const [toggleWishlist] = useToggleWishlistMutation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showEmi, setShowEmi] = useState(false);
const [direction, setDirection] = useState(0); // -1 left, +1 right
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
// const next = () => {
//   setDirection(1);
//   setActiveIndex((i) => (i + 1) % total);
// };

// const prev = () => {
//   setDirection(-1);
//   setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
// };
  const isSaved = wishlist.some(
    (i) => i.car?._id === carData?._id
  );

  // ======================
  // ACTIONS
  // ======================
  const handleToggle = async () => {
    if (!carData?._id) return;
    await toggleWishlist(carData._id);
  };

  const handleStartChat = () => {
    if (!carData?._id) return;

    navigate("/chat", {
      state: {
        carId: carData._id,
        carSnapshot: {
          _id: carData._id,
          title: carData.title,
          image: carData.images?.[0]?.url,
          price: carData.price,
        },
      },
    });
  };

  const handleBook = () => {
    if (!carData?._id) return;

    navigate("/booking", {
      state: {
        carId: carData._id,
        carSnapshot: {
          title: carData.title,
          brand: carData.brand?.name,
          price: carData.price,
          year: carData.year,
          image: carData.images?.[0]?.url,
        },
      },
    });
  };

  // ======================
  // LOADING / ERROR
  // ======================
  if (isLoading) return <Loading />;
  if (isError || !carData) return <div>Car not found</div>;

const images = carData.images || [];
const total = images.length;

const next = () => {
  setDirection(1);
  setActiveIndex((i) => (i + 1) % total);
};

const prev = () => {
  setDirection(-1);
  setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
};

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

 const handleTouchEnd = () => {
  const diff = touchStartX.current - touchEndX.current;

  if (diff > 50) {
    next(); // swipe left → next
  } else if (diff < -50) {
    prev(); // swipe right → prev
  }
};

  const specs = [
    { label: "KM", value: formatKm(carData.kmDriven), icon: Gauge },
    { label: "Fuel", value: carData.fuelType, icon: Fuel },
    {
      label: "Transmission",
      value: formatTransmission(carData.transmission),
      icon: Settings,
    },
    { label: "Year", value: carData.year, icon: Calendar },
    {
      label: "Owner",
      value: formatOwner(carData.ownerCount),
      icon: User,
    },
    { label: "Drive", value: carData.driveType, icon: Cog },
  ];

  // ======================
  // UI
  // ======================
  return (
    <div className="px-4 py-6 mx-auto max-w-7xl ">
      <div className="grid gap-6 lg:grid-cols-12">

   {/* LEFT - STICKY IMAGE SECTION */}
        <div className="lg:col-span-7">
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* SLIDER */}
            <div
              className="relative overflow-hidden rounded-2xl bg-slate-100"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    onClick={() => setIsOpen(true)}
                    className="object-contain w-full cursor-pointer shrink-0 h-65 sm:h-105 lg:h-130"
                  />
                ))}
              </div>

              {/* CENTERED BUTTONS */}
              {total > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute p-3 -translate-y-1/2 border rounded-full shadow left-3 top-1/2 border-color bg-background "
                  >
                    <HiOutlineChevronLeft size={20} />
                  </button>

                  <button
                    onClick={next}
                    className="absolute p-3 -translate-y-1/2 border rounded-full shadow right-3 top-1/2 bg-background border-color"
                  >
                    <HiOutlineChevronRight size={20} />
                  </button>
                </>
              )}

              {/* WISHLIST */}
              <button
                onClick={handleToggle}
                className="absolute p-2 rounded-full shadow top-3 right-3 bg-background border-color"
              >
                <HiOutlineHeart
                  className={
                    isSaved
                      ? "text-red-500 fill-red-500"
                      : ""
                  }
                />
              </button>
            </div>

            {/* THUMBNAILS */}
            {total > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    onClick={() => setActiveIndex(i)}
                    className={`h-16 w-24 object-cover rounded-lg cursor-pointer border ${
                      i === activeIndex
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>


        {/* RIGHT */}
        <div className="space-y-5 lg:col-span-5 ">
          <div className="p-5 space-y-5 shadow-amber-400 bg-background text-foreground rounded-2xl">

            <h1 className="text-2xl font-semibold">
              {carData.title} ({carData.year})
            </h1>

            <p className="text-3xl font-bold text-indigo-600">
              ₹ {carData.price?.toLocaleString("en-IN")}
            </p>

            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin size={16} />
              {carData.location?.city},{" "}
              {carData.location?.state}
            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-background text-foreground rounded-xl">
              {specs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {spec.label}
                      </p>
                      <p className="text-sm font-semibold">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBook}
                className="py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                Book
              </button>

              <button
                onClick={handleStartChat}
                className="py-3 border rounded-xl"
              >
                Chat
              </button>

              <button
                onClick={() =>
                  (window.location.href = "tel:+919916262484")
                }
                className="py-3 border rounded-xl "
              >
                Call
              </button>

              <button
                onClick={() =>
                  window.open("https://wa.me/919916262484")
                }
                className="py-3 text-white bg-green-500 rounded-xl hover:bg-green-600"
              >
                WhatsApp
              </button>
            </div>


            {/* FEATURES */}
            {carData.features?.length > 0 && (
              <div>
                <h3 className="font-semibold">Features</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {carData.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs text-gray-800 bg-gray-200 rounded-md"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* EMI */}
            <button
              onClick={() => setShowEmi(!showEmi)}
              className="w-full py-3 border rounded-xl"
            >
              <HiOutlineCalculator className="inline mr-2" />
              {showEmi ? "Hide EMI" : "Calculate EMI"}
            </button>

            {showEmi && (
              <EmiCalculator price={carData.price} />
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
     {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">

          <button
            className="absolute text-white top-4 right-4"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineX size={30} />
          </button>

          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute text-white -translate-y-1/2 left-5 top-1/2"
              >
                <HiOutlineChevronLeft size={40} />
              </button>

              <button
                onClick={next}
                className="absolute text-white -translate-y-1/2 right-5 top-1/2"
              >
                <HiOutlineChevronRight size={40} />
              </button>
            </>
          )}

          <img
            src={images[activeIndex]?.url}
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;




