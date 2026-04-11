// pages/Home.jsx
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-10">

      {/* 🔹 Hero */}
      <section className="p-6 bg-gray-100 rounded-xl bg-background text-foreground">
        <h1 className="mb-4 text-2xl font-bold">
          Find Your Perfect Car
        </h1>

        <input
          type="text"
          placeholder="Search by brand, price, model..."
          className="w-full p-3 border rounded-lg"
        />
      </section>

      {/* 🔹 Logged-in sections */}
      {user && (
        <>
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Continue Your Search
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </section>
        </>
      )}

      {/* 🔹 Common */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">
          Trending Cars
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </section>

    </div>
  );
};

export default Home;