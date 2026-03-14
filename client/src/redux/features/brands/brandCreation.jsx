import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBrandMutation } from "./brandApi";
import { useState } from "react";

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

  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

const onSubmit = async (data, e) => {
  const formData = new FormData();
  formData.append("name", data.name);

  const file = e.target.logo.files[0];
  if (file) {
    formData.append("logo", file);
  }

  try {
    await createBrand(formData).unwrap();
    reset();
    setLogoPreview(null);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="max-w-md p-6 mx-auto bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-semibold">Create Brand</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
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
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium">Logo (optional)</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full"
          />
        </div>

        {/* Logo Preview */}
        {logoPreview && (
          <div className="mt-2">
            <img
              src={logoPreview}
              alt="Preview"
              className="object-cover w-24 h-24 rounded"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 text-white bg-black rounded hover:opacity-90"
        >
          {isLoading ? "Creating..." : "Create Brand"}
        </button>

        {/* Backend Error */}
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            {error?.data?.message || "Failed to create brand"}
          </p>
        )}

        {/* Success */}
        {isSuccess && (
          <p className="mt-2 text-sm text-green-600">
            Brand created successfully!
          </p>
        )}
      </form>
    </div>
  );}
