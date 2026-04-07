import { useState, useMemo } from "react";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "./brandApi";

export default function AdminBrands() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { data: brands = [], isLoading } = useGetBrandsQuery();

  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  // ✅ memoized sorted brands
  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateBrand({
          id: editingId,
          data: { name },
        }).unwrap();
      } else {
        await createBrand({ name }).unwrap();
      }

      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (brand) => {
    setName(brand.name);
    setEditingId(brand._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;

    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[350px,1fr]">

      {/* 🔹 LEFT → FORM */}
      <div className="p-4 bg-white border rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit Brand" : "Create Brand"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand name"
            className="w-full px-3 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={creating || updating}
            className="w-full py-2 text-white bg-black rounded-lg"
          >
            {editingId
              ? updating
                ? "Updating..."
                : "Update Brand"
              : creating
              ? "Creating..."
              : "Create Brand"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2 text-sm text-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* 🔹 RIGHT → LIST */}
      <div className="p-4 bg-white border rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold">All Brands</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : sortedBrands.length === 0 ? (
          <p>No brands found</p>
        ) : (
          <div className="space-y-3">
            {sortedBrands.map((brand) => (
              <div
                key={brand._id}
                className="flex items-center justify-between p-3 border rounded-xl"
              >
                <div>
                  <p className="font-semibold">{brand.name}</p>
                  <p className="text-xs text-gray-500">{brand.slug}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="px-3 py-1 text-xs border rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}