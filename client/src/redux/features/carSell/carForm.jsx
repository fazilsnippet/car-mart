import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "./carValidation.js";
import { useState, useEffect } from "react";

const CarForm = ({ defaultValues, onSubmit, isEditing, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(carSchema),
  });

  // 🔥 File state
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setValue("images", selectedFiles);
  };

  // 🔥 Populate form when editing
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);

      if (defaultValues.images) {
        setExistingImages(defaultValues.images);
      }
    }
  }, [defaultValues, reset]);

  const onSubmitHandler = (data) => {
    try {
      onSubmit({
        ...data,

        // 🔥 transform features string → array
        features: data.features
          ? data.features.split(",").map((f) => f.trim())
          : [],

        // 🔥 only send images if replacing
        images: files.length > 0 ? files : undefined,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="p-6 space-y-4 bg-white shadow rounded-xl"
    >
      {/* TITLE */}
      <input
        {...register("title")}
        placeholder="Car Title / Model Name"
        className="w-full p-2 border rounded"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      {/* EXISTING IMAGES (EDIT MODE) */}
      {isEditing && existingImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {existingImages.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt="car"
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* FILE INPUT */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />
      {errors.images && (
        <p className="text-red-500">{errors.images.message}</p>
      )}

      {/* BRAND */}
      <input
        {...register("brand")}
        placeholder="Brand"
        className="w-full p-2 border rounded"
      />

      {/* YEAR */}
      <input
        type="number"
        {...register("year", { valueAsNumber: true })}
        placeholder="Year"
        className="w-full p-2 border rounded"
      />

      {/* FUEL TYPE */}
      <select {...register("fuelType")} className="w-full p-2 border rounded">
        <option value="">Select Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
        <option value="CNG">CNG</option>
        <option value="LPG">LPG</option>
      </select>

      {/* TRANSMISSION */}
      <select
        {...register("transmission")}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Transmission</option>
        <option value="Manual">Manual</option>
        <option value="Automatic">Automatic</option>
      </select>

      {/* KM DRIVEN */}
      <input
        type="number"
        {...register("kmDriven", { valueAsNumber: true })}
        placeholder="KM Driven"
        className="w-full p-2 border rounded"
      />

      {/* OWNERS */}
      <input
        type="number"
        {...register("owners", { valueAsNumber: true })}
        placeholder="Number of Owners"
        className="w-full p-2 border rounded"
      />

      {/* REGISTRATION */}
      <input
        {...register("registrationNumber")}
        placeholder="Registration Number"
        className="w-full p-2 border rounded"
      />


      {/* PRICE */}
      <input
        type="number"
        {...register("price", { valueAsNumber: true })}
        placeholder="Expected Price"
        className="w-full p-2 border rounded"
      />

      {/* FEATURES */}
      <input
        {...register("features")}
        placeholder="Features (comma separated)"
        className="w-full p-2 border rounded"
      />

      {/* NOTES */}
      <textarea
        {...register("conditionNotes")}
        placeholder="Condition Notes"
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 text-white bg-indigo-600 rounded-xl"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CarForm;