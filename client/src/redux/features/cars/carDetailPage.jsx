




import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  X,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Zap,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Calculator,
  Award,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Settings,
  User,
  Cog,
} from "lucide-react";

import { useGetCarBySlugQuery } from "./carApi";

import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "../wishlist/wishlistApi";

import Loading from "../ui/loader";
import EmiCalculator from "../../../utils/emiCalculator";


// ======================================================
// FORMAT HELPERS
// ======================================================

const formatTransmission = (value) => {
  if (value === "MT") return "Manual";
  if (value === "AT") return "Automatic";
  if (value === "OTHERS") return "Automatic";

  return value || "N/A";
};

const formatOwner = (value) => {
  if (!value) return "N/A";

  if (value === 1) return "1st Owner";
  if (value === 2) return "2nd Owner";
  if (value === 3) return "3rd Owner";

  return `${value} Owners`;
};

const formatKm = (km) => {
  if (!km) return "N/A";

  return `${km.toLocaleString("en-IN")} km`;
};


// ======================================================
// COMPONENT
// ======================================================

const CarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ====================================================
  // API
  // ====================================================

  const {
    data: carData,
    isLoading,
    isError,
  } = useGetCarBySlugQuery(slug);

  const {
    data: wishlist = [],
  } = useGetWishlistQuery();

  const [toggleWishlist] =
    useToggleWishlistMutation();


  // ====================================================
  // STATE
  // ====================================================

  const [activeIndex, setActiveIndex] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [showEmi, setShowEmi] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


  // ====================================================
  // WISHLIST
  // ====================================================

  const isSaved = wishlist.some(
    (item) =>
      item.car?._id === carData?._id
  );


  const handleToggleWishlist = async () => {
    if (!carData?._id) return;

    await toggleWishlist(carData._id);
  };


  // ====================================================
  // CHAT
  // ====================================================

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


  // ====================================================
  // BOOKING
  // ====================================================

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


  // ====================================================
  // LOADING / ERROR
  // ====================================================

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !carData) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center">
        <div className="text-center">

          <p className="text-[#D4AF37] font-mono uppercase tracking-widest">
            Vehicle unavailable
          </p>

          <button
            onClick={() => navigate(-1)}
            className="
              mt-5
              px-6
              py-3
              rounded-xl
              border
              border-zinc-700
              hover:border-[#D4AF37]
              transition
            "
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }


  // ====================================================
  // IMAGES
  // ====================================================

  const images = carData.images || [];

  const total = images.length;


  // ====================================================
  // SLIDER
  // ====================================================

  const next = () => {
    if (!total) return;

    setActiveIndex(
      (current) =>
        (current + 1) % total
    );
  };


  const prev = () => {
    if (!total) return;

    setActiveIndex(
      (current) =>
        current === 0
          ? total - 1
          : current - 1
    );
  };


  // ====================================================
  // TOUCH / SWIPE
  // ====================================================

  const handleTouchStart = (event) => {
    touchStartX.current =
      event.touches[0].clientX;
  };


  const handleTouchMove = (event) => {
    touchEndX.current =
      event.touches[0].clientX;
  };


  const handleTouchEnd = () => {
    const difference =
      touchStartX.current -
      touchEndX.current;

    if (difference > 50) {
      next();
    }

    if (difference < -50) {
      prev();
    }
  };


  // ====================================================
  // SPECIFICATIONS
  // ====================================================

  const specs = [
    {
      label: "ODOMETER",
      value: formatKm(carData.kmDriven),
      icon: Gauge,
    },

    {
      label: "FUEL",
      value: carData.fuelType,
      icon: Fuel,
    },

    {
      label: "TRANSMISSION",
      value: formatTransmission(
        carData.transmission
      ),
      icon: Settings,
    },

    {
      label: "YEAR",
      value: carData.year,
      icon: Calendar,
    },

    {
      label: "OWNERSHIP",
      value: formatOwner(
        carData.ownerCount
      ),
      icon: User,
    },

    {
      label: "DRIVE",
      value: carData.driveType,
      icon: Cog,
    },
  ];


  // ====================================================
  // WHATSAPP
  // ====================================================

  const whatsappMessage =
    encodeURIComponent(
      `Hello Wish Wheels, I am interested in the ${carData.title}. Please share more details.`
    );


  // ====================================================
  // UI
  // ====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#0A0A0C]
        text-white
        -mx-4
        -mt-4
        px-0
        py-0
        pb-6
        md:mx-0
        md:mt-0
        sm:px-6
        sm:py-8
      "
    >

      <div className="w-full mx-auto max-w-7xl">

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-7">


          {/* =================================================
              LEFT - GALLERY
          ================================================= */}

          <div className="min-w-0 lg:col-span-7">

            <div className="space-y-3 lg:sticky lg:top-6">


              {/* MAIN IMAGE */}

              <div
                className="relative overflow-hidden bg-black border rounded-none border-x-0 border-zinc-800 sm:rounded-2xl sm:border-x"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >

                {/* CERTIFIED */}

                <div
                  className="
                    absolute
                    z-20
                    top-3
                    left-3
                    sm:top-4
                    sm:left-4
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    bg-black/75
                    backdrop-blur-md
                    border
                    border-[#D4AF37]/40
                    text-[#D4AF37]
                    text-[9px]
                    sm:text-[10px]
                    font-mono
                    font-bold
                    uppercase
                    tracking-wider
                  "
                >
                  <ShieldCheck
                    className="w-3.5 h-3.5 text-emerald-400"
                  />

                  Certified Vehicle
                </div>


                {/* BACK BUTTON */}

                <button
                  onClick={() => navigate(-1)}
                  className="absolute z-20 flex items-center justify-center w-10 h-10 border rounded-full left-3 top-14 bg-black/55 border-white/10 backdrop-blur-md sm:left-4 sm:top-16 lg:hidden"
                >
                  <ChevronLeft
                    className="w-5 h-5"
                  />
                </button>


                {/* WISHLIST */}

                <button
                  onClick={handleToggleWishlist}
                  className="absolute z-20 flex items-center justify-center w-10 h-10 border rounded-full right-3 top-3 bg-black/55 border-white/10 backdrop-blur-md sm:right-4 sm:top-4"
                >

                  <svg
                    viewBox="0 0 24 24"
                    className={`
                      w-5 h-5
                      ${
                        isSaved
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }
                    `}
                    fill={
                      isSaved
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="
                        M20.84 4.61
                        a5.5 5.5 0 0 0-7.78 0
                        L12 5.67
                        l-1.06-1.06
                        a5.5 5.5 0 0 0-7.78 7.78
                        L12 21.23
                        l8.84-8.84
                        a5.5 5.5 0 0 0 0-7.78Z
                      "
                    />
                  </svg>

                </button>


                {/* IMAGES */}

                {total > 0 ? (

                  <div
                    className="flex transition-transform duration-500 ease-out "
                    style={{
                      transform:
                        `translateX(-${activeIndex * 100}%)`,
                    }}
                  >

                    {images.map(
                      (image, index) => (

                        <img
                          key={index}
                          src={image.url}
                          alt={`${carData.title} ${index + 1}`}
                          onClick={() =>
                            setIsOpen(true)
                          }
                          className="
                            h-[270px]
                            min-[380px]:h-[300px]
                            sm:h-[470px]
                            lg:h-[600px]
                            w-full
                            shrink-0
                            cursor-zoom-in
                            object-contain
                            sm:object-cover
                          "
                        />

                      )
                    )}

                  </div>

                ) : (

                  <div
                    className="
                      h-[270px]
                      min-[380px]:h-[300px]
                      sm:h-[470px]
                      lg:h-[600px]
                      flex
                      items-center
                      justify-center
                      text-zinc-500
                    "
                  >
                    No vehicle images
                  </div>

                )}


                {/* SLIDER BUTTONS */}

                {total > 1 && (
                  <>
                    {/* <button
                      onClick={prev} */}
                      <button
  onClick={(e) => {
    e.stopPropagation();
    prev();
  }}
  onTouchEnd={(e) => e.stopPropagation()}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        border
                        border-zinc-700
                        bg-black/60
                        p-2.5
                        sm:p-3
                        backdrop-blur-md
                        hover:border-[#D4AF37]
                      "
                    >
                      <ChevronLeft
                        className="w-5 h-5"
                      />
                    </button>

                    <button
  onClick={(e) => {
    e.stopPropagation();
    next();
  }}
  onTouchEnd={(e) => e.stopPropagation()}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        border
                        border-zinc-700
                        bg-black-60
                        p-2.5
                        sm:p-3
                        backdrop-blur-md
                        hover:border-[#D4AF37]
                      "
                    >
                      <ChevronRight
                        className="w-5 h-5"
                      />
                    </button>
                  </>
                )}

              </div>


              {/* THUMBNAILS */}

              {total > 1 && (

                <div
                  className="flex gap-2 px-4 pb-1 overflow-x-auto sm:px-0 scrollbar-hide"
                >

                  {images.map(
                    (image, index) => (

                      <button
                        key={index}
                        onClick={() =>
                          setActiveIndex(index)
                        }
                        className={`
                          h-14
                          w-20
                          sm:h-16
                          sm:w-24
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          border-2
                          transition-all
                          ${
                            index === activeIndex
                              ? "border-[#D4AF37] scale-[1.03]"
                              : "border-zinc-800 opacity-55 hover:opacity-100"
                          }
                        `}
                      >

                        <img
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="object-cover w-full h-full "
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              RIGHT - DETAILS
          ================================================= */}

          <div className="min-w-0 px-4 sm:px-0 lg:col-span-5">

            <div className="space-y-5">


              {/* MAIN DETAILS CARD */}

              <section
                className="
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-[#121317]
                  p-4
                  sm:p-6
                  shadow-[0_25px_70px_rgba(0,0,0,0.35)]
                "
              >

                {/* BRAND */}

                <div
                  className="
                    text-[11px]
                    font-mono
                    uppercase
                    tracking-[0.14em]
                    sm:tracking-[0.22em]
                    text-[#D4AF37]
                    break-words
                  "
                >
                  {carData.brand?.name ||
                    "Wish Wheels"}

                  {" • "}

                  {carData.variant ||
                    "Premium Selection"}
                </div>


                {/* TITLE */}

                <h1
                  className="mt-2 text-[1.45rem] leading-tight font-bold tracking-tight sm:text-3xl"
                >
                  {carData.title}

                  <span className="text-zinc-500">
                    {" "}
                    ({carData.year})
                  </span>
                </h1>


                {/* PRICE */}

                <div
                  className="mt-4 flex flex-col items-start gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
                >

                  <p
                    className="
                      text-[1.75rem]
                      leading-none
                      sm:text-4xl
                      font-bold
                      text-[#D4AF37]
                    "
                  >
                    ₹{" "}
                    {carData.price?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <span
                    className="
                      text-[10px]
                      font-mono
                      text-zinc-500
                      uppercase
                    "
                  >
                    Premium Listing
                  </span>

                </div>


                {/* LOCATION */}

                <div
                  className="flex items-center gap-2 mt-4 text-sm text-zinc-300"
                >
                  <MapPin
                    className="
                      w-4
                      h-4
                      text-[#D4AF37]
                    "
                  />

                  {carData.location?.city ||
                    "N/A"}

                  {", "}

                  {carData.location?.state ||
                    ""}
                </div>


                {/* SPECS */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-2
                    sm:gap-2.5
                  "
                >

                  {specs.map(
                    (spec, index) => {

                      const Icon =
                        spec.icon;

                      return (
                        <div
                          key={index}
                          className="
                            rounded-xl
                            border
                            border-zinc-800
                            bg-[#0A0A0C]
                            p-2.5
                            sm:p-3
                            min-w-0
                          "
                        >

                          <Icon
                            className="
                              w-4
                              h-4
                              text-[#D4AF37]
                            "
                          />

                          <p
                            className="
                              mt-2
                              text-[9px]
                              font-mono
                              uppercase
                              tracking-wider
                              text-zinc-500
                            "
                          >
                            {spec.label}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-sm
                              font-semibold
                              text-white
                              break-words
                            "
                          >
                            {spec.value}
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>


                {/* ASSURANCE */}

                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-emerald-500/25
                    bg-emerald-500/10
                    p-3.5
                    flex
                    items-center
                    gap-2
                    sm:gap-2.5
                  "
                >

                  <Award
                    className="w-5 h-5 text-emerald-400 shrink-0"
                  />

                  <div
                    className="text-xs text-zinc-200"
                  >

                    <span
                      className="font-semibold text-emerald-400"
                    >
                      VEHICLE ASSURANCE:
                    </span>

                    {" "}
                    Carefully selected and
                    inspected inventory.

                  </div>

                </div>


                {/* ACTION BUTTONS */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-2.5
                  "
                >

                  {/* BOOK */}

                  <button
                    onClick={handleBook}
                    className="
                      col-span-2
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-[#D4AF37]
                      via-[#fce7a2]
                      to-[#BF953F]
                      py-3.5
                      px-3
                      text-[11px]
                      leading-tight
                      sm:text-xs
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      sm:tracking-widest
                      text-black
                      shadow-[0_10px_25px_rgba(212,175,55,0.25)]
                      hover:brightness-110
                    "
                  >
                    <PhoneCall
                      className="w-4 h-4"
                    />

                    Book Private Viewing
                  </button>


                  {/* CHAT */}

                  <button
                    onClick={handleStartChat}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-900/70
                      py-3
                      px-2
                      text-[11px]
                      leading-tight
                      sm:text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      hover:border-[#D4AF37]
                    "
                  >
                    <MessageCircle
                      className="w-4 h-4"
                    />

                    Chat
                  </button>


                  {/* WHATSAPP */}

                  <a
                    href={`
                      https://wa.me/919916262484
                      ?text=${whatsappMessage}
                    `.replace(/\s/g, "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2 py-3 text-[11px] font-semibold uppercase leading-tight tracking-wider text-emerald-400 hover:bg-emerald-500 hover:text-black sm:text-xs"
                  >
                    <MessageCircle
                      className="w-4 h-4"
                    />

                    WhatsApp
                  </a>


                  {/* CALL */}

                  <button
                    onClick={() =>
                      (window.location.href =
                        "tel:+919916262484")
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-900/70
                      py-3
                      px-2
                      text-[11px]
                      leading-tight
                      sm:text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      hover:border-[#D4AF37]
                    "
                  >
                    <PhoneCall
                      className="w-4 h-4"
                    />

                    Call
                  </button>


                  {/* EMI */}

                  <button
                    onClick={() =>
                      setShowEmi(
                        (value) => !value
                      )
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-900/70
                      py-3
                      px-2
                      text-[11px]
                      leading-tight
                      sm:text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      hover:border-[#D4AF37]
                    "
                  >
                    <Calculator
                      className="w-4 h-4"
                    />

                    {showEmi
                      ? "Hide EMI"
                      : "Calculate EMI"}

                  </button>

                </div>


                {/* EMI */}

                {showEmi && (

                  <div
                    className="
                      mt-4
                      rounded-xl
                      border
                      border-[#D4AF37]/30
                      bg-[#0A0A0C]
                      p-3
                      sm:p-4
                      overflow-hidden
                    "
                  >

                    <EmiCalculator
                      price={carData.price}
                    />

                  </div>

                )}

              </section>


              {/* FEATURES */}

              {carData.features?.length > 0 && (

                <section
                  className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-[#0A0A0C]
                    p-4
                    sm:p-5
                  "
                >

                  <h2
                    className="flex items-center gap-2 text-lg font-bold "
                  >
                    <Zap
                      className="
                        w-5
                        h-5
                        text-[#D4AF37]
                      "
                    />

                    Features & Highlights
                  </h2>


                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-2.5
                    "
                  >

                    {carData.features.map(
                      (feature, index) => (

                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-zinc-200"
                        >

                          <CheckCircle2
                            className="
                              w-4
                              h-4
                              text-[#D4AF37]
                              shrink-0
                            "
                          />

                          {feature}

                        </div>

                      )
                    )}

                  </div>

                </section>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          LIGHTBOX
      ================================================= */}

      {isOpen && total > 0 && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        >

          {/* CLOSE */}

          <button
            className="absolute flex items-center justify-center text-white border rounded-full right-5 top-5 h-11 w-11 border-zinc-700 bg-zinc-900"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <X
              className="w-6 h-6"
            />
          </button>


          {/* PREVIOUS */}

          {total > 1 && (

            <button
              onClick={prev}
              className="absolute p-3 text-white -translate-y-1/2 border rounded-full left-5 top-1/2 border-zinc-700 bg-black/60"
            >
              <ChevronLeft
                className="w-8 h-8"
              />
            </button>

          )}


          {/* NEXT */}

          {total > 1 && (

            <button
              onClick={next}
              className="absolute p-3 text-white -translate-y-1/2 border rounded-full right-5 top-1/2 border-zinc-700 bg-black/60"
            >
              <ChevronRight
                className="w-8 h-8"
              />
            </button>

          )}


          {/* IMAGE */}

          <img
            src={
              images[activeIndex]?.url
            }
            alt={carData.title}
            className="
              max-h-[90vh]
              max-w-[92vw]
              object-contain
            "
          />

        </div>

      )}

    </div>
  );
};


export default CarDetailPage;
