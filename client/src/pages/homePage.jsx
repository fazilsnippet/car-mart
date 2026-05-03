import React from "react";
import kia from "../assets/kia.webp";
import kia1 from "../assets/kia1.webp";
import kia2 from "../assets/kia2.webp";
import kia3 from "../assets/kia3.webp";
import kia4 from "../assets/kia4.jpeg";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();

  return (
    <div className="text-gray-800 bg-gray-50">

      {/* 🔥 HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
        <img
          src={kia}
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-4xl font-bold md:text-6xl">
            Find Your Perfect Ride 🚗
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Premium cars. Trusted deals. No hassle.
          </p>

          <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => navigate("/cars-list")}
        className="px-6 py-3 font-medium text-white transition bg-orange-500 rounded-full hover:scale-105"
      >
        Explore Cars
      </button>

      <button
        onClick={() => navigate("/sell-car")}
        className="px-6 py-3 font-medium border rounded-full border-white/50 hover:bg-white hover:text-black"
      >
        Sell Your Car
      </button>
    </div>
        </div>
      </section>

      {/* 🔥 FLOATING SEARCH */}
      <div className="relative z-20 max-w-5xl px-4 mx-auto -mt-10">
        <div className="flex flex-col gap-4 p-4 shadow-xl md:flex-row rounded-2xl bg-white/80 backdrop-blur-lg">
          <input
            className="flex-1 p-3 border rounded-lg"
            placeholder="Search brand, model..."
          />
          <select className="p-3 border rounded-lg">
            <option>Budget</option>
            <option>Under 5L</option>
            <option>5L - 10L</option>
            <option>10L+</option>
          </select>
          <button className="px-6 py-3 text-white bg-orange-500 rounded-lg">
            Search
          </button>
        </div>
      </div>

      {/* 🔥 WHY US */}
      <section className="px-6 py-20">
        <h3 className="mb-12 text-3xl font-semibold text-center">
          Why Choose Us
        </h3>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[ 
            { img: kia1, title: "Verified Cars" },
            { img: kia4, title: "Best Prices" },
            { img: kia2, title: "Easy Process" },
            { img: kia3, title: "Easy EMI" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 text-center transition bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2"
            >
              <img
                src={item.img}
                className="object-cover w-20 h-20 mx-auto mb-4 rounded-full"
              />
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-gray-500">
                High quality service with trusted experience.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 STATS */}
      <section className="py-16 text-white bg-linear-to-r from-orange-500 to-yellow-400">
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto text-center md:grid-cols-3">
          <div>
            <h4 className="text-4xl font-bold">1200+</h4>
            <p>Cars Sold</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold">800+</h4>
            <p>Happy Customers</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold">150+</h4>
            <p>Dealers</p>
          </div>
        </div>
      </section>

      {/* 🔥 TESTIMONIALS */}
      <section className="px-6 py-20 bg-white">
        <h3 className="mb-12 text-3xl font-semibold text-center">
          What Customers Say
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((t) => (
            <div
              key={t}
              className="p-6 transition shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl"
            >
              <p className="mb-4 text-gray-600">
                “Got my dream car in 3 days. Super smooth experience.”
              </p>
              <h4 className="font-semibold">Customer {t}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 ABOUT */}
      <section className="grid items-center gap-10 px-6 py-20 md:grid-cols-2">
        <img src={kia} className="shadow-xl rounded-2xl" />

        <div>
          <h3 className="mb-4 text-3xl font-semibold">About Us</h3>
          <p className="mb-4 text-gray-600">
            We make buying and selling cars simple, transparent, and fast.
          </p>
          <p className="italic text-gray-500">
            “It’s not just a car, it’s your journey.”
          </p>
        </div>
      </section>

      {/* 🔥 CTA */}
      <section className="py-20 text-center text-white bg-black">
        <h3 className="mb-4 text-3xl font-bold">
          Ready to Drive Your Dream?
        </h3>
        <button
         onClick={() => navigate("/cars-list")} 
        className="px-8 py-3 mt-4 text-black bg-white rounded-full hover:scale-105">
          Browse Cars
        </button>
      </section>

      {/* 🔥 FOOTER */}
      <footer className="py-6 text-center text-white bg-gray-900">
        <p>© 2026 AutoResale. All rights reserved.</p>
      </footer>
    </div>
  );
}