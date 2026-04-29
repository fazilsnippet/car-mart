import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "./carValidation.js";
import { useState, useEffect } from "react";

/* ================== UI ================== */

const Input = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message}</p>
    )}
  </div>
);

const Select = ({ error, children, ...props }) => (
  <div>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      {children}
    </select>
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message}</p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">
      {title}
    </h2>
    {children}
  </div>
);

/* ================== FORM ================== */

const CarForm = ({ defaultValues, onSubmit, isEditing, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues,
  });

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 12) {
      alert("Max 12 images allowed");
      return;
    }

    setFiles(selectedFiles);
    setValue("images", selectedFiles);
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      if (defaultValues.images) {
        setExistingImages(defaultValues.images);
      }
    }
  }, [defaultValues, reset]);

  const onSubmitHandler = (data) => {
    if (!isEditing && files.length === 0) {
      alert("At least one image is required");
      return;
    }

    onSubmit({
      ...data,
      images: files.length > 0 ? files : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="max-w-4xl mx-auto space-y-6 py-6"
    >
      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Input
          {...register("title")}
          placeholder="Car Title"
          error={errors.title}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            error={errors.phoneNumber}
          />
          <Input
            {...register("location")}
            placeholder="Location"
            error={errors.location}
          />
        </div>
      </Section>

      {/* IMAGES */}
      <Section title="Car Images">
        {(existingImages.length > 0 || files.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}

            {files.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition">
          <p className="text-gray-500">
            Click to upload images (max 12)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        {errors.images && (
          <p className="text-sm text-red-500">
            {errors.images.message}
          </p>
        )}
      </Section>

      {/* CAR DETAILS */}
      <Section title="Car Details">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            {...register("brand")}
            placeholder="Brand"
            error={errors.brand}
          />
          <Input
            type="number"
            {...register("year")}
            placeholder="Year"
            error={errors.year}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select {...register("fuelType")} error={errors.fuelType}>
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
            <option value="LPG">LPG</option>
          </Select>

          <Select
            {...register("transmission")}
            error={errors.transmission}
          >
            <option value="">Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            type="number"
            {...register("kmDriven")}
            placeholder="KM Driven"
            error={errors.kmDriven}
          />
          <Input
            type="number"
            {...register("owners")}
            placeholder="Owners"
            error={errors.owners}
          />
          <Input
            {...register("registrationNumber")}
            placeholder="KA01XX1234"
            error={errors.registrationNumber}
          />
        </div>
      </Section>

      {/* PRICING */}
      <Section title="Pricing">
        <Input
          type="number"
          {...register("expectedPrice")}
          placeholder="Expected Price"
          error={errors.expectedPrice}
        />
      </Section>

      {/* EXTRA */}
      <Section title="Additional Info">
        <Input
          {...register("features")}
          placeholder="Sunroof, Camera, Leather seats"
        />

        <textarea
          {...register("conditionNotes")}
          placeholder="Describe car condition..."
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Section>

      {/* SUBMIT */}
      <div className="text-right">
        <button
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : isEditing ? "Update Car" : "Post Car"}
        </button>
      </div>
    </form>
  );
};

export default CarForm;