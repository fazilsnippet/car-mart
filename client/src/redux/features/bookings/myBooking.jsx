import { useGetBookingsQuery, useUpdateBookingMutation } from "./bookingApi";
import { useState } from "react";
import { Car, IndianRupee, Tag, Edit3, Save } from "lucide-react";

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
    console.error(err);
  }
};

  return (
    <div>
      {bookings.map((booking) => {
        const imageUrl = booking.car?.image?.url?.replace(
          "/upload/",
          "/upload/w_200,h_200,c_fill,q_auto/"
        );

        return (
         <div
  key={booking._id}
  className="flex items-center justify-between gap-4 px-4 py-4 border-b min-h-[120px]"
>
  {/* LEFT */}
  <div className="flex-1 space-y-2">
    <div className="flex items-center gap-2">
      <Car size={18} />
      <h2 className="text-base font-semibold">
        {booking.car?.title}
      </h2>
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <IndianRupee size={16} />
      <span>{booking.car?.price}</span>
    </div>

    <div className="flex items-center gap-2 text-sm">
      <Tag size={16} />
      <span className="px-2 py-1 bg-gray-200 rounded">
        {booking.status}
      </span>
    </div>

   {editingId === booking._id ? (
  <div className="flex items-center gap-2">
    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="TEST_DRIVE">Test Drive</option>
      <option value="CALLBACK">Callback</option>
      <option value="VISIT">Visit</option>
    </select>

    <button
      onClick={() => handleUpdate(booking._id)}
      className="px-3 py-2 text-white bg-blue-500 rounded"
    >
      Save
    </button>

    <button
      onClick={() => setEditingId(null)}
      className="px-3 py-2 border rounded"
    >
      Cancel
    </button>
  </div>
) : (
  <div className="flex items-center justify-between">
    <p className="text-sm caret-black">Type: {booking.bookingType}</p>

    {/* <button
      onClick={() => {
        setEditingId(booking._id);
        setType(booking.bookingType);
      }}
      className="text-sm text-blue-500"
    >
      Edit
    </button> */}
  </div>
)}

    <button
      onClick={() => {
        setEditingId(booking._id);
        setType(booking.type);
      }}
      className="flex items-center gap-1 text-sm text-blue-500"
    >
      <Edit3 size={16} />
      Edit
    </button>
  </div>

  {/* RIGHT IMAGE */}
  <div className="w-28 h-28 shrink-0 overflow-hidden rounded-lg">
    <img
      src={
        booking.car?.image?.url?.replace(
          "/upload/",
          "/upload/w_300,h_300,c_fill,q_auto/"
        )
      }
      alt={booking.car?.title}
      className="w-full h-full object-cover"
    />
  </div>
</div>
        );
      })}

      {/* PAGINATION (compact) */}
      <div className="flex justify-center gap-3 mt-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          {data?.data?.page} / {data?.data?.pages}
        </span>

        <button
          disabled={page === data?.data?.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}