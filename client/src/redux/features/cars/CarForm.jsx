import { useEffect, useState } from "react";
import { useCreateCarMutation, useUpdateCarMutation } from "./carApi";
import { useGetBrandsQuery } from "../brands/brandApi";
import { FUEL_TYPES, TRANSMISSIONS, DRIVE_TYPES } from "./carEnums";

const emptyForm = {
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
  features: "",
};

const buildFormState = (initialValues = {}) => ({
  title: initialValues.title ?? "",
  variant: initialValues.variant ?? "",
  brand:
    typeof initialValues.brand === "string"
      ? initialValues.brand
      : initialValues.brand?._id ?? "",
  year: initialValues.year ?? "",
  price: initialValues.price ?? "",
  kmDriven: initialValues.kmDriven ?? "",
  fuelType: initialValues.fuelType ?? "",
  transmission: initialValues.transmission ?? "",
  gears: initialValues.gears ?? "",
  driveType: initialValues.driveType ?? "",
  ownerCount: initialValues.ownerCount ?? 1,
  city: initialValues.location?.city ?? "",
  state: initialValues.location?.state ?? "",
  features: Array.isArray(initialValues.features)
    ? initialValues.features.join(", ")
    : initialValues.features ?? "",
});

const CarForm = ({ mode = "create", initialValues = {}, carId, onSuccess }) => {
  const isEditMode = mode === "edit";
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError } = useGetBrandsQuery();
  const [createCar, { isLoading: isCreating }] = useCreateCarMutation();
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState(() => buildFormState(initialValues));

  useEffect(() => {
    setForm(buildFormState(initialValues));
    setImages([]);
    setPreviewImages(
      Array.isArray(initialValues?.images)
        ? initialValues.images.map((image) => image?.url).filter(Boolean)
        : []
    );
  }, [initialValues]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        kmDriven: form.kmDriven ? Number(form.kmDriven) : undefined,
        ownerCount: form.ownerCount ? Number(form.ownerCount) : 1,
        gears: form.gears ? Number(form.gears) : undefined,
        location: {
          city: form.city,
          state: form.state,
        },
        features: form.features,
      };

      if (!isEditMode) {
        payload.price = form.price ? Number(form.price) : undefined;
      }

      if (images.length) {
        payload.images = images;
      }

      if (isEditMode) {
        await updateCar({ carId, ...payload }).unwrap();
        setSuccessMessage("Car updated successfully");
      } else {
        await createCar(payload).unwrap();
        setSuccessMessage("Car created successfully");
        setForm(emptyForm);
        setImages([]);
        setPreviewImages([]);
      }

      onSuccess?.();
    } catch (err) {
      setError(err?.data?.message || "Something went wrong");
    }
  };

  const submitLoading = isCreating || isUpdating;
return (
  <form onSubmit={handleSubmit} className="max-w-5xl py-6 mx-auto space-y-6">
    
    {/* BASIC INFO */}
    <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Basic Information
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="title"
          placeholder="Car Title"
          value={form.title}
          onChange={handleChange}
          className="input"
        />

        <input
          name="variant"
          placeholder="Variant"
          value={form.variant}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="input"
          disabled={brandsLoading || brandsError}
        >
          <option value="">Select Brand</option>
          {brandsData?.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>

        <input
          name="year"
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="input"
        />
      </div>

      {!isEditMode && (
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input"
        />
      )}
    </div>

    {/* VEHICLE DETAILS */}
    <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Vehicle Details
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          name="kmDriven"
          type="number"
          placeholder="KM Driven"
          value={form.kmDriven}
          onChange={handleChange}
          className="input"
        />

        <input
          name="gears"
          type="number"
          placeholder="Gears"
          value={form.gears}
          onChange={handleChange}
          className="input"
        />

        <input
          name="ownerCount"
          type="number"
          placeholder="Owner Count"
          value={form.ownerCount}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <select
          name="fuelType"
          value={form.fuelType}
          onChange={handleChange}
          className="input"
        >
          <option value="">Fuel Type</option>
          {FUEL_TYPES.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>

        <select
          name="transmission"
          value={form.transmission}
          onChange={handleChange}
          className="input"
        >
          <option value="">Transmission</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          name="driveType"
          value={form.driveType}
          onChange={handleChange}
          className="input"
        >
          <option value="">Drive Type</option>
          {DRIVE_TYPES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* LOCATION */}
    <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Location
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="input"
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    {/* FEATURES */}
    <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Features
      </h2>

      <input
        name="features"
        placeholder="Sunroof, Camera, Leather seats"
        value={form.features}
        onChange={handleChange}
        className="input"
      />
    </div>

    {/* IMAGES */}
    <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-800">
        Images
      </h2>

      <label className="block p-6 text-center transition border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-indigo-500">
        <p className="text-gray-500">
          Click to upload images
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {previewImages.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt="preview"
            className="object-cover w-24 h-24 rounded-lg"
          />
        ))}
      </div>
    </div>

    {/* STATUS */}
    <div className="space-y-2">
      {brandsLoading && (
        <p className="text-sm text-gray-500">Loading brands…</p>
      )}
      {brandsError && (
        <p className="text-sm text-red-500">
          Failed to load brands
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {successMessage && (
        <p className="text-sm text-emerald-600">
          {successMessage}
        </p>
      )}
    </div>

    {/* SUBMIT */}
    <div className="text-right">
      <button
        type="submit"
        disabled={submitLoading}
        className="px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitLoading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Car"
          : "Create Car"}
      </button>
    </div>
  </form>
);
}

export default CarForm;