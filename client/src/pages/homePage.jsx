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



import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import kia from "../assets/kia.webp";

import { useGetCarsQuery } from "../redux/features/cars/carApi.js";

export default function HomePage() {
  const navigate = useNavigate();

  const { data, isLoading } = useGetCarsQuery({
    limit: 10,
    sort: "-createdAt",
  });

  const cars = data?.data || [];

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="overflow-hidden text-white bg-black">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        {/* background */}
        <img
          src={kia}
          alt=""
          className="absolute inset-0 object-cover w-full h-full"
        />

        {/* overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* content */}
        <div className="relative z-10 flex items-center min-h-screen px-5 md:px-10">
          <div className="max-w-3xl">
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-4 text-sm tracking-[0.4em] uppercase text-orange-400"
            >
              Premium Automotive Marketplace
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl font-black leading-none tracking-tight sm:text-5xl md:text-7xl lg:text-8xl"
            >
              Drive The
              <span className="block text-orange-400">Extraordinary</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-xl mt-6 text-base leading-relaxed text-gray-300 md:text-lg"
            >
              Discover premium vehicles with trusted dealers, transparent
              pricing, and a luxury buying experience.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col gap-4 mt-8 sm:flex-row"
            >
              <button
                onClick={() => navigate("/cars-list")}
                className="px-8 py-4 font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105"
              >
                Explore Cars
              </button>

              <button
                onClick={() => navigate("/sell-car")}
                className="px-8 py-4 font-semibold transition-all duration-300 border rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black"
              >
                Sell Your Car
              </button>
            </motion.div>

            {/* floating stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="grid grid-cols-3 gap-2 mt-12 sm:gap-3"
            >
              {[
                { number: "12K+", label: "Cars Sold" },
                { number: "8K+", label: "Happy Clients" },
                { number: "250+", label: "Dealers" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl sm:p-4"
                >
                  <h3 className="text-xl font-black sm:text-2xl md:text-3xl">
                    {item.number}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 md:text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute transform -translate-x-1/2 bottom-10 left-1/2">
          <div className="flex justify-center w-6 h-10 border rounded-full border-white/30">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 mt-2 bg-white rounded-full"
            />
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="px-5 py-24 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-start justify-between gap-6 mb-14 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
              Featured Collection
            </p>
            <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
              Luxury Cars
            </h2>
          </div>

          <button
            onClick={() => navigate("/cars-list")}
            className="px-6 py-3 transition border rounded-full border-white/10 hover:bg-white hover:text-black"
          >
            View All Cars
          </button>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-3xl bg-white/5"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
          >
            {cars.map((car) => (
              <SwiperSlide key={car._id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="overflow-hidden border group rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl"
                >
                  {/* image */}
                  <div className="relative overflow-hidden h-72">
                    <img
                      src={
                        car?.images?.[0]?.url || car?.images?.[0] || kia
                      }
                      alt={car?.name}
                      className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-xs font-semibold text-white rounded-full bg-black/60 backdrop-blur-xl">
                        {car?.brand}
                      </span>
                    </div>
                  </div>

                  {/* content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">{car?.name}</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {car?.year} • {car?.fuelType}
                        </p>
                      </div>
                      <h4 className="text-2xl font-black text-orange-400">
                        ₹{car?.price?.toLocaleString()}
                      </h4>
                    </div>

                    {/* specs */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="p-3 text-center rounded-2xl bg-white/5">
                        <p className="text-xs text-gray-400">KM</p>
                        <h5 className="mt-1 font-semibold">
                          {car?.kmDriven || 0}
                        </h5>
                      </div>
                      <div className="p-3 text-center rounded-2xl bg-white/5">
                        <p className="text-xs text-gray-400">Fuel</p>
                        <h5 className="mt-1 font-semibold">
                          {car?.fuelType || "Petrol"}
                        </h5>
                      </div>
                      <div className="p-3 text-center rounded-2xl bg-white/5">
                        <p className="text-xs text-gray-400">Gear</p>
                        <h5 className="mt-1 font-semibold">
                          {car?.transmission || "Auto"}
                        </h5>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/car/${car?.slug || car?._id}`)
                      }
                      className="w-full py-4 mt-6 font-semibold text-black transition-all duration-300 bg-white rounded-2xl hover:bg-orange-400"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* WHY US */}
      <section className="px-5 py-24 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-black sm:text-4xl md:text-6xl">
            Built For Trust
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Verified Listings",
              desc: "Every vehicle goes through quality verification.",
            },
            {
              title: "Luxury Experience",
              desc: "A premium and seamless buying process.",
            },
            {
              title: "Trusted Dealers",
              desc: "Partnered with verified automotive dealers.",
            },
            {
              title: "Easy Financing",
              desc: "Flexible EMI and financing options available.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="p-8 transition-all border rounded-3xl border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl rounded-2xl bg-orange-400/20">
                🚘
              </div>
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="grid items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src={kia}
            alt=""
            className="object-cover w-full shadow-2xl rounded-3xl h-[260px] sm:h-[360px] lg:h-[500px]"
          />

          <div className="absolute p-4 border bottom-4 left-4 rounded-2xl border-white/10 bg-black/60 backdrop-blur-xl sm:p-6 sm:bottom-6 sm:left-6 sm:rounded-3xl">
            <h4 className="text-2xl font-black sm:text-3xl">10+</h4>
            <p className="text-gray-300">Years Experience</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
            About Us
          </p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
            The Future Of Premium Car Buying
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-gray-400">
            We redefine the automotive marketplace with transparency, trust, and
            a luxury-first experience designed for modern buyers.
          </p>

          <div className="grid gap-5 mt-10 sm:grid-cols-2">
            {[
              "Verified Premium Cars",
              "Transparent Pricing",
              "Trusted Dealer Network",
              "Luxury Customer Support",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-orange-400/20">
                  ✓
                </div>
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 md:px-10">
        <div className="relative overflow-hidden border rounded-[24px] sm:rounded-[40px] border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-6 sm:p-10 md:p-20">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative z-10 text-center"
          >
            <p className="mb-3 text-sm tracking-[0.3em] uppercase text-orange-400">
              Start Your Journey
            </p>
            <h2 className="max-w-4xl mx-auto text-3xl font-black leading-tight sm:text-4xl md:text-7xl">
              Ready To Find Your Dream Car?
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-300">
              Explore luxury vehicles from trusted dealers and drive home your
              perfect ride today.
            </p>

            <button
              onClick={() => navigate("/cars-list")}
              className="px-10 py-5 mt-10 text-lg font-semibold text-black transition-all duration-300 bg-white rounded-full hover:scale-105 hover:bg-orange-400"
            >
              Browse Cars
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-10 border-t md:px-10 border-white/10">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div>
            <h3 className="text-2xl font-black">AutoResale</h3>
            <p className="mt-2 text-sm text-gray-500">
              Premium Automotive Marketplace
            </p>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 AutoResale. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}