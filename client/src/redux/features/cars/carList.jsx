import { useMemo, useState } from "react";
import { useGetCarsQuery } from "./carApi";
// ❌ removed useGetBrandsQuery (now using backend facets)
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
        <div className="px-4 py-6 sm:px-6 lg:px-8 bg-background text-foreground">
      {/* 🔥 Updating indicator */}
      {isFetching && (
<div className="mb-2 text-sm text-foreground/70">Updating...</div>      )}

      {/* ---------------- MOBILE FILTER DRAWER ---------------- */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />           
           <div className="absolute left-0 top-0 bottom-0 w-[92vw] max-w-sm bg-background text-foreground shadow-xl overflow-y-auto">
            <CarFilters
              brands={facets.brands || []} // ✅ from backend
              facets={facets}
              value={filters}
              onChange={updateFilters}
              onClose={() => setIsFilterOpen(false)}
              compact
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {/* ---------------- HEADER ---------------- */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Buy used cars
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              {total} result{total !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold border rounded-xl lg:hidden border-slate-200 bg-background text-foreground hover:bg-background/80"          >
            
            <HiOutlineAdjustments className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* ---------------- DESKTOP SIDEBAR ---------------- */}
<div className="sticky self-start hidden lg:block lg:col-span-4 xl:col-span-3 top-20 h-fit">
            <CarFilters
              brands={facets.brands || []} 
              facets={facets}
              value={filters}
              onChange={updateFilters}
            />
          </div>

          {/* ---------------- RESULTS ---------------- */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {cars.length === 0 ? (
<div className="p-10 text-center border shadow-sm bg-background text-foreground rounded-2xl border-slate-100">                No cars match your filters.
                <div className="mt-4">
                  <button
                    onClick={() => setSearchParams({})} // ✅ CLEAN RESET
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                  >
                    <HiOutlineX className="w-4 h-4" />
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {/* ---------------- PAGINATION ---------------- */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          updateFilters({ page: i + 1 }) // ✅ FIXED
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          filters.page === i + 1
                            ? "bg-indigo-600 text-white"
: "bg-background border border-slate-200 text-foreground" }`}
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
    }}
  </QueryWrapper>
);
}