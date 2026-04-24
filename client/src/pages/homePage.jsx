import React from "react";
export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-800">

      {/* HERO */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-orange-100 to-yellow-100">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Ride 🚗
        </h2>
        <p className="mb-6 text-gray-600 text-lg">
          "Drive your dreams, not your budget away."
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full">
            Find Your Car
          </button>
          <button className="px-6 py-3 border border-orange-500 text-orange-500 rounded-full">
            Sell Your Car
          </button>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-12 px-6 bg-white">
        <h3 className="text-2xl font-semibold mb-4">Find Your Best Car</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 border p-3 rounded-lg"
            placeholder="Search by brand, model or city"
          />
          <select className="border p-3 rounded-lg">
            <option>Budget</option>
            <option>Under 5L</option>
            <option>5L - 10L</option>
            <option>10L+</option>
          </select>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg">
            Search
          </button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6 text-center">
        <h3 className="text-3xl font-semibold mb-10">Why Choose Us?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://source.unsplash.com/100x100/?car,inspection"
              alt="inspection"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="font-semibold text-lg mb-2">Verified Cars</h4>
            <p className="text-gray-500 text-sm">
              Every car is inspected to ensure quality and reliability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://source.unsplash.com/100x100/?car,deal"
              alt="deal"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="font-semibold text-lg mb-2">Best Prices</h4>
            <p className="text-gray-500 text-sm">
              Get the best market price without hidden charges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://source.unsplash.com/100x100/?car,delivery"
              alt="delivery"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="font-semibold text-lg mb-2">Easy Process</h4>
            <p className="text-gray-500 text-sm">
              Smooth buying and selling experience from start to finish.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://source.unsplash.com/100x100/?finance,car"
              alt="emi"
              className="mx-auto mb-4 rounded-full"
            />
            <h4 className="font-semibold text-lg mb-2">Easy EMI Options</h4>
            <p className="text-gray-500 text-sm">
              Flexible EMI plans available to make your purchase affordable.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 px-6 text-center bg-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <section className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-semibold text-center mb-10">
          What Our Customers Say
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((t) => (
            <div key={t} className="p-6 bg-gray-50 rounded-xl shadow">
              <p className="text-gray-600 mb-4">
                "Amazing experience! Got my dream car within days."
              </p>
              <h4 className="font-semibold">Customer {t}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 px-6 grid md:grid-cols-2 gap-8 items-center">
        <img
          src="https://source.unsplash.com/500x400/?car,showroom"
          alt="about"
          className="rounded-2xl"
        />
        <div>
          <h3 className="text-2xl font-semibold mb-4">About Us</h3>
          <p className="text-gray-600 mb-4">
            We help you buy and sell second-hand cars with trust and transparency.
          </p>
          <p className="italic text-gray-500">
            "A good car is not about price, it's about value."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center bg-gradient-to-r from-orange-200 to-yellow-200">
        <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
        <button className="px-8 py-3 bg-orange-500 text-white rounded-full">
          Explore Cars
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-gray-800 text-white">
        <p>© 2026 AutoResale. All rights reserved.</p>
      </footer>

    </div>
  );
}
