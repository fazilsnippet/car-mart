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
  const [error, setError] = useState("");

  const { data: brands = [], isLoading } = useGetBrandsQuery();

  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: deleting }] = useDeleteBrandMutation();

  const isSubmitting = creating || updating;

  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [brands]);

  const resetForm = () => {
    setName("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Brand name is required");
      return;
    }

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
      setError(err?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (brand) => {
    setName(brand.name);
    setEditingId(brand._id);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this brand?"
    );
    if (!confirmed) return;

    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      
      {/* 🔹 FORM */}
      <div className="p-5 border shadow-sm rounded-2xl bg-background text-foreground">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit Brand" : "Create Brand"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
              className="w-full px-3 py-2 border rounded-lg outline-none border-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update Brand"
              : "Create Brand"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2 text-sm border rounded-lg border-slate-200 hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* 🔹 LIST */}
      <div className="p-5 border shadow-sm rounded-2xl bg-background text-foreground">
        <h2 className="mb-4 text-lg font-semibold">All Brands</h2>

        {isLoading ? (
          <p className="text-sm text-foreground/60">Loading brands...</p>
        ) : sortedBrands.length === 0 ? (
          <div className="p-6 text-center border rounded-xl border-slate-200">
            <p className="text-sm text-foreground/60">
              No brands found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBrands.map((brand) => (
              <div
                key={brand._id}
                className="flex items-center justify-between p-3 transition border rounded-xl border-slate-200 hover:shadow-sm"
              >
                <div>
                  <p className="font-medium">{brand.name}</p>
                  <p className="text-xs text-foreground/60">
                    {brand.slug}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="px-3 py-1 text-xs border rounded-lg border-slate-200 hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(brand._id)}
                    disabled={deleting}
                    className="px-3 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
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