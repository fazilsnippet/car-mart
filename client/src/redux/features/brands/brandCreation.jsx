import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBrandMutation } from "./brandApi";

const brandSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(50, "Maximum 50 characters")
    .trim(),
});

export default function BrandCreation() {
  const [createBrand, { isLoading, isError, error, isSuccess }] =
    useCreateBrandMutation();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
  });

 

const onSubmit = async (data, e) => {
  const formData = new FormData();
  formData.append("name", data.name);

 

  try {
    await createBrand(formData).unwrap();
    reset();
  } catch (err) {
    console.error(err);
  }
};
<div className="max-w-md p-6 mx-auto bg-white shadow rounded-xl">
  <h2 className="mb-4 text-xl font-semibold">Create Brand</h2>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

    <div>
      <label className="block text-sm font-medium">Brand Name</label>
      <input
        {...register("name")}
        placeholder="Enter brand name"
        className="w-full p-2 border rounded"
      />

      {errors.name && (
        <p className="text-sm text-red-500">
          {errors.name.message}
        </p>
      )}

      {/* SLUG PREVIEW */}
      <p className="mt-1 text-xs text-gray-500">
        Slug: {watch("name")?.toLowerCase().replace(/\s+/g, "-")}
      </p>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full p-2 text-white bg-black rounded hover:opacity-90"
    >
      {isLoading ? "Creating..." : "Create Brand"}
    </button>

    {isError && (
      <p className="mt-2 text-sm text-red-500">
        {error?.data?.message || "Failed to create brand"}
      </p>
    )}

    {isSuccess && (
      <p className="mt-2 text-sm text-green-600">
        Brand created successfully!
      </p>
    )}
  </form>
</div>
}