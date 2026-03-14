import { useNavigate } from "react-router-dom";
import { useGetCarsQuery } from "../redux/features/cars/carApi";
import CarCard from "../redux/features/cars/carCard";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineTrendingUp,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const FUEL_SECTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const LISTINGS_PER_BLOCK = 6;
const LISTINGS_PER_FUEL = 4;

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  /* -----------------------------
     Newest Listings (Server-side)
  ----------------------------- */

  const {
    data: newestResponse,
    isLoading: newestLoading,
  } =useGetCarsQuery({
  page: 1,
  limit: 6,
  sortBy: "createdAt",
  order: "desc",
});

  const newestListings = newestResponse?.data ?? [];
  const totalCars = newestResponse?.total ?? 0;

  /* -----------------------------
     Fuel Sections (Parallel Queries)
  ----------------------------- */

  const fuelQueries = FUEL_SECTIONS.map((fuel) =>
    useGetCarsQuery({
      fuelType: [fuel],
      page: 1,
      limit: LISTINGS_PER_FUEL,
    })
  );

  const byFuel = FUEL_SECTIONS.map((fuel, index) => ({
    fuel,
    list: fuelQueries[index].data?.data ?? [],
    loading: fuelQueries[index].isLoading,
  })).filter((section) => section.list.length > 0);

  /* =============================
     USER DASHBOARD
  ============================= */

  if (!isAdmin) {
    return (
      <div className="space-y-10 duration-500 animate-in fade-in">
        
        {/* Newest Listings */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Newest listings
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Recently added cars
              </p>
            </div>
            <button
              onClick={() => navigate("/cars-list")}
              className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>

          {newestLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(LISTINGS_PER_BLOCK)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : newestListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newestListings.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 rounded-xl bg-slate-50">
              No listings yet. Check back later.
            </div>
          )}
        </section>

        {/* Fuel Sections */}
        {byFuel.map(({ fuel, list, loading }) => (
          <section key={fuel}>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {fuel}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {list.length} listing{list.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <button
                onClick={() => navigate(`/cars-list?fuelType=${fuel}`)}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all <HiOutlineArrowRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(LISTINGS_PER_FUEL)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-xl bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    );
  }

  /* =============================
     ADMIN DASHBOARD
  ============================= */

  const stats = [
    {
      label: "Total Inventory",
      value: totalCars,
      change: "+12%",
      icon: HiOutlineCollection,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Leads",
      value: "48",
      change: "+5.1%",
      icon: HiOutlineTrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Sales",
      value: "₹ 12.4M",
      change: "+18%",
      icon: HiOutlineCurrencyDollar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Verifications",
      value: "7",
      change: "-2",
      icon: HiOutlineShieldCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8 duration-700 animate-in fade-in">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 bg-white border shadow-sm rounded-2xl border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-50 text-slate-600">
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}