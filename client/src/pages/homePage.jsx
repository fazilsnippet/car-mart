// import React from "react";
// import kia from "../assets/kia.webp";
// import kia1 from "../assets/kia1.webp";
// import kia2 from "../assets/kia2.webp";
// import kia3 from "../assets/kia3.webp";
// import kia4 from "../assets/kia4.jpeg";
// import { useNavigate } from "react-router-dom";

// export default function HomePage() {

//     const navigate = useNavigate();

//   return (
//     <div className="text-gray-800 bg-gray-50">

//       {/* 🔥 HERO */}
//       <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
//         <img
//           src={kia}
//           className="absolute inset-0 object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

//         <div className="relative z-10 max-w-3xl px-6">
//           <h1 className="text-4xl font-bold md:text-6xl">
//             Find Your Perfect Ride 🚗
//           </h1>
//           <p className="mt-4 text-lg text-gray-200">
//             Premium cars. Trusted deals. No hassle.
//           </p>

//           <div className="flex justify-center gap-4 mt-6">
//       <button
//         onClick={() => navigate("/cars-list")}
//         className="px-6 py-3 font-medium text-white transition bg-orange-500 rounded-full hover:scale-105"
//       >
//         Explore Cars
//       </button>

//       <button
//         onClick={() => navigate("/sell-car")}
//         className="px-6 py-3 font-medium border rounded-full border-white/50 hover:bg-white hover:text-black"
//       >
//         Sell Your Car
//       </button>
//     </div>
//         </div>
//       </section>

//       {/* 🔥 WHY US */}
//       <section className="px-6 py-20">
//         <h3 className="mb-12 text-3xl font-semibold text-center">
//           Why Choose Us
//         </h3>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {[ 
//             { img: kia1, title: "Verified Cars" },
//             { img: kia4, title: "Best Prices" },
//             { img: kia2, title: "Easy Process" },
//             { img: kia3, title: "Easy EMI" },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="p-6 text-center transition bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2"
//             >
//               <img
//                 src={item.img}
//                 className="object-cover w-20 h-20 mx-auto mb-4 rounded-full"
//               />
//               <h4 className="text-lg font-semibold">{item.title}</h4>
//               <p className="mt-2 text-sm text-gray-500">
//                 High quality service with trusted experience.
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 🔥 STATS */}
//       <section className="py-16 text-white bg-linear-to-r from-orange-500 to-yellow-400">
//         <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto text-center md:grid-cols-3">
//           <div>
//             <h4 className="text-4xl font-bold">1200+</h4>
//             <p>Cars Sold</p>
//           </div>
//           <div>
//             <h4 className="text-4xl font-bold">800+</h4>
//             <p>Happy Customers</p>
//           </div>
//           <div>
//             <h4 className="text-4xl font-bold">150+</h4>
//             <p>Dealers</p>
//           </div>
//         </div>
//       </section>

//       {/* 🔥 TESTIMONIALS */}
//       <section className="px-6 py-20 bg-white">
//         <h3 className="mb-12 text-3xl font-semibold text-center">
//           What Customers Say
//         </h3>

//         <div className="grid gap-6 md:grid-cols-3">
//           {[1, 2, 3].map((t) => (
//             <div
//               key={t}
//               className="p-6 transition shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl"
//             >
//               <p className="mb-4 text-gray-600">
//                 “Got my dream car in 3 days. Super smooth experience.”
//               </p>
//               <h4 className="font-semibold">Customer {t}</h4>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 🔥 ABOUT */}
//       <section className="grid items-center gap-10 px-6 py-20 md:grid-cols-2">
//         <img src={kia} className="shadow-xl rounded-2xl" />

//         <div>
//           <h3 className="mb-4 text-3xl font-semibold">About Us</h3>
//           <p className="mb-4 text-gray-600">
//             We make buying and selling cars simple, transparent, and fast.
//           </p>
//           <p className="italic text-gray-500">
//             “It’s not just a car, it’s your journey.”
//           </p>
//         </div>
//       </section>

//       {/* 🔥 CTA */}
//       <section className="py-20 text-center text-white bg-black">
//         <h3 className="mb-4 text-3xl font-bold">
//           Ready to Drive Your Dream?
//         </h3>
//         <button
//          onClick={() => navigate("/cars-list")} 
//         className="px-8 py-3 mt-4 text-black bg-white rounded-full hover:scale-105">
//           Browse Cars
//         </button>
//       </section>

//       {/* 🔥 FOOTER */}
//       <footer className="py-6 text-center text-white bg-gray-900">
//         <p>© 2026 AutoResale. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";

// import kia from "../assets/kia.webp";

// import { useGetCarsQuery } from "../redux/features/cars/carApi.js";

// export default function HomePage() {
//   const navigate = useNavigate();

//   const { data, isLoading } = useGetCarsQuery({
//     limit: 10,
//     sort: "-createdAt",
//   });

//   const cars = data?.data || [];

//   const fadeUp = {
//     hidden: {
//       opacity: 0,
//       y: 60,
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//       },
//     },
//   };

//   return (
//     <div className="overflow-hidden text-white bg-black">
//       {/* HERO */}
//       <section className="relative min-h-screen overflow-hidden">
//         {/* background */}
//         <img
//           src={kia}
//           alt=""
//           className="absolute inset-0 object-cover w-full h-full"
//         />

//         {/* overlays */}
//         <div className="absolute inset-0 bg-black/60" />
//         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

//         {/* content */}
//         <div className="relative z-10 flex items-center min-h-screen px-5 md:px-10">
//           <div className="max-w-3xl">
//             <motion.p
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               className="mb-4 text-sm tracking-[0.4em] uppercase text-orange-400"
//             >
//               Premium Automotive Marketplace
//             </motion.p>

//             <motion.h1
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               className="text-4xl font-black leading-none tracking-tight sm:text-5xl md:text-7xl lg:text-8xl"
//             >
//               Drive The
//               <span className="block text-orange-400">Extraordinary</span>
//             </motion.h1>

//             <motion.p
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               className="max-w-xl mt-6 text-base leading-relaxed text-gray-300 md:text-lg"
//             >
//               Discover premium vehicles with trusted dealers, transparent
//               pricing, and a luxury buying experience.
//             </motion.p>

//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               className="flex flex-col gap-4 mt-8 sm:flex-row"
//             >
//               <button
//                 onClick={() => navigate("/cars-list")}
//                 className="px-8 py-4 font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105"
//               >
//                 Explore Cars
//               </button>

//               <button
//                 onClick={() => navigate("/sell-car")}
//                 className="px-8 py-4 font-semibold transition-all duration-300 border rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black"
//               >
//                 Sell Your Car
//               </button>
//             </motion.div>

//             {/* floating stats */}
//             <motion.div
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               className="grid grid-cols-3 gap-2 mt-12 sm:gap-3"
//             >
//               {[
//                 { number: "12K+", label: "Cars Sold" },
//                 { number: "8K+", label: "Happy Clients" },
//                 { number: "250+", label: "Dealers" },
//               ].map((item, i) => (
//                 <div
//                   key={i}
//                   className="p-3 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl sm:p-4"
//                 >
//                   <h3 className="text-xl font-black sm:text-2xl md:text-3xl">
//                     {item.number}
//                   </h3>
//                   <p className="mt-1 text-xs text-gray-400 md:text-sm">
//                     {item.label}
//                   </p>
//                 </div>
//               ))}
//             </motion.div>
//           </div>
//         </div>

//         {/* scroll indicator */}
//         <div className="absolute transform -translate-x-1/2 bottom-10 left-1/2">
//           <div className="flex justify-center w-6 h-10 border rounded-full border-white/30">
//             <motion.div
//               animate={{ y: [0, 12, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5 }}
//               className="w-1 h-3 mt-2 bg-white rounded-full"
//             />
//           </div>
//         </div>
//       </section>

//       {/* FEATURED CARS */}
//       <section className="px-5 py-24 md:px-10">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           className="flex flex-col items-start justify-between gap-6 mb-14 md:flex-row md:items-end"
//         >
//           <div>
//             <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
//               Featured Collection
//             </p>
//             <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
//               Luxury Cars
//             </h2>
//           </div>

//           <button
//             onClick={() => navigate("/cars-list")}
//             className="px-6 py-3 transition border rounded-full border-white/10 hover:bg-white hover:text-black"
//           >
//             View All Cars
//           </button>
//         </motion.div>

//         {isLoading ? (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-[420px] animate-pulse rounded-3xl bg-white/5"
//               />
//             ))}
//           </div>
//         ) : (
//           <Swiper
//             modules={[Autoplay, Pagination]}
//             autoplay={{ delay: 3000 }}
//             pagination={{ clickable: true }}
//             spaceBetween={24}
//             breakpoints={{
//               0: { slidesPerView: 1 },
//               768: { slidesPerView: 2 },
//               1200: { slidesPerView: 3 },
//             }}
//           >
//             {cars.map((car) => (
//               <SwiperSlide key={car._id}>
//                 <motion.div
//                   whileHover={{ y: -10 }}
//                   className="overflow-hidden border group rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl"
//                 >
//                   {/* image */}
//                   <div className="relative overflow-hidden h-72">
//                     <img
//                       src={
//                         car?.images?.[0]?.url || car?.images?.[0] || kia
//                       }
//                       alt={car?.name}
//                       className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
//                     <div className="absolute top-4 left-4">
//                       <span className="px-4 py-2 text-xs font-semibold text-white rounded-full bg-black/60 backdrop-blur-xl">
//                         {car?.brand}
//                       </span>
//                     </div>
//                   </div>

//                   {/* content */}
//                   <div className="p-6">
//                     <div className="flex items-start justify-between gap-4">
//                       <div>
//                         <h3 className="text-2xl font-bold">{car?.name}</h3>
//                         <p className="mt-1 text-sm text-gray-400">
//                           {car?.year} • {car?.fuelType}
//                         </p>
//                       </div>
//                       <h4 className="text-2xl font-black text-orange-400">
//                         ₹{car?.price?.toLocaleString()}
//                       </h4>
//                     </div>

//                     {/* specs */}
//                     <div className="grid grid-cols-3 gap-3 mt-6">
//                       <div className="p-3 text-center rounded-2xl bg-white/5">
//                         <p className="text-xs text-gray-400">KM</p>
//                         <h5 className="mt-1 font-semibold">
//                           {car?.kmDriven || 0}
//                         </h5>
//                       </div>
//                       <div className="p-3 text-center rounded-2xl bg-white/5">
//                         <p className="text-xs text-gray-400">Fuel</p>
//                         <h5 className="mt-1 font-semibold">
//                           {car?.fuelType || "Petrol"}
//                         </h5>
//                       </div>
//                       <div className="p-3 text-center rounded-2xl bg-white/5">
//                         <p className="text-xs text-gray-400">Gear</p>
//                         <h5 className="mt-1 font-semibold">
//                           {car?.transmission || "Auto"}
//                         </h5>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() =>
//                         navigate(`/car/${car?.slug || car?._id}`)
//                       }
//                       className="w-full py-4 mt-6 font-semibold text-black transition-all duration-300 bg-white rounded-2xl hover:bg-orange-400"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </motion.div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         )}
//       </section>

//       {/* WHY US */}
//       <section className="px-5 py-24 md:px-10">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           className="text-center mb-14"
//         >
//           <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
//             Why Choose Us
//           </p>
//           <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
//             Built For Trust
//           </h2>
//         </motion.div>

//         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//           {[
//             {
//               title: "Verified Listings",
//               desc: "Every vehicle goes through quality verification.",
//             },
//             {
//               title: "Luxury Experience",
//               desc: "A premium and seamless buying process.",
//             },
//             {
//               title: "Trusted Dealers",
//               desc: "Partnered with verified automotive dealers.",
//             },
//             {
//               title: "Easy Financing",
//               desc: "Flexible EMI and financing options available.",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={fadeUp}
//               whileHover={{ y: -10 }}
//               className="p-8 transition-all border rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl"
//             >
//               <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl rounded-2xl bg-orange-400/20">
//                 🚘
//               </div>
//               <h3 className="text-2xl font-bold">{item.title}</h3>
//               <p className="mt-4 leading-relaxed text-gray-400">{item.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ABOUT */}
//       <section className="grid items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2">
//         <motion.div
//           initial={{ opacity: 0, x: -60 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="relative"
//         >
//           <img
//             src={kia}
//             alt=""
//             className="object-cover w-full shadow-2xl rounded-3xl h-[260px] sm:h-[360px] lg:h-[500px]"
//           />

//           <div className="absolute p-4 border bottom-4 left-4 rounded-2xl border-white/10 bg-black/60 backdrop-blur-xl sm:p-6 sm:bottom-6 sm:left-6 sm:rounded-3xl">
//             <h4 className="text-2xl font-black sm:text-3xl">10+</h4>
//             <p className="text-gray-300">Years Experience</p>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 60 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
//             About Us
//           </p>
//           <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
//             The Future Of Premium Car Buying
//           </h2>

//           <p className="mt-8 text-lg leading-relaxed text-gray-400">
//             We redefine the automotive marketplace with transparency, trust, and
//             a luxury-first experience designed for modern buyers.
//           </p>

//           <div className="grid gap-5 mt-10 sm:grid-cols-2">
//             {[
//               "Verified Premium Cars",
//               "Transparent Pricing",
//               "Trusted Dealer Network",
//               "Luxury Customer Support",
//             ].map((item, i) => (
//               <div key={i} className="flex items-center gap-3">
//                 <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-orange-400/20">
//                   ✓
//                 </div>
//                 <p className="font-medium">{item}</p>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </section>

//       {/* CTA */}
//       <section className="px-5 py-24 md:px-10">
//         <div className="relative overflow-hidden border rounded-[24px] sm:rounded-[40px] border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-6 sm:p-10 md:p-20">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={fadeUp}
//             className="relative z-10 text-center"
//           >
//             <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
//               Start Your Journey
//             </p>
//             <h2 className="max-w-4xl mx-auto text-3xl font-black leading-tight sm:text-4xl md:text-7xl">
//               Ready To Find Your Dream Car?
//             </h2>

//             <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-300">
//               Explore luxury vehicles from trusted dealers and drive home your
//               perfect ride today.
//             </p>

//             <button
//               onClick={() => navigate("/cars-list")}
//               className="px-10 py-5 mt-10 text-lg font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105 hover:bg-orange-400"
//             >
//               Browse Cars
//             </button>
//           </motion.div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="px-5 py-10 border-t md:px-10 border-white/10">
//         <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
//           <div>
//             <h3 className="text-2xl font-black">AutoResale</h3>
//             <p className="mt-2 text-sm text-gray-500">
//               Premium Automotive Marketplace
//             </p>
//           </div>
//           <p className="text-sm text-gray-500">
//             © 2026 AutoResale. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }


import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import kia from "../assets/kia.webp";
import { useGetCarsQuery } from "../redux/features/cars/carApi.js";

export default function HomePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCarsQuery({
    limit: 12,
    sort: "-createdAt",
  });

  const cars = data?.data || [];

  /* =========================================================
     EMI CALCULATOR
  ========================================================= */

  const [carPrice, setCarPrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [interestRate, setInterestRate] = useState(9);
  const [loanYears, setLoanYears] = useState(5);

  const emi = useMemo(() => {
    const principal = Math.max(carPrice - downPayment, 0);
    const months = loanYears * 12;
    const monthlyRate = interestRate / 12 / 100;

    if (!principal || !months) return 0;

    if (!monthlyRate) {
      return principal / months;
    }

    const value =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return value;
  }, [carPrice, downPayment, interestRate, loanYears]);

  const formatPrice = (value) => {
    return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
  };

  /* =========================================================
     ANIMATION
  ========================================================= */

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const fadeLeft = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const fadeRight = {
    hidden: {
      opacity: 0,
      x: 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  /* =========================================================
     DATA
  ========================================================= */

  const categories = [
    {
      title: "Petrol",
      subtitle: "Smooth & Powerful",
      icon: "⛽",
      value: "PETROL",
    },
    {
      title: "Diesel",
      subtitle: "Built For Distance",
      icon: "◉",
      value: "DIESEL",
    },
    {
      title: "Electric",
      subtitle: "Future Driven",
      icon: "⚡",
      value: "EV",
    },
    {
      title: "Hybrid",
      subtitle: "Best Of Both Worlds",
      icon: "♻",
      value: "HYBRID",
    },
  ];

  const testimonials = [
    {
      name: "Rahul K.",
      role: "Verified Customer",
      text: "The entire buying experience was extremely smooth. The car was exactly as described and the inspection gave me complete confidence.",
    },
    {
      name: "Mohammed A.",
      role: "Verified Customer",
      text: "Professional team, transparent pricing and no unnecessary pressure. I found my car within a few days.",
    },
    {
      name: "Sneha R.",
      role: "Verified Customer",
      text: "The showroom experience felt premium from beginning to end. The inspection process was especially impressive.",
    },
  ];

  const getCarImage = (car) =>
    car?.images?.[0]?.url ||
    car?.images?.[0] ||
    kia;

  const getCarName = (car) =>
    car?.title ||
    car?.name ||
    `${car?.brand || "Premium"} Automobile`;

  const getVariant = (car) =>
    car?.variant ||
    car?.model ||
    "Premium Variant";

  /* =========================================================
     HERO
  ========================================================= */

  return (
    <main className="overflow-hidden bg-[#080808] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative h-[90vh] min-h-[650px] max-h-[950px] overflow-hidden">

        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={cars.length > 1}
          className="w-full h-full"
        >
          {(cars.length ? cars.slice(0, 5) : [{}, {}, {}]).map(
            (car, index) => (
              <SwiperSlide key={car?._id || index}>
                <div className="relative w-full h-full">

                  {/* Background image */}

                  <img
                    src={getCarImage(car)}
                    alt={getCarName(car)}
                    className="absolute inset-0 object-cover w-full h-full"
                  />

                  {/* Dark overlays */}

                  <div className="absolute inset-0 bg-black/45" />

                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/20" />

                  {/* Hero content */}

                  <div className="relative z-10 flex items-center h-full px-5 sm:px-8 lg:px-14 xl:px-20">

                    <div className="w-full mx-auto max-w-7xl">

                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="max-w-3xl"
                      >

                        <p className="mb-5 text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-amber-400">
                          Premium Pre-Owned Collection
                        </p>

                        <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                          Drive
                          <span className="block text-white">
                            Something
                          </span>
                          <span className="block text-amber-400">
                            Exceptional.
                          </span>
                        </h1>

                        {cars.length > 0 && (
                          <div className="mt-7">

                            <p className="text-xl font-semibold sm:text-2xl">
                              {getCarName(car)}
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                              {getVariant(car)}
                              {car?.year
                                ? ` • ${car.year}`
                                : ""}
                            </p>

                            {car?.price && (
                              <p className="mt-4 text-2xl font-bold">
                                {formatPrice(car.price)}
                              </p>
                            )}

                          </div>
                        )}

                        {/* <p className="max-w-xl mt-6 text-sm leading-7 text-gray-300 sm:text-base">
                          Carefully selected vehicles, transparent pricing
                          and a premium buying experience built around trust.
                        </p> */}

                        {/* <div className="flex flex-col gap-3 mt-8 sm:flex-row">

                          <button
                            onClick={() => navigate("/cars-list")}
                            className="px-8 py-4 font-semibold text-black transition duration-300 bg-white rounded-full hover:-translate-y-1 hover:bg-amber-400"
                          >
                            Explore Collection
                          </button>

                          <button
                            onClick={() => navigate("/sell-car")}
                            className="px-8 py-4 font-semibold transition duration-300 border rounded-full border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white hover:text-black"
                          >
                            Sell Your Car
                          </button>

                        </div> */}

                      </motion.div>

                    </div>

                  </div>

                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>

        {/* Hero bottom information */}

        <div className="absolute left-0 right-0 z-20 px-5 bottom-8 sm:px-8 lg:px-14">

          <div className="flex flex-col gap-4 mx-auto max-w-7xl sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-2 text-xs text-gray-400">
              <span className="px-4 py-2 border rounded-full border-white/10 bg-black/30 backdrop-blur-xl">
                ✓ Inspected Vehicles
              </span>

              <span className="hidden px-4 py-2 border rounded-full border-white/10 bg-black/30 backdrop-blur-xl sm:block">
                ✓ Transparent Pricing
              </span>
            </div>

            <div className="hidden text-xs tracking-[0.25em] text-gray-500 uppercase md:block">
              Premium Automotive Experience
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED CARS
      ===================================================== */}

      <section className="px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1800px]">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between"
          >

            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                Our Collection
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Featured Cars
              </h2>

              <p className="max-w-xl mt-4 text-sm leading-6 text-gray-500">
                Explore our latest selection of carefully inspected
                pre-owned vehicles.
              </p>

            </div>

            <button
              onClick={() => navigate("/cars-list")}
              className="px-6 py-3 text-sm transition border rounded-full w-fit border-white/10 hover:bg-white hover:text-black"
            >
              View All Cars →
            </button>

          </motion.div>


          {isLoading ? (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-3xl bg-white/[0.04]"
                />
              ))}

            </div>

          ) : (

            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation
              spaceBetween={16}
              slidesPerView={1.15}
              breakpoints={{
                480: {
                  slidesPerView: 1.4,
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 18,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 18,
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 18,
                },
              }}
              className="premium-cars-swiper pb-14"
            >

              {cars.map((car) => (

                <SwiperSlide key={car._id}>

                  <motion.article
                    whileHover={{
                      y: -8,
                    }}
                    className="group overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111111] transition duration-500 hover:border-white/20"
                  >

                    {/* Image */}

                    <div className="relative overflow-hidden h-52">

                      <img
                        src={getCarImage(car)}
                        alt={getCarName(car)}
                        className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                      <div className="absolute left-3 top-3">

                        {/* <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-xl">
                          {car?.brand || "Premium"}
                        </span> */}

                      </div>

                      {car?.year && (
                        <div className="absolute bottom-3 right-3">

                          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-black">
                            {car.year}
                          </span>

                        </div>
                      )}

                    </div>


                    {/* Details */}

                    <div className="p-4">

                      <h3 className="text-lg font-bold truncate">
                        {getCarName(car)}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {getVariant(car)}
                      </p>

                      <p className="mt-4 text-lg font-black text-amber-400">
                        {formatPrice(car?.price)}
                      </p>


                      {/* Specs */}

                      <div className="grid grid-cols-3 gap-1 mt-4">

                        <div className="rounded-xl bg-white/[0.04] p-2 text-center">
                          <p className="text-[9px] uppercase text-gray-600">
                            KM
                          </p>

                          <p className="mt-1 truncate text-[11px] font-semibold text-gray-300">
                            {Number(
                              car?.kmDriven || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>


                        <div className="rounded-xl bg-white/[0.04] p-2 text-center">
                          <p className="text-[9px] uppercase text-gray-600">
                            Fuel
                          </p>

                          <p className="mt-1 truncate text-[11px] font-semibold text-gray-300">
                            {car?.fuelType || "—"}
                          </p>
                        </div>


                        <div className="rounded-xl bg-white/[0.04] p-2 text-center">
                          <p className="text-[9px] uppercase text-gray-600">
                            Year
                          </p>

                          <p className="mt-1 text-[11px] font-semibold text-gray-300">
                            {car?.year || "—"}
                          </p>
                        </div>

                      </div>


                      <button
                        onClick={() =>
                          navigate(
                            `/car/${car?.slug || car?._id}`
                          )
                        }
                        className="w-full py-3 mt-4 text-xs font-semibold transition border rounded-xl border-white/10 hover:bg-white hover:text-black"
                      >
                        View Vehicle
                      </button>

                    </div>

                  </motion.article>

                </SwiperSlide>

              ))}

            </Swiper>

          )}

        </div>

      </section>


      {/* =====================================================
          CATEGORY
      ===================================================== */}

      <section className="border-y border-white/[0.05] bg-[#0d0d0d] px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 text-center"
          >

            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-400">
              Find Your Power
            </p>

            <h2 className="text-4xl font-black sm:text-5xl">
              Browse By Fuel
            </h2>

          </motion.div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category, index) => (

              <motion.button
                key={category.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                onClick={() => navigate("/cars-list")}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#141414] p-8 text-left transition"
              >

                <div className="absolute w-32 h-32 transition rounded-full -right-10 -top-10 bg-amber-400/10 blur-3xl group-hover:bg-amber-400/20" />

                <div className="relative">

                  <div className="mb-8 text-4xl">
                    {category.icon}
                  </div>

                  <h3 className="text-2xl font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {category.subtitle}
                  </p>

                  <span className="inline-block mt-8 text-sm font-semibold text-amber-400">
                    Explore {category.title} →
                  </span>

                </div>

              </motion.button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUST / COMPANY DETAILS
      ===================================================== */}

      <section className="px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeLeft}
            >

              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-400">
                Why Choose Us
              </p>

              <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Confidence Comes
                <span className="block text-gray-500">
                  Standard.
                </span>
              </h2>

              <p className="max-w-xl mt-6 text-sm leading-7 text-gray-500">
                Buying a pre-owned car should never feel uncertain.
                Every vehicle is selected, inspected and presented
                with transparency.
              </p>

              <button
                onClick={() => navigate("/cars-list")}
                className="py-3 mt-8 text-sm font-semibold text-black transition bg-white rounded-full px-7 hover:bg-amber-400"
              >
                Explore Our Cars
              </button>

            </motion.div>


            <div className="grid gap-4 sm:grid-cols-2">

              {[
                {
                  number: "10+",
                  title: "Years Experience",
                  description:
                    "Deep automotive experience and market knowledge.",
                },
                {
                  number: "8K+",
                  title: "Happy Customers",
                  description:
                    "Thousands of customers have trusted us.",
                },
                {
                  number: "100%",
                  title: "Inspection",
                  description:
                    "Vehicles undergo a detailed inspection process.",
                },
                {
                  number: "24/7",
                  title: "Customer Support",
                  description:
                    "We're here before, during and after your purchase.",
                },
              ].map((item, index) => (

                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                  }}
                  variants={fadeUp}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="rounded-3xl border border-white/[0.07] bg-[#111111] p-7"
                >

                  <p className="text-4xl font-black text-amber-400">
                    {item.number}
                  </p>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INSPECTION GUARANTEE
      ===================================================== */}

      <section className="px-5 py-10 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <div className="relative overflow-hidden rounded-[35px] border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.12] via-[#111111] to-[#111111] p-8 sm:p-12 lg:p-16">

            <div className="absolute w-64 h-64 rounded-full -right-20 -top-20 bg-amber-400/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
                  Our Promise
                </p>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  Every Car. Thoroughly Inspected.
                </h2>

                <p className="max-w-2xl mt-4 text-sm leading-7 text-gray-400">
                  We believe transparency starts before you take the
                  keys. Our inspection process is designed to help
                  you understand exactly what you're buying.
                </p>

              </div>

              <div className="flex items-center justify-center w-24 h-24 text-4xl border rounded-full border-amber-400/30 bg-amber-400/10">
                ✓
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          EMI CALCULATOR
      ===================================================== */}

      <section className="px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1400px]">

          <div className="grid overflow-hidden rounded-[35px] border border-white/[0.07] bg-[#101010] lg:grid-cols-2">

            {/* Left */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={fadeLeft}
              className="p-8 sm:p-12 lg:p-16"
            >

              <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
                Finance Your Drive
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Calculate Your EMI
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-500">
                Get an estimate of your monthly payment before
                you choose your vehicle.
              </p>


              {/* Price */}

              <div className="mt-10">

                <div className="flex justify-between mb-3">

                  <label className="text-sm text-gray-400">
                    Car Price
                  </label>

                  <span className="font-semibold">
                    {formatPrice(carPrice)}
                  </span>

                </div>

                <input
                  type="range"
                  min="300000"
                  max="10000000"
                  step="50000"
                  value={carPrice}
                  onChange={(e) =>
                    setCarPrice(Number(e.target.value))
                  }
                  className="w-full accent-amber-400"
                />

              </div>


              {/* Down payment */}

              <div className="mt-8">

                <div className="flex justify-between mb-3">

                  <label className="text-sm text-gray-400">
                    Down Payment
                  </label>

                  <span className="font-semibold">
                    {formatPrice(downPayment)}
                  </span>

                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.max(carPrice, 100000)}
                  step="10000"
                  value={Math.min(downPayment, carPrice)}
                  onChange={(e) =>
                    setDownPayment(Number(e.target.value))
                  }
                  className="w-full accent-amber-400"
                />

              </div>


              {/* Interest */}

              <div className="mt-8">

                <div className="flex justify-between mb-3">

                  <label className="text-sm text-gray-400">
                    Interest Rate
                  </label>

                  <span className="font-semibold">
                    {interestRate}%
                  </span>

                </div>

                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(Number(e.target.value))
                  }
                  className="w-full accent-amber-400"
                />

              </div>


              {/* Duration */}

              <div className="mt-8">

                <div className="flex justify-between mb-3">

                  <label className="text-sm text-gray-400">
                    Loan Duration
                  </label>

                  <span className="font-semibold">
                    {loanYears} Years
                  </span>

                </div>

                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={loanYears}
                  onChange={(e) =>
                    setLoanYears(Number(e.target.value))
                  }
                  className="w-full accent-amber-400"
                />

              </div>

            </motion.div>


            {/* Result */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={fadeRight}
              className="flex flex-col justify-center bg-gradient-to-br from-amber-400/[0.12] to-transparent p-8 sm:p-12 lg:p-16"
            >

              <p className="text-sm text-gray-500">
                Estimated Monthly EMI
              </p>

              <p className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
                {formatPrice(emi)}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                per month
              </p>


              <div className="pt-8 mt-10 space-y-4 border-t border-white/10">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Vehicle Price
                  </span>

                  <span>
                    {formatPrice(carPrice)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Down Payment
                  </span>

                  <span>
                    {formatPrice(downPayment)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Interest
                  </span>

                  <span>
                    {interestRate}%
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Tenure
                  </span>

                  <span>
                    {loanYears} Years
                  </span>

                </div>

              </div>


              <button
                onClick={() => navigate("/cars-list")}
                className="py-4 mt-10 text-sm font-semibold text-black transition bg-white rounded-full px-7 hover:bg-amber-400"
              >
                Find A Car
              </button>

              <p className="mt-4 text-center text-[10px] leading-5 text-gray-600">
                EMI shown is an estimate and may vary depending
                on lender terms and eligibility.
              </p>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SELL YOUR CAR
      ===================================================== */}

      <section className="px-5 py-10 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-[35px] bg-white p-8 text-black sm:p-12 lg:p-20"
          >

            <div className="relative z-10 max-w-3xl">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                Ready For Your Next Car?
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                Sell Your Car.
                <span className="block text-gray-400">
                  Upgrade Your Life.
                </span>
              </h2>

              <p className="max-w-xl mt-6 text-sm leading-7 text-gray-600">
                Get a fair valuation for your vehicle and make
                your next automotive move with confidence.
              </p>

              <button
                onClick={() => navigate("/sell-car")}
                className="px-8 py-4 mt-8 text-sm font-semibold text-white transition bg-black rounded-full hover:bg-amber-400 hover:text-black"
              >
                Sell My Car →
              </button>

            </div>


            <div className="absolute rounded-full -bottom-20 -right-20 h-72 w-72 bg-amber-400/30 blur-3xl" />

            <div className="absolute right-10 top-10 hidden text-[180px] font-black leading-none text-black/[0.025] lg:block">
              SELL
            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1200px]">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={fadeUp}
            className="mb-12 text-center"
          >

            <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
              Customer Stories
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              What Our Clients Say
            </h2>

          </motion.div>


          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            className="pb-14"
          >

            {testimonials.map((testimonial) => (

              <SwiperSlide key={testimonial.name}>

                <div className="rounded-[35px] border border-white/[0.07] bg-[#111111] p-8 text-center sm:p-14">

                  <div className="text-2xl tracking-[0.2em] text-amber-400">
                    ★★★★★
                  </div>

                  <p className="max-w-3xl mx-auto mt-8 text-lg leading-8 text-gray-300 sm:text-2xl">
                    “{testimonial.text}”
                  </p>

                  <div className="mt-8">

                    <p className="font-bold">
                      {testimonial.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {testimonial.role}
                    </p>

                  </div>

                </div>

              </SwiperSlide>

            ))}

          </Swiper>

        </div>

      </section>


      {/* =====================================================
          SHOWROOM LOCATION
      ===================================================== */}

      <section className="border-t border-white/[0.05] px-5 py-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <div className="grid overflow-hidden rounded-[35px] border border-white/[0.07] bg-[#101010] lg:grid-cols-2">

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">

              <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
                Visit Us
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Experience The Cars
                <span className="block text-gray-500">
                  In Person.
                </span>
              </h2>

              <p className="max-w-lg mt-6 text-sm leading-7 text-gray-500">
                Visit our showroom, explore our collection and
                speak with our automotive specialists.
              </p>


              <div className="mt-8 space-y-5">

                <div>

                  <p className="text-xs tracking-wider text-gray-600 uppercase">
                    Showroom
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Mangalore, Karnataka, India
                  </p>

                </div>


                <div>

                  <p className="text-xs tracking-wider text-gray-600 uppercase">
                    Opening Hours
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Monday – Saturday · 9:00 AM – 7:00 PM
                  </p>

                </div>

              </div>


              <button
                className="py-3 mt-8 text-sm transition border rounded-full w-fit border-white/10 px-7 hover:bg-white hover:text-black"
                onClick={() => {
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=Mangalore+Karnataka",
                    "_blank"
                  );
                }}
              >
                Get Directions →
              </button>

            </div>


            {/* Map placeholder */}

            <div className="relative min-h-[400px] overflow-hidden bg-[#151515]">

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="flex items-center justify-center w-20 h-20 mx-auto text-4xl rounded-full bg-amber-400/10">
                    📍
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Our Showroom
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Mangalore, Karnataka
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-5 pb-24 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1400px] text-center">

          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">
            Your Next Drive
          </p>

          <h2 className="max-w-4xl mx-auto mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
            Your Dream Car
            <span className="block text-gray-500">
              Is Waiting.
            </span>
          </h2>

          <button
            onClick={() => navigate("/cars-list")}
            className="px-10 py-4 mt-10 font-semibold text-black transition bg-white rounded-full hover:scale-105 hover:bg-amber-400"
          >
            Explore Cars →
          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.07] bg-[#050505] px-5 py-14 sm:px-8 lg:px-14">

        <div className="mx-auto max-w-[1600px]">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}

            <div>

              <h3 className="text-2xl font-black tracking-tight">
                Auto<span className="text-amber-400">Resale</span>
              </h3>

              <p className="max-w-xs mt-4 text-sm leading-6 text-gray-600">
                Premium pre-owned vehicles with transparency,
                trust and an experience built around you.
              </p>

            </div>


            {/* Explore */}

            <div>

              <h4 className="text-sm font-semibold">
                Explore
              </h4>

              <div className="mt-5 space-y-3 text-sm text-gray-600">

                <button
                  onClick={() => navigate("/cars-list")}
                  className="block transition hover:text-white"
                >
                  All Cars
                </button>

                <button
                  onClick={() => navigate("/cars-list")}
                  className="block transition hover:text-white"
                >
                  Petrol
                </button>

                <button
                  onClick={() => navigate("/cars-list")}
                  className="block transition hover:text-white"
                >
                  Electric
                </button>

              </div>

            </div>


            {/* Services */}

            <div>

              <h4 className="text-sm font-semibold">
                Services
              </h4>

              <div className="mt-5 space-y-3 text-sm text-gray-600">

                <button
                  onClick={() => navigate("/sell-car")}
                  className="block transition hover:text-white"
                >
                  Sell Your Car
                </button>

                <button
                  onClick={() => navigate("/cars-list")}
                  className="block transition hover:text-white"
                >
                  Finance
                </button>

                <button
                  onClick={() => navigate("/cars-list")}
                  className="block transition hover:text-white"
                >
                  Vehicle Inspection
                </button>

              </div>

            </div>


            {/* Contact */}

            <div>

              <h4 className="text-sm font-semibold">
                Contact
              </h4>

              <div className="mt-5 space-y-3 text-sm text-gray-600">

                <p>
                  Mangalore, Karnataka
                </p>

                <p>
                  India
                </p>

                <p>
                  Mon – Sat · 9 AM – 7 PM
                </p>

              </div>

            </div>

          </div>


          <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.05] pt-7 text-xs text-gray-700 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © 2026 AutoResale. All rights reserved.
            </p>

            <p>
              Premium Automotive Marketplace
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}





