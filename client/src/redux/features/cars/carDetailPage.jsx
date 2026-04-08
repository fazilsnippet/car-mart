import { useParams, useNavigate } from "react-router-dom";
import { useGetCarBySlugQuery } from "./carApi";
import { useState, useRef } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import Loading from "../ui/loader.jsx";
import { CalendarDays } from "lucide-react";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../wishlist/wishlistApi.js";
import { useStartConversationMutation } from "../chats/chatApi.js";

const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: car, isLoading, isError } = useGetCarBySlugQuery(slug);
  const { data: wishlist = [] } = useGetWishlistQuery();

  const [toggleWishlist, { isLoading: isTogglingWishlist }] =
    useToggleWishlistMutation();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isSaved = wishlist.some((i) => i.car?._id === car?._id);

  const handleToggle = async () => {
    if (!car?._id) return;
    try {
      await toggleWishlist(car._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartChat = async () => {
    try {
      if (!car?._id) return;
      const convo = await startConversation({ carId: car._id }).unwrap();
      navigate(`/chat/${convo._id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBook = () => {
    if (!car?._id) return;
    navigate("/booking", {
      state: {
        carId: car._id,
        carSnapshot: {
          title: car?.title,
          brand: car?.brand?.name,
          price: car?.price,
          year: car?.year,
          image: car?.images?.[0]?.url,
        },
      },
    });
  };

  if (isLoading)
    return <div className="p-6 text-center"><Loading/></div>;
  if (isError || !car)
    return <div className="p-6 text-center bg-background text-foreground">Car not found</div>;

  const images = car.images || [];
  const total = images.length;

  const next = () => setActiveIndex((i) => (i + 1) % total);
  const prev = () => setActiveIndex((i) => (i === 0 ? total - 1 : i - 1));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  return (
    <div className="px-4 py-6 mx-auto font-sans max-w-7xl bg-background text-foreground">
      <div className="grid gap-6 lg:grid-cols-12 bg-background text-foreground">
        {/* LEFT */}
        <div className="space-y-4 lg:col-span-7 bg-background text-foreground">
          <div
            className="relative overflow-hidden group rounded-2xl bg-slate-100"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* MOBILE WISHLIST BUTTON */}
            <button
              onClick={handleToggle}
              className="absolute z-10 p-2 rounded-full shadow top-3 right-3 bg-white/90 backdrop-blur md:hidden"
            >
              <HiOutlineHeart
                className={`w-5 h-5 ${
                  isSaved ? "text-red-500 fill-red-500" : "text-slate-700"
                }`}
              />
            </button>

            <img
              src={images[activeIndex]?.url}
              className="w-full h-[260px] sm:h-[420px] lg:h-[520px] object-contain cursor-zoom-in"
              onClick={() => setIsOpen(true)}
            />

            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute p-2 -translate-y-1/2 rounded-full shadow left-3 top-1/2 bg-white/90"
                >
                  <HiOutlineChevronLeft />
                </button>
                <button
                  onClick={next}
                  className="absolute p-2 -translate-y-1/2 rounded-full shadow right-3 top-1/2 bg-white/90"
                >
                  <HiOutlineChevronRight />
                </button>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-background text-foreground">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  onClick={() => setActiveIndex(i)}
                  className={`h-16 w-24 object-cover rounded-lg border cursor-pointer ${
                    i === activeIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:col-span-5 bg-background text-foreground">
          <div className="p-5 space-y-5 bg-white shadow rounded-2xl">
            <h1 className="text-2xl font-semibold leading-tight sm:text-3xl text-slate-900">
              {car.title} {car.year && `(${car.year})`}
            </h1>

            <p className="text-3xl font-bold text-indigo-600">
              ₹ {car.price?.toLocaleString("en-IN")}
            </p>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBook}
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl"
              >
                <CalendarDays size={18} /> Book
              </button>

              <button
                onClick={handleStartChat}
                disabled={isStartingChat}
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium border rounded-xl"
              >
                <HiOutlineChatAlt2 />
                {isStartingChat ? "Opening..." : "Chat"}
              </button>

              {/* DESKTOP WISHLIST */}
              <button
                onClick={handleToggle}
                disabled={isTogglingWishlist}
                className="items-center justify-center hidden gap-2 py-3 text-sm font-medium border md:flex col-span-full rounded-xl"
              >
                <HiOutlineHeart
                  className={isSaved ? "text-red-500 fill-red-500" : ""}
                />
                {isTogglingWishlist
                  ? "..."
                  : isSaved
                  ? "Saved"
                  : "Save"}
              </button>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-sm border-t">
              {car.brand?.name && (
                <div>
                  <p className="text-xs text-slate-500">Brand</p>
                  <p className="text-base font-medium">{car.brand.name}</p>
                </div>
              )}
              {car.variant && (
                <div>
                  <p className="text-xs text-slate-500">Variant</p>
                  <p className="text-base">{car.variant}</p>
                </div>
              )}
              {car.fuelType && (
                <div>
                  <p className="text-xs text-slate-500">Fuel</p>
                  <p className="text-base">{car.fuelType}</p>
                </div>
              )}
              {car.transmission && (
                <div>
                  <p className="text-xs text-slate-500">Transmission</p>
                  <p className="text-base">{car.transmission}</p>
                </div>
              )}
              {car.kmDriven != null && (
                <div>
                  <p className="text-xs text-slate-500">KM</p>
                  <p className="text-base">{car.kmDriven}</p>
                </div>
              )}
              {car.ownerCount != null && (
                <div>
                  <p className="text-xs text-slate-500">Owners</p>
                  <p className="text-base">{car.ownerCount}</p>
                </div>
              )}
            </div>

            {/* FEATURES */}
            {Array.isArray(car.features) && car.features.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Features
                </h3>

                <div className="flex flex-wrap gap-2">
                  {[...new Set(car.features)].map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 bg-background text-foreground"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="absolute text-white top-4 right-4"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineX size={28} />
          </button>

          {total > 1 && (
            <button
              onClick={prev}
              className="absolute p-3 text-white rounded-full left-4 bg-white/10"
            >
              <HiOutlineChevronLeft size={28} />
            </button>
          )}

          <img
            src={images[activeIndex]?.url}
            className="max-h-[90%] max-w-[90%] object-contain"
          />

          {total > 1 && (
            <button
              onClick={next}
              className="absolute p-3 text-white rounded-full right-4 bg-white/10 bg-background text-foreground"
            >
              <HiOutlineChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;
