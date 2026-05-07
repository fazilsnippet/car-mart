// import { useState } from "react";
// import {
//   useGetCarsQuery,
//   useUpdateCarMutation,
//   useUpdateCarPriceMutation,
//   useMarkCarAsSoldMutation,
//   useDeleteCarMutation,
// } from "./carApi";

// export default function AdminCarsManager() {
//   const { data, isLoading, refetch } = useGetCarsQuery({
//     page: 1,
//     limit: 20,
//   });

//   const cars = data?.data || [];
// // 🔹 add this state
// const [images, setImages] = useState([]);
//   const [updateCar] = useUpdateCarMutation();
//   const [updatePrice, { isLoading: updatingPrice }] =
//     useUpdateCarPriceMutation();
//   const [markSold, { isLoading: selling }] =
//     useMarkCarAsSoldMutation();
//   const [deleteCar, { isLoading: deleting }] =
//     useDeleteCarMutation();

//   const [selectedCar, setSelectedCar] = useState(null);
//   const [priceDrafts, setPriceDrafts] = useState({});
//   const [formData, setFormData] = useState({});
//   const [feedback, setFeedback] = useState(null);

//   const pushFeedback = (type, message) =>
//     setFeedback({ type, message });

//   // 🔹 Update car (without price)
//   const handleUpdateCar = async () => {
//     try {
//       await updateCar({
//         carId: selectedCar._id,
//         ...formData,
//       }).unwrap();

//       pushFeedback("success", "Car updated successfully");
//       setSelectedCar(null);
//       setFormData({});
//       refetch();
//     } catch (err) {
//       pushFeedback("error", err?.data?.message || "Update failed");
//     }
//   };

//   // 🔹 Update price
//   const handleUpdatePrice = async (carId, fallback) => {
//     const newPrice = Number(priceDrafts[carId] ?? fallback);

//     if (!newPrice || newPrice <= 0) {
//       return pushFeedback("error", "Invalid price");
//     }

//     try {
//       await updatePrice({ carId, newPrice }).unwrap();
//       pushFeedback("success", "Price updated");
//       refetch();
//     } catch (err) {
//       pushFeedback("error", err?.data?.message || "Price update failed");
//     }
//   };

//   // 🔹 Mark sold
//   const handleMarkSold = async (carId) => {
//     if (!window.confirm("Mark as sold?")) return;

//     try {
//       await markSold(carId).unwrap();
//       pushFeedback("success", "Marked as sold");
//       refetch();
//     } catch (err) {
//       pushFeedback("error", err?.data?.message || "Failed");
//     }
//   };

//   // 🔹 Delete
//   const handleDelete = async (carId) => {
//     if (!window.confirm("Delete this car?")) return;

//     try {
//       await deleteCar(carId).unwrap();
//       pushFeedback("success", "Car deleted");
//       refetch();
//     } catch (err) {
//       pushFeedback("error", err?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Feedback */}
//       {feedback && (
//         <div
//           className={`p-3 rounded-lg text-sm ${
//             feedback.type === "success"
//               ? "bg-green-50 text-green-700"
//               : "bg-red-50 text-red-700"
//           }`}
//         >
//           {feedback.message}
//         </div>
//       )}

//       {/* EDIT PANEL */}
//       {selectedCar && (
//   <div className="p-4 space-y-3 bg-white border rounded-xl">
//     <h2 className="font-semibold">Edit Car</h2>

//     {/* TITLE */}
//     <input
//       placeholder="Title"
//       defaultValue={selectedCar.title}
//       onChange={(e) =>
//         setFormData((p) => ({ ...p, title: e.target.value }))
//       }
//       className="w-full p-2 border"
//     />

//     {/* YEAR */}
//     <input
//       placeholder="Year"
//       defaultValue={selectedCar.year}
//       onChange={(e) =>
//         setFormData((p) => ({ ...p, year: e.target.value }))
//       }
//       className="w-full p-2 border"
//     />

//     {/* IMAGE UPLOAD */}
//     <div>
//       <p className="mb-1 text-sm">Replace Images</p>
//       <input
//         type="file"
//         multiple
//         onChange={(e) => setImages(Array.from(e.target.files))}
//         className="text-sm"
//       />
//     </div>

//     {/* PREVIEW NEW IMAGES */}
//     {images.length > 0 && (
//       <div className="flex flex-wrap gap-2">
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={URL.createObjectURL(img)}
//             alt="preview"
//             className="object-cover w-20 h-20 rounded"
//           />
//         ))}
//       </div>
//     )}

//     {/* EXISTING IMAGES */}
//     <div className="flex flex-wrap gap-2">
//       {selectedCar.images?.map((img) => (
//         <img
//           key={img.publicId}
//           src={img.url}
//           className="object-cover w-20 h-20 rounded opacity-70"
//         />
//       ))}
//     </div>

//     <div className="flex gap-2">
//       <button
//         onClick={async () => {
//           try {
//             const payload = {
//               carId: selectedCar._id,
//               ...formData,
//             };

//             // ✅ attach images ONLY if selected
//             if (images.length > 0) {
//               payload.images = images;
//             }

//             await updateCar(payload).unwrap();

//             pushFeedback("success", "Car updated");
//             setSelectedCar(null);
//             setImages([]);
//             setFormData({});
//             refetch();
//           } catch (err) {
//             pushFeedback("error", err?.data?.message || "Failed");
//           }
//         }}
//         className="px-4 py-2 text-white bg-black rounded"
//       >
//         Save
//       </button>

//       <button
//         onClick={() => {
//           setSelectedCar(null);
//           setImages([]);
//         }}
//         className="px-4 py-2 border rounded"
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// )}

//       {/* LIST */}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="space-y-4">
//           {cars.map((car) => (
//             <div
//               key={car._id}
//               className="p-4 bg-white border rounded-xl"
//             >
//               <div className="flex justify-between">
//                 <div>
//                   <h3 className="font-semibold">{car.title}</h3>
//                   <p className="text-sm text-gray-500">
//                     {car.year} • {car.fuelType}
//                   </p>
//                   <p className="mt-1 font-medium">
//                     ₹{car.price}
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => setSelectedCar(car)}
//                     className="px-3 py-1 border rounded"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleMarkSold(car._id)}
//                     disabled={selling}
//                     className="px-3 py-1 text-white bg-blue-600 rounded"
//                   >
//                     Sold
//                   </button>

//                   <button
//                     onClick={() => handleDelete(car._id)}
//                     disabled={deleting}
//                     className="px-3 py-1 text-white bg-red-600 rounded"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>

//               {/* PRICE UPDATE */}
//               <div className="flex gap-2 mt-3">
//                 <input
//                   type="number"
//                   value={priceDrafts[car._id] ?? car.price}
//                   onChange={(e) =>
//                     setPriceDrafts((p) => ({
//                       ...p,
//                       [car._id]: e.target.value,
//                     }))
//                   }
//                   className="p-2 border"
//                 />

//                 <button
//                   onClick={() =>
//                     handleUpdatePrice(car._id, car.price)
//                   }
//                   disabled={updatingPrice}
//                   className="px-3 py-2 text-white bg-black rounded"
//                 >
//                   Update Price
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import {
  useGetCarsQuery,
  useUpdateCarMutation,
  useUpdateCarPriceMutation,
  useMarkCarAsSoldMutation,
  useDeleteCarMutation,
} from "./carApi";

export default function AdminCarsManager() {
  const { data, isLoading, refetch } = useGetCarsQuery({ page: 1, limit: 20 });

  const cars = data?.data || [];
  const [images, setImages] = useState([]);
  const [updateCar] = useUpdateCarMutation();
  const [updatePrice, { isLoading: updatingPrice }] = useUpdateCarPriceMutation();
  const [markSold, { isLoading: selling }] = useMarkCarAsSoldMutation();
  const [deleteCar, { isLoading: deleting }] = useDeleteCarMutation();

  const [selectedCar, setSelectedCar] = useState(null);
  const [priceDrafts, setPriceDrafts] = useState({});
  const [formData, setFormData] = useState({});
  const [feedback, setFeedback] = useState(null);

  const pushFeedback = (type, message) => setFeedback({ type, message });

  const handleUpdatePrice = async (carId, fallback) => {
    const newPrice = Number(priceDrafts[carId] ?? fallback);
    if (!newPrice || newPrice <= 0) return pushFeedback("error", "Invalid price");
    try {
      await updatePrice({ carId, newPrice }).unwrap();
      pushFeedback("success", "Price updated");
      refetch();
    } catch (err) {
      pushFeedback("error", err?.data?.message || "Price update failed");
    }
  };


  const handleMarkSold = async (carId) => {
    if (!window.confirm("Mark as sold?")) return;
    try {
      await markSold(carId).unwrap();
      pushFeedback("success", "Marked as sold");
      refetch();
    } catch (err) {
      pushFeedback("error", err?.data?.message || "Failed");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await deleteCar(carId).unwrap();
      pushFeedback("success", "Car deleted");
      refetch();
    } catch (err) {
      pushFeedback("error", err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="w-full max-w-4xl px-3 py-4 mx-auto space-y-4 sm:px-4 md:px-6 sm:space-y-6 ">

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs sm:text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* EDIT PANEL */}
      {selectedCar && (
        <div className="p-4 space-y-3 border border-gray-200 shadow-sm bg-background sm:p-5 rounded-xl">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">Edit Car</h2>

          {/* Title */}
          <input
            placeholder="Title"
            defaultValue={selectedCar.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="w-full p-2.5 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />

          {/* Year */}
          <input
            placeholder="Year"
            defaultValue={selectedCar.year}
            onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
            className="w-full p-2.5 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />

          {/* Image Upload */}
          <div>
            <p className="mb-1.5 text-xs sm:text-sm font-medium text-gray-600">Replace Images</p>
            <input
              type="file"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
              className="text-xs sm:text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 w-full"
            />
          </div>

          {/* New Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="object-cover w-16 h-16 border border-gray-200 rounded-md sm:w-20 sm:h-20"
                />
              ))}
            </div>
          )}

          {/* Existing Images */}
          {selectedCar.images?.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-gray-400">Current Images</p>
              <div className="flex flex-wrap gap-2">
                {selectedCar.images.map((img) => (
                  <img
                    key={img.publicId}
                    src={img.url}
                    className="object-cover w-16 h-16 border border-gray-200 rounded-md sm:w-20 sm:h-20 opacity-60"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Save / Cancel */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={async () => {
                try {
                  const payload = { carId: selectedCar._id, ...formData };
                  if (images.length > 0) payload.images = images;
                  await updateCar(payload).unwrap();
                  pushFeedback("success", "Car updated");
                  setSelectedCar(null);
                  setImages([]);
                  setFormData({});
                  refetch();
                } catch (err) {
                  pushFeedback("error", err?.data?.message || "Failed");
                }
              }}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 active:scale-95 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => { setSelectedCar(null); setImages([]); }}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CAR LIST */}
      {isLoading ? (
        <div className="py-12 text-sm text-center text-foreground">Loading cars...</div>
      ) : cars.length === 0 ? (
        <div className="py-12 text-sm text-center text-foreground">No cars found.</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {cars.map((car) => (
            <div
              key={car._id}
              className="p-3 border shadow-sm border-color text-foreground bg-background sm:p-4 rounded-xl"
            >
              {/* Top row: Info + Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                {/* Car Info */}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate text-foreground sm:text-base">
                    {car.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground mt-0.5">
                    {car.year} • {car.fuelType}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                    ₹{Number(car.price).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
                  <button
                    onClick={() => setSelectedCar(car)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 border border-color rounded-lg hover:bg-gray-700 disabled:opacity-50  active:scale-95 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleMarkSold(car._id)}
                    disabled={selling}
                    className="border border-color flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    Sold
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    disabled={deleting}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 active:scale-95 transition-all border border-color"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Price Update Row */}
              <div className="flex gap-2 pt-3 mt-3 border-t border-color">
                <input
                  type="number"
                  value={priceDrafts[car._id] ?? car.price}
                  onChange={(e) =>
                    setPriceDrafts((p) => ({ ...p, [car._id]: e.target.value }))
                  }
                  className="flex-1 p-2 sm:p-2.5 text-sm sm:text-base border border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 min-w-0"
                />
                <button
                  onClick={() => handleUpdatePrice(car._id, car.price)}
                  disabled={updatingPrice}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50 active:scale-95 transition-all whitespace-nowrap border border-color"
                >
                  Update Price
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}