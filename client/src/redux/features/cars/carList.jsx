import { useMemo, useState } from "react";
import { useGetCarsQuery } from "./carApi";
import { useGetBrandsQuery } from "../brands/brandApi";
import CarCard from "./carCard";
import CarFilters from "./CarFilters";
import { useSearchParams } from "react-router-dom";
import { HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";
import Loader from "../ui/loader.jsx"
export default function CarList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const initialFilters = {
    title: "",
    brand: [],
    fuelType: [],
    transmission: [],
    minYear: "",
    maxYear: "",
    minKm: "",
    maxKm: "",
    priceBucket: "",
    sortBy: "createdAt",
    order: "desc",
    page: 1,
    limit: 12
  };

  // const [filters, setFilters] = useState(initialFilters);
const [searchParams, setSearchParams] = useSearchParams();

const filters = useMemo(() => ({
  title: searchParams.get("title") || "",
  brand: searchParams.getAll("brand"),
  fuelType: searchParams.getAll("fuelType"),
  transmission: searchParams.getAll("transmission"),
  minYear: searchParams.get("minYear") || "",
  maxYear: searchParams.get("maxYear") || "",
  minKm: searchParams.get("minKm") || "",
  maxKm: searchParams.get("maxKm") || "",
  priceBucket: searchParams.get("priceBucket") || "",
  sortBy: searchParams.get("sortBy") || "createdAt",
  order: searchParams.get("order") || "desc",
  page: Number(searchParams.get("page")) || 1,
  limit: Number(searchParams.get("limit")) || 12
}), [searchParams]);

  // ✅ CLEAN + STABLE PARAMS
  const queryParams = useMemo(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      params[key] = value;
    });

    return params;
  }, [filters]);

  const { data, isLoading, isError, error } =
    useGetCarsQuery(queryParams);

  const { data: brands = [] } = useGetBrandsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 ">
       <Loader/>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-1 text-center text-red-500 ">
        {error?.data?.message || "Failed to load cars"}
      </div>
    );
  }

  const cars = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const facets = data?.filters || {};

// const handleFilterChange = (newFilters) => {
//   setFilters((prev) => ({
//     ...prev,
//     ...newFilters,
//     page: 1 // 🔥 MUST
//   }));
// };

const updateFilters = (newFilters) => {
  const params = new URLSearchParams(searchParams);

  Object.entries(newFilters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });

  params.set("page", 1); // reset page

  setSearchParams(params);
};

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-background text-foreground">
      {/* Mobile Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[92vw] max-w-sm bg-white shadow-xl overflow-y-auto">
            <CarFilters
              brands={brands}
              facets={facets}
              value={filters}
              onChange={updateFilters}
              onClose={() => setIsFilterOpen(false)}
              compact
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl bg-background text-foreground">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Buy used cars
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {total} result{total !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-white border lg:hidden rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 bg-background text-foreground"
          >
            <HiOutlineAdjustments className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <CarFilters
              brands={brands}
              facets={facets}
              value={filters}
              onChange={updateFilters}
            />
          </div>

          {/* Results */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-background text-foreground">
            {cars.length === 0 ? (
              <div className="p-10 text-center bg-white border shadow-sm text-slate-500 rounded-2xl border-slate-100">
                No cars match your filters.
                <div className="mt-4">
                  <button
                    onClick={() => updateFilters(initialFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 bg-background text-foreground"
                  >
                    <HiOutlineX className="w-4 h-4" />
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 bg-background text-foreground">
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={`page-${i}`}
                       onClick={() =>
                       updateFilters({
                        ...filters,
                        page: i + 1
                       })

                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          filters.page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-slate-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}