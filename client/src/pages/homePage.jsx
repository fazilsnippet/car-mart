import React from "react";
import kia from "../assets/kia.webp";
import kia1 from "../assets/kia1.webp";
import kia2 from "../assets/kia2.webp";
import kia3 from "../assets/kia3.webp";
import kia4 from "../assets/kia4.jpeg";
export default function HomePage() {
  return (
    <div className="text-gray-800 bg-gray-50">

      {/* HERO */}
      <section className="px-6 py-20 text-center bg-gradient-to-r from-orange-100 to-yellow-100">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Find Your Perfect Ride 🚗
        </h2>
        <p className="mb-6 text-lg text-gray-600">
          "Drive your dreams, not your budget away."
        </p>

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <button className="px-6 py-3 text-white bg-orange-500 rounded-full">
            Find Your Car
          </button>
          <button className="px-6 py-3 text-orange-500 border border-orange-500 rounded-full">
            Sell Your Car
          </button>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="px-6 py-12 bg-white">
        <h3 className="mb-4 text-2xl font-semibold">Find Your Best Car</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            className="flex-1 p-3 border rounded-lg"
            placeholder="Search by brand, model or city"
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
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-6 py-16 text-center">
        <h3 className="mb-10 text-3xl font-semibold">Why Choose Us?</h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white shadow rounded-2xl">
            <img
              src={kia1}
              alt="inspection"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="mb-2 text-lg font-semibold">Verified Cars</h4>
            <p className="text-sm text-gray-500">
              Every car is inspected to ensure quality and reliability.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-2xl">
            <img
              src={kia4}
              alt="deal"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="mb-2 text-lg font-semibold">Best Prices</h4>
            <p className="text-sm text-gray-500">
              Get the best market price without hidden charges.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-2xl">
            <img
              src={kia2}
              alt="delivery"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="mb-2 text-lg font-semibold">Easy Process</h4>
            <p className="text-sm text-gray-500">
              Smooth buying and selling experience from start to finish.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-2xl">
            <img
              src={kia3}
              alt="emi"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="mb-2 text-lg font-semibold">Easy EMI Options</h4>
            <p className="text-sm text-gray-500">
              Flexible EMI plans available to make your purchase affordable.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 text-center py-14 bg-orange-50">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-3xl font-bold">1200+</h4>
            <p>Cars Sold</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold">800+</h4>
            <p>Happy Customers</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold">150+</h4>
            <p>Verified Dealers</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-16 bg-white">
        <h3 className="mb-10 text-3xl font-semibold text-center">
          What Our Customers Say
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((t) => (
            <div key={t} className="p-6 shadow bg-gray-50 rounded-xl">
              <p className="mb-4 text-gray-600">
                "Amazing experience! Got my dream car within days."
              </p>
              <h4 className="font-semibold">Customer {t}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="grid items-center gap-8 px-6 py-16 md:grid-cols-2">
        <img
          src={kia}
          alt="about"
          className="rounded-2xl"
        />
        <div>
          <h3 className="mb-4 text-2xl font-semibold">About Us</h3>
          <p className="mb-4 text-gray-600">
            We help you buy and sell second-hand cars with trust and transparency.
          </p>
          <p className="italic text-gray-500">
            "A good car is not about price, it's about value."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gradient-to-r from-orange-200 to-yellow-200">
        <h3 className="mb-4 text-3xl font-bold">Ready to Get Started?</h3>
        <button className="px-8 py-3 text-white bg-orange-500 rounded-full">
          Explore Cars
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-white bg-gray-800">
        <p>© 2026 AutoResale. All rights reserved.</p>
      </footer>

    </div>
  );
}
