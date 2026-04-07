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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="p-4 transition border shadow rounded-xl hover:shadow-lg"
          >          

            {/* Name */}
            <h3 className="text-lg font-medium text-center">
              {brand.name}
            </h3>

            {/* Slug (optional display) */}
            <p className="mt-1 text-sm text-center text-gray-500">
              {brand.slug}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}