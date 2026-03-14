import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetCarBySlugQuery } from "./carApi";
import { useState, useRef } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineCalendar,
} from "react-icons/hi";

const CarDetailPage = () => {
  const { slug } = useParams();
  const { data: car, isLoading, isError } = useGetCarBySlugQuery(slug);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
   const [isSaved, setIsSaved] = useState(false);
  const [selectedBookingType, setSelectedBookingType] =
    useState("TEST_DRIVE");
  const thumbScrollRef = useRef(null);
  const navigate = useNavigate();

  const bookingTypes = [
    { id: "TEST_DRIVE", label: "Test drive" },
    { id: "CALLBACK", label: "Request callback" },
    { id: "VISIT", label: "Visit showroom" },
  ];

  const selectedTypeLabel =
    bookingTypes.find((t) => t.id === selectedBookingType)?.label ||
    "Booking";

  const scrollThumbs = (dir) => {
    if (!thumbScrollRef.current) return;
    const step = 120;
    thumbScrollRef.current.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const handleBookClick = () => {
  navigate("/booking", {
    state: {
      carId: car?._id,
      bookingType: selectedBookingType,

      // snapshot for UI (not required for backend)
      carSnapshot: {
        title: car?.title,
        brand: car?.brand?.name,
        price: car?.price,
        year: car?.year,
        image: car?.images?.[0]?.url,
        location: [
          car?.location?.city,
          car?.location?.state,
        ]
          .filter(Boolean)
          .join(", "),
      },
    },
  });
};

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );

  if (isError || !car)
    return (
      <div className="p-6 text-center text-red-500">Car not found</div>
    );

  const images = car.images?.length > 0 ? car.images : [];
  const total = images.length;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <nav className="flex text-sm text-slate-600" aria-label="Breadcrumb">
              <Link to="/" className="transition-colors hover:text-blue-600">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/car" className="transition-colors hover:text-blue-600">
                Cars
              </Link>
              {car.brand?.name && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-slate-900">{car.brand.name}</span>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="truncate text-slate-900 max-w-50" title={car.title}>
                {car.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* ================= LEFT — IMAGE GALLERY (OLX-style) ================= */}
            <div className="lg:col-span-7 xl:col-span-8">
              {total > 0 ? (
                <div className="bg-white">
                  {/* Main image with circular arrows */}
                  <div className="relative group">
                    <div
                      className="relative overflow-hidden rounded-lg bg-slate-100 aspect-4/3 max-h-130"
                      onClick={() => setIsOpen(true)}
                    >
                      <img
                        key={activeIndex}
                        src={images[activeIndex].url}
                        alt={`${car.title} - ${activeIndex + 1}`}
                        className="object-contain w-full h-full cursor-zoom-in animate-image-fade"
                      />
                    </div>

                    {/* Large circular nav arrows */}
                    {total > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));
                          }}
                          className="absolute flex items-center justify-center w-12 h-12 transition-colors -translate-y-1/2 bg-white rounded-full shadow-lg opacity-0 left-4 top-1/2 text-slate-700 hover:bg-slate-50 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Previous image"
                        >
                          <HiOutlineChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex((i) => (i === total - 1 ? 0 : i + 1));
                          }}
                          className="absolute flex items-center justify-center w-12 h-12 transition-colors -translate-y-1/2 bg-white rounded-full shadow-lg opacity-0 right-4 top-1/2 text-slate-700 hover:bg-slate-50 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Next image"
                        >
                          <HiOutlineChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail strip + paging */}
                  {total > 1 && (
                    <div className="mt-4">
                      <div className="relative flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollThumbs("left")}
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-white border rounded-full shadow-sm shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50"
                          aria-label="Scroll thumbnails left"
                        >
                          <HiOutlineChevronLeft className="w-4 h-4" />
                        </button>
                        <div
                          ref={thumbScrollRef}
                          className="flex flex-1 min-w-0 gap-2 py-1 overflow-x-auto scroll-smooth scrollbar-hide"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {images.map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setActiveIndex(index)}
                              className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all duration-200 ease-out ${
                                activeIndex === index
                                  ? "border-blue-600 ring-1 ring-blue-600"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => scrollThumbs("right")}
                          className="flex items-center justify-center w-8 h-8 transition-colors bg-white border rounded-full shadow-sm shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50"
                          aria-label="Scroll thumbnails right"
                        >
                          <HiOutlineChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-center text-slate-500">
                        {activeIndex + 1} / {total}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg aspect-4/3 max-h-130 bg-slate-100 text-slate-500">
                  No image available
                </div>
              )}
            </div>

            {/* ================= RIGHT — DETAILS SIDEBAR ================= */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-6">
                <h1 className="text-2xl font-semibold leading-tight text-slate-900">
                  {car.title}
                  {car.year && (
                    <span className="font-normal text-slate-600"> ({car.year})</span>
                  )}
                </h1>

                <p className="text-3xl font-bold text-slate-900">
                  ₹{" "}
                  {typeof car?.price === "number"
                    ? car.price.toLocaleString("en-IN")
                    : "Price on request"}
                </p>

                {/* Booking & wishlist actions */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleBookClick}
                      className="inline-flex items-center justify-center flex-1 gap-2 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 shadow-md rounded-xl hover:bg-indigo-700"
                    >
                      <HiOutlineCalendar className="w-5 h-5" />
                      <span>
                        Book {selectedTypeLabel.toLowerCase()}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSaved((prev) => !prev)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium px-4 py-3 transition-all duration-200 ${
                        isSaved
                          ? "border-rose-500 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <HiOutlineHeart
                        className={`w-5 h-5 ${
                          isSaved ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bookingTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedBookingType(type.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                          selectedBookingType === type.id
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-4 space-y-3 text-sm border-t border-b border-slate-200">
                  {car.brand?.name && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Brand</span>
                      <span className="font-medium text-slate-900">{car.brand.name}</span>
                    </div>
                  )}
                  {car.variant && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Variant</span>
                      <span className="text-slate-900">{car.variant}</span>
                    </div>
                  )}
                  {car.fuelType && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fuel</span>
                      <span className="text-slate-900">{car.fuelType}</span>
                    </div>
                  )}
                  {car.transmission && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transmission</span>
                      <span className="text-slate-900">{car.transmission}</span>
                    </div>
                  )}
                  {car.kmDriven != null && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">KM driven</span>
                      <span className="text-slate-900">{car.kmDriven?.toLocaleString()} km</span>
                    </div>
                  )}
                  {car.driveType && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drive</span>
                      <span className="text-slate-900">{car.driveType}</span>
                    </div>
                  )}
                  {car.ownerCount != null && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Owners</span>
                      <span className="text-slate-900">{car.ownerCount}</span>
                    </div>
                  )}
                  {(car.location?.city || car.location?.state) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location</span>
                      <span className="text-slate-900">
                        {[car.location?.city, car.location?.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {car.features?.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-700">Features</h3>
                    <ul className="flex flex-wrap gap-2">
                     {[...new Set(car.features)].map((feature, index) => (
  <li
    key={index}
    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full"
  >
    {feature}
  </li>
))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen lightbox */}
      {isOpen && total > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 animate-lightbox-in">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute z-10 flex items-center justify-center w-10 h-10 text-white transition-colors duration-200 rounded-full top-4 right-4 bg-white/10 hover:bg-white/20"
            aria-label="Close"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
          <div className="absolute z-10 text-sm text-white top-4 left-4">
            {activeIndex + 1} / {total}
          </div>
          <div className="flex items-center justify-center flex-1 p-4">
            <img
              key={activeIndex}
              src={images[activeIndex].url}
              alt=""
              className="object-contain max-w-full max-h-full animate-image-fade"
            />
          </div>
          {total > 1 && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i === 0 ? total - 1 : i - 1))}
                className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-white/10 hover:bg-white/20"
              >
                <HiOutlineChevronLeft className="w-6 h-6" />
              </button>
            </div>
          )}
          {total > 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                type="button"
                onClick={() => setActiveIndex((i) => (i === total - 1 ? 0 : i + 1))}
                className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-white/10 hover:bg-white/20"
              >
                <HiOutlineChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CarDetailPage;
