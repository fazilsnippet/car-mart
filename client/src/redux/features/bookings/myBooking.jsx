import { useGetBookingsQuery, useUpdateBookingMutation } from "./bookingApi";
import { useState } from "react";
import { Car, IndianRupee, Tag, Edit3, Save, ArrowLeft } from "lucide-react";


export default function MyBookings() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetBookingsQuery({
    page,
    limit: 10,
  });

  const [updateBooking, { isLoading: isUpdating }] =
    useUpdateBookingMutation();

  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState("");

  const bookings = data?.data?.bookings || [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;
  if (!bookings.length) return <p className="text-center">No bookings found</p>;

  const handleUpdate = async (id) => {
  try {
    await updateBooking({ id, type }).unwrap();
    setEditingId(null);
  } catch (err) {
  }
};
return (
  <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
    
    {/* HEADER */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.history.back()}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <ArrowLeft />
      </button>

      <h1 className="text-xl font-semibold text-gray-800">
        My Bookings
      </h1>
    </div>

    {/* LIST */}
    <div className="space-y-4">
      {bookings.map((booking) => {
        const imageUrl = booking.car?.image?.url?.replace(
          "/upload/",
          "/upload/w_300,h_300,c_fill,q_auto/"
        );

        return (
          <div
            key={booking._id}
            className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
          >
            {/* IMAGE */}
            <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <img
                src={imageUrl}
                alt={booking.car?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col justify-between">
              
              {/* TOP */}
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {booking.car?.title}
                </h2>

                <p className="text-indigo-600 font-semibold">
                  ₹ {booking.car?.price?.toLocaleString("en-IN")}
                </p>
              </div>

              {/* META */}
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-lg">
                  {booking.status}
                </span>

                <span>•</span>

                <span>Type: {booking.bookingType}</span>
              </div>

              {/* EDIT AREA */}
              {editingId === booking._id ? (
                <div className="flex items-center gap-2 mt-3">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <option value="TEST_DRIVE">Test Drive</option>
                    <option value="CALLBACK">Callback</option>
                    <option value="VISIT">Visit</option>
                  </select>

                  <button
                    onClick={() => handleUpdate(booking._id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 border border-gray-200 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => {
                      setEditingId(booking._id);
                      setType(booking.bookingType);
                    }}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* PAGINATION */}
    <div className="flex justify-center items-center gap-4 pt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-600">
        {data?.data?.page} / {data?.data?.pages}
      </span>

      <button
        disabled={page === data?.data?.pages}
        onClick={() => setPage((p) => p + 1)}
        className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);
}
