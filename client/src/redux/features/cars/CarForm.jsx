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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <input
        name="variant"
        placeholder="Variant"
        value={form.variant}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <select
        name="brand"
        value={form.brand}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
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
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      {!isEditMode && (
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="px-3 py-2 text-black border rounded-lg border-slate-200"
        />
      )}

      <input
        name="kmDriven"
        type="number"
        placeholder="KM Driven"
        value={form.kmDriven}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <select
        name="fuelType"
        value={form.fuelType}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
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
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      >
        <option value="">Transmission</option>
        {TRANSMISSIONS.map((transmission) => (
          <option key={transmission.value} value={transmission.value}>
            {transmission.label}
          </option>
        ))}
      </select>

      <select
        name="driveType"
        value={form.driveType}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      >
        <option value="">Drive Type</option>
        {DRIVE_TYPES.map((driveType) => (
          <option key={driveType} value={driveType}>
            {driveType}
          </option>
        ))}
      </select>

      <input
        name="gears"
        type="number"
        placeholder="Gears"
        value={form.gears}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <input
        name="ownerCount"
        type="number"
        placeholder="Owner Count"
        value={form.ownerCount}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        className="px-3 py-2 text-black border rounded-lg border-slate-200"
      />

      <input
        name="features"
        placeholder="Features (comma separated)"
        value={form.features}
        onChange={handleChange}
        className="col-span-1 px-3 py-2 text-black border rounded-lg md:col-span-2 border-slate-200"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="col-span-1 md:col-span-2"
      />

      <div className="flex flex-wrap col-span-1 gap-3 md:col-span-2">
        {previewImages.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt="preview"
            className="object-cover w-20 h-20 rounded-lg"
          />
        ))}
      </div>

      {brandsLoading && <p className="text-sm text-slate-500">Loading brands…</p>}
      {brandsError && <p className="text-sm text-red-500">Failed to load brands</p>}
      {error && <p className="col-span-1 text-sm text-red-500 md:col-span-2">{error}</p>}
      {successMessage && (
        <p className="col-span-1 text-sm text-emerald-600 md:col-span-2">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={submitLoading}
        className="col-span-1 py-2 font-medium text-white bg-slate-900 rounded-lg md:col-span-2"
      >
        {submitLoading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Car"
            : "Create Car"}
      </button>
    </form>
  );
};

export default CarForm;
