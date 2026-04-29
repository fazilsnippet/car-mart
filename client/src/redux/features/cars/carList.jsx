import { useMemo, useState } from "react";
import { useGetCarsQuery } from "./carApi";
import CarCard from "./carCard";
import CarFilters from "./CarFilters";
import { useSearchParams } from "react-router-dom";
import { HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";
import Loader from "../ui/loader.jsx";
import QueryWrapper from "../../../utils/queryWrapper.jsx"

export default function CarList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------------- FILTERS FROM URL ---------------- */
  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || "", 
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
      limit: Number(searchParams.get("limit")) || 12,
    }),
    [searchParams]
  );

  /* ---------------- CLEAN PARAMS ---------------- */
  const queryParams = useMemo(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      )
        return;

      params[key] = value;
    });

    return params;
  }, [filters]);

  /* ---------------- API CALL ---------------- */
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCarsQuery(queryParams, {
    keepPreviousData: true, // ✅ NO FLICKER
  });

  /* ---------------- DATA ---------------- */
  const cars = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const facets = data?.filters || {};

  /* ---------------- UPDATE FILTERS ---------------- */
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });

    // ✅ Reset page only if not explicitly changing page
    if (!("page" in newFilters)) {
      params.set("page", 1);
    }

    setSearchParams(params);
  };

 
  
return (
  <QueryWrapper
    data={data}
    error={error}
    isLoading={isLoading}
    isFetching={isFetching}
  >
    {(data) => {
      const cars = data?.data || [];
      const total = data?.total || 0;
      const totalPages = data?.totalPages || 1;
      const facets = data?.filters || {};

      return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
          {/* 🔄 Updating indicator */}
          {isFetching && (
            <div className="mb-4 text-sm text-gray-500">
              Updating results...
            </div>
          )}

          {/* ---------------- MOBILE FILTER DRAWER ---------------- */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[90vw] max-w-sm bg-white shadow-xl overflow-y-auto p-4">
                <CarFilters
                  brands={facets.brands || []}
                  facets={facets}
                  value={filters}
                  onChange={updateFilters}
                  onClose={() => setIsFilterOpen(false)}
                  compact
                />
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* ---------------- HEADER ---------------- */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Buy Used Cars
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {total} result{total !== 1 ? "s" : ""} found
                </p>
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
              >
                <HiOutlineAdjustments className="w-5 h-5" />
                Filters
              </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* ---------------- SIDEBAR ---------------- */}
              <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                <div className="sticky top-20 bg-white rounded-2xl shadow-sm p-4">
                  <CarFilters
                    brands={facets.brands || []}
                    facets={facets}
                    value={filters}
                    onChange={updateFilters}
                  />
                </div>
              </div>

              {/* ---------------- RESULTS ---------------- */}
              <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                {cars.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg">
                      No cars match your filters 🚫
                    </p>

                    <button
                      onClick={() => setSearchParams({})}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                      <HiOutlineX className="w-4 h-4" />
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* CAR GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {cars.map((car) => (
                        <CarCard key={car._id} car={car} />
                      ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                      <div className="flex justify-center flex-wrap gap-2 pt-4">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const active = filters.page === i + 1;

                          return (
                            <button
                              key={i}
                              onClick={() =>
                                updateFilters({ page: i + 1 })
                              }
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                active
                                  ? "bg-indigo-600 text-white shadow"
                                  : "bg-white border border-gray-200 hover:shadow-sm"
                              }`}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }}
  </QueryWrapper>
);}