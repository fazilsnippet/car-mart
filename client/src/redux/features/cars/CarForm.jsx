import { useState } from "react";
import {
  useCreateCarMutation,
   } from "./carApi";
   import { useGetBrandsQuery } from "../brands/brandApi";

import {
  FUEL_TYPES,
  TRANSMISSIONS,
  DRIVE_TYPES
} from "./carEnums";

const CarForm = () => {
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError } = useGetBrandsQuery();
  const [createCar, { isLoading }] = useCreateCarMutation();

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    variant: "",
    brand: "",
    year: "",
    price: "",
    kmDriven: "",
    fuelType: "",
    transmission: "",
    gears: "",
    driveType: "",
    ownerCount: 1,
    city: "",
    state: "",
    features: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "city" || key === "state") return;
        formData.append(key, form[key]);
      });

     formData.append(
  "location",
  JSON.stringify({
    city: form.city,
    state: form.state
  })
);
      if (form.features) {
        form.features.split(",").forEach((feature) => {
          formData.append("features", feature.trim());
        });
      }

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createCar(formData).unwrap();

      alert("Car created successfully");
    } catch (err) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="text-black input"
      />

      <input
        name="variant"
        placeholder="Variant"
        onChange={handleChange}
        className="input"
      />

      <select
        name="brand"
        onChange={handleChange}
        className="text-black input"
        disabled={brandsLoading || brandsError}
      >
        <option value="">Select Brand</option>
        {brandsData?.map((brand) => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>
      {brandsLoading && <p className="text-sm text-gray-500">Loading brands…</p>}
      {brandsError && <p className="text-sm text-red-500">Failed to load brands</p>}

      <input name="year" type="number" placeholder="Year" onChange={handleChange} className="text-black input" />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} className="text-black input" />
      <input name="kmDriven" type="number" placeholder="KM Driven" onChange={handleChange} className="text-black input" />

      <select name="fuelType" onChange={handleChange} className="text-black input">
        <option value="">Fuel Type</option>
        {FUEL_TYPES.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <select name="transmission" onChange={handleChange} className="text-black input">
        <option value="">Transmission</option>
        {TRANSMISSIONS.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <select name="driveType" onChange={handleChange} className="text-black input">
        <option value="">Drive Type</option>
        {DRIVE_TYPES.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <input name="gears" type="number" placeholder="Gears" onChange={handleChange} className="text-black input" />
      <input name="ownerCount" type="number" placeholder="Owner Count" onChange={handleChange} className="text-black input" />

      <input name="city" placeholder="City" onChange={handleChange} className="text-black input" />
      <input name="state" placeholder="State" onChange={handleChange} className="text-black input" />

      <input
        name="features"
        placeholder="Features (comma separated)"
        onChange={handleChange}
        className="col-span-2 text-black input"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="col-span-2"
      />

      <div className="flex flex-wrap col-span-2 gap-4">
        {previewImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="preview"
            className="object-cover w-24 h-24 rounded"
          />
        ))}
      </div>

      {error && (
        <p className="col-span-2 text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="col-span-2 py-2 text-white bg-black rounded"
      >
        {isLoading ? "Creating..." : "Create Car"}
      </button>
    </form>
  );
};

export default CarForm;
