import { useGetBrandsQuery } from "./brandApi";

export default function BrandList() {
  const {
    data: brands,
    isLoading,
    isError,
    error,
  } = useGetBrandsQuery();

  if (isLoading) {
    return <p className="mt-6 text-center">Loading brands...</p>;
  }

  if (isError) {
    return (
      <p className="mt-6 text-center text-red-500">
        {error?.data?.message || "Failed to fetch brands"}
      </p>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500">
        No brands available.
      </p>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto">
  <h2 className="mb-6 text-2xl font-semibold">All Brands</h2>

  <input
    placeholder="Search brands..."
    className="w-full p-3 mb-6 border rounded-lg"
    onChange={(e) => setSearch(e.target.value)}
  />

  {filtered.length === 0 ? (
    <p className="text-center text-gray-500">No brands found</p>
  ) : (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {filtered.map((brand) => (
        <div
          key={brand._id}
          onClick={() => navigate(`/cars-list?brand=${brand._id}`)}
          className="p-5 text-center transition bg-white border rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02]"
        >
          {/* {brand.logo?.url && (
            <img
              src={brand.logo.url}
              alt={brand.name}
              className="object-contain w-16 h-16 mx-auto mb-3"
            />
          )} */}

          <h3 className="text-sm font-semibold">{brand.name}</h3>
        </div>
      ))}
    </div>
  )}
</div>
  )}
