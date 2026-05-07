// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { carSchema } from "./carValidation.js";
// import { useState, useEffect } from "react";

// /* ================== UI ================== */

// const Input = ({ error, ...props }) => (
//   <div>
//     <input
//       {...props}
//       className="w-full px-4 py-3 transition border border-gray-200 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
//     />
//     {error && (
//       <p className="mt-1 text-sm text-red-500">{error.message}</p>
//     )}
//   </div>
// );

// const Select = ({ error, children, ...props }) => (
//   <div>
//     <select
//       {...props}
//       className="w-full px-4 py-3 text-lg font-semibold text-gray-500 transition border border-gray-200 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
//     >
//       {children}
//     </select>
//     {error && (
//       <p className="mt-1 text-sm text-red-500">{error.message}</p>
//     )}
//   </div>
// );

// const Section = ({ title, children }) => (
//   <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
//     <h2 className="text-lg font-semibold text-gray-800">
//       {title}
//     </h2>
//     {children}
//   </div>
// );

// /* ================== FORM ================== */

// const CarForm = ({ defaultValues, onSubmit, isEditing, isLoading }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     reset,
//   } = useForm({
//     resolver: zodResolver(carSchema),
//     defaultValues,
//   });

//   const [files, setFiles] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     if (selectedFiles.length > 12) {
//       alert("Max 12 images allowed");
//       return;
//     }

//     setFiles(selectedFiles);
//     setValue("images", selectedFiles);
//   };

//   useEffect(() => {
//     if (defaultValues) {
//       reset(defaultValues);
//       if (defaultValues.images) {
//         setExistingImages(defaultValues.images);
//       }
//     }
//   }, [defaultValues, reset]);

//   const onSubmitHandler = (data) => {
//     if (!isEditing && files.length === 0) {
//       alert("At least one image is required");
//       return;
//     }

//     onSubmit({
//       ...data,
//       images: files.length > 0 ? files : undefined,
//     });
//   };
//   const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
// const transmissionOptions = ["Manual", "Automatic"];

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmitHandler)}
//       className="max-w-4xl py-6 mx-auto space-y-6 bg-background"
//     >
//       {/* BASIC INFO */}
//       <Section title="Basic Information">
//         <Input
//           {...register("title")}
//           placeholder="Car Title"
//           error={errors.title}
//         />

//         <div className="grid gap-4 md:grid-cols-2">
//           <Input
//             {...register("phoneNumber")}
//             placeholder="Phone Number"
//             error={errors.phoneNumber}
//           />
//           <Input
//             {...register("location")}
//             placeholder="Location"
//             error={errors.location}
//           />
//         </div>
//       </Section>

//       {/* IMAGES */}
//       <Section title="Car Images">
//         {(existingImages.length > 0 || files.length > 0) && (
//           <div className="flex flex-wrap gap-3">
//             {existingImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={img.url}
//                 className="object-cover w-24 h-24 rounded-lg"
//               />
//             ))}

//             {files.map((file, i) => (
//               <img
//                 key={i}
//                 src={URL.createObjectURL(file)}
//                 className="object-cover w-24 h-24 rounded-lg"
//               />
//             ))}
//           </div>
//         )}

//         <label className="block p-6 text-center transition border-2 border-dashed cursor-pointer border-color rounded-xl hover:border-indigo-500">
//           <p className="text-black">
//             Click to upload images (max 12)
//           </p>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             hidden
//             onChange={handleFileChange}
//           />
//         </label>

//         {errors.images && (
//           <p className="text-sm text-red-500">
//             {errors.images.message}
//           </p>
//         )}
//       </Section>

//       {/* CAR DETAILS */}
//       <Section title="Car Details">
//         <div className="grid gap-4 md:grid-cols-2">
//           <Input
//             {...register("brand")}
//             placeholder="Brand"
//             error={errors.brand}
//           />
//           <Input
//             type="number"
//             {...register("year")}
//             placeholder="Year"
//             error={errors.year}
//           />
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 ">
//   <Select {...register("fuelType")} error={errors.fuelType}>
//     <option value="">Fuel Type</option>
//     {fuelOptions.map((fuel) => (
//       <option key={fuel} value={fuel}>
//         {fuel}
//       </option>
//     ))}
//   </Select>

//   <Select {...register("transmission")} error={errors.transmission}>
//     <option value="">Transmission</option>
//     {transmissionOptions.map((type) => (
//       <option key={type} value={type}>
//         {type}
//       </option>
//     ))}
//   </Select>
// </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           <Input
//             type="number"
//             {...register("kmDriven")}
//             placeholder="KM Driven"
//             error={errors.kmDriven}
//           />
//           <Input
//             type="number"
//             {...register("owners")}
//             placeholder="Owners"
//             error={errors.owners}
//           />
//           <Input
//             {...register("registrationNumber")}
//             placeholder="KA01XX1234"
//             error={errors.registrationNumber}
//           />
//         </div>
//       </Section>

//       {/* PRICING */}
//       <Section title="Pricing">
//         <Input
//           type="number"
//           {...register("expectedPrice")}
//           placeholder="Expected Price"
//           error={errors.expectedPrice}
//         />
//       </Section>

//       {/* EXTRA */}
//       <Section title="Additional Info">
//         <Input
//           {...register("features")}
//           placeholder="Sunroof, Camera, Leather seats"
//         />

//         <textarea
//           {...register("conditionNotes")}
//           placeholder="Describe car condition..."
//           className="w-full px-4 py-3 text-gray-500 border border-color rounded-xl bg-background-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//       </Section>

//       {/* SUBMIT */}
//       <div className="text-right">
//         <button
//           disabled={isLoading}
//           className="px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {isLoading ? "Submitting..." : isEditing ? "Update Car" : "Post Car"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default CarForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "./carValidation.js";
import { useState, useEffect } from "react";

/* ================== UI ================== */

const Input = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      className="w-full px-4 py-3 transition border border-gray-200 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

const Select = ({ error, children, ...props }) => (
  <div>
    <select
      {...props}
      className="w-full px-4 py-3 text-lg font-semibold text-gray-500 transition border border-gray-200 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <div className="p-5 space-y-4 bg-white shadow-sm rounded-2xl">
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    {children}
  </div>
);

/* ================== FORM ================== */

const CURRENT_YEAR = new Date().getFullYear();

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
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"];
  const transmissionOptions = ["Manual", "Automatic"];

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
      if (defaultValues.images) setExistingImages(defaultValues.images);
    }
  }, [defaultValues, reset]);

  // 🔹 GPS Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          // Build a readable location string from the response
          const addr = data.address;
          const location =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.county ||
            addr.state_district ||
            "";
          const state = addr.state || "";
          const readable = [location, state].filter(Boolean).join(", ");

          setValue("location", readable, { shouldValidate: true });
        } catch {
          setLocationError("Could not fetch address. Try typing manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location access denied. Please type manually.");
        } else {
          setLocationError("Unable to detect location. Try again.");
        }
      }
    );
  };

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
      className="max-w-4xl py-6 mx-auto space-y-6 bg-background"
    >
      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Input
          {...register("title")}
          placeholder="Car Title"
          error={errors.title}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {/* 🔹 Phone — max 10 digits */}
          <Input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            type="tel"
            maxLength={10}
            onInput={(e) => {
              // Strip non-numeric characters
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            }}
            error={errors.phoneNumber}
          />

          {/* 🔹 Location with GPS button */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                {...register("location")}
                placeholder="Location"
                className="flex-1 min-w-0 px-4 py-3 transition border border-gray-200 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locationLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-60 whitespace-nowrap transition"
              >
                {locationLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Detecting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                      <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                    Detect
                  </>
                )}
              </button>
            </div>

            {locationError && (
              <p className="text-xs text-red-500">{locationError}</p>
            )}
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>
        </div>
      </Section>

      {/* IMAGES */}
      <Section title="Car Images">
        {(existingImages.length > 0 || files.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <img key={i} src={img.url} className="object-cover w-24 h-24 rounded-lg" />
            ))}
            {files.map((file, i) => (
              <img key={i} src={URL.createObjectURL(file)} className="object-cover w-24 h-24 rounded-lg" />
            ))}
          </div>
        )}

        <label className="block p-6 text-center transition border-2 border-dashed cursor-pointer border-color rounded-xl hover:border-indigo-500">
          <p className="text-black">Click to upload images (max 12)</p>
          <input type="file" multiple accept="image/*" hidden onChange={handleFileChange} />
        </label>

        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </Section>

      {/* CAR DETAILS */}
      <Section title="Car Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input {...register("brand")} placeholder="Brand" error={errors.brand} />

          {/* 🔹 Year — min 1980, max current year, no negative */}
          <Input
            type="number"
            {...register("year", { valueAsNumber: true })}
            placeholder="Year"
            min={1980}
            max={CURRENT_YEAR}
            onInput={(e) => {
              const val = parseInt(e.target.value);
              if (val > CURRENT_YEAR) e.target.value = CURRENT_YEAR;
              if (val < 0) e.target.value = "";
            }}
            error={errors.year}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select {...register("fuelType")} error={errors.fuelType}>
            <option value="">Fuel Type</option>
            {fuelOptions.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </Select>

          <Select {...register("transmission")} error={errors.transmission}>
            <option value="">Transmission</option>
            {transmissionOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* 🔹 KM Driven — no negatives */}
          <Input
            type="number"
            {...register("kmDriven", { valueAsNumber: true })}
            placeholder="KM Driven"
            min={0}
            onInput={(e) => { if (e.target.value < 0) e.target.value = 0; }}
            error={errors.kmDriven}
          />

          {/* 🔹 Owners — no negatives */}
          <Input
            type="number"
            {...register("owners", { valueAsNumber: true })}
            placeholder="Owners"
            min={0}
            max={8}
            onInput={(e) => { if (e.target.value < 0) e.target.value = 0; }}
            error={errors.owners}
          />

          {/* 🔹 Registration — forced uppercase */}
          <Input
            {...register("registrationNumber")}
            placeholder="KA01XX1234"
            onInput={(e) => {
              const pos = e.target.selectionStart;
              e.target.value = e.target.value.toUpperCase();
              e.target.setSelectionRange(pos, pos);
            }}
            error={errors.registrationNumber}
          />
        </div>
      </Section>

      {/* PRICING */}
      <Section title="Pricing">
        {/* 🔹 Price — no negatives */}
        <Input
          type="number"
          {...register("expectedPrice", { valueAsNumber: true })}
          placeholder="Expected Price"
          min={0}
          onInput={(e) => { if (e.target.value < 0) e.target.value = 0; }}
          error={errors.expectedPrice}
        />
      </Section>

      {/* EXTRA */}
      <Section title="Additional Info">
        <Input {...register("features")} placeholder="Sunroof, Camera, Leather seats" />
        <textarea
          {...register("conditionNotes")}
          placeholder="Describe car condition..."
          className="w-full px-4 py-3 text-gray-500 border border-color rounded-xl bg-background-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Section>

      {/* SUBMIT */}
      <div className="text-right">
        <button
          disabled={isLoading}
          className="px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : isEditing ? "Update Car" : "Post Car"}
        </button>
      </div>
    </form>
  );
};

export default CarForm;