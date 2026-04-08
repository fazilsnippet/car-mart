import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBookingMutation } from "./bookingApi";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const bookingSchema = z.object({
  carId: z.string().min(1, "Car is required"),
  bookingType: z.enum(["TEST_DRIVE", "CALLBACK", "VISIT"]),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().max(500, "Max 500 characters").optional(),
});

export default function BookingCreate() {
  const [createBooking, { isLoading, isError, error, isSuccess }] =
    useCreateBookingMutation();

  const location = useLocation();
  const preselectedCarId = location.state?.carId || "";
  const preselectedBookingType = location.state?.bookingType || "";
  const carSnapshot = location.state?.carSnapshot;

  const userId = useSelector((state) => state.auth?.user?._id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      carId: preselectedCarId,
      bookingType: preselectedBookingType,
    },
  });

  const bookingType = watch("bookingType");

  const onSubmit = async (data) => {
    try {
      await createBooking({
        ...data,
        userId,
      }).unwrap();

      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto bg-white shadow rounded-xl bg-background text-foreground">
      <h2 className="mb-4 text-xl font-semibold">Create Booking</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Car Snapshot Card */}
        {carSnapshot && (
          <div className="p-4 border rounded-xl bg-slate-50">
            <div className="flex gap-4">
              {carSnapshot.image && (
                <img
                  src={carSnapshot.image}
                  alt=""
                  className="object-cover w-24 h-16 rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{carSnapshot.title}</h3>
                <p className="text-sm text-slate-600">
                  {carSnapshot.brand} • {carSnapshot.year}
                </p>
                {carSnapshot.price && (
                  <p className="font-medium">
                    ₹ {carSnapshot.price.toLocaleString("en-IN")}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  {carSnapshot.location}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Car ID */}
        <input type="hidden" {...register("carId")} />
        {errors.carId && (
          <p className="text-sm text-red-500">{errors.carId.message}</p>
        )}

        {/* Booking Type */}
        <div>
          <label className="block text-sm font-medium bg-background text-foreground">Booking Type</label>
          <select
            {...register("bookingType")}
            className="w-full p-2 border rounded"
          >
            <option value="">Select type</option>
            <option value="TEST_DRIVE">Test Drive</option>
            <option value="CALLBACK">Request Callback</option>
            <option value="VISIT">Schedule Visit</option>
          </select>
        </div>

        {/* Conditional Fields */}
        {bookingType === "TEST_DRIVE" && (
          <>
            <div>
              <label className="block text-sm font-medium bg-background text-foreground">Preferred Date</label>
              <input
                type="date"
                {...register("preferredDate")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Preferred Time</label>
              <input
                type="time"
                {...register("preferredTime")}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            {...register("message")}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 text-white bg-black rounded hover:opacity-90 bg-background text-foreground"
        >
          {isLoading ? "Submitting..." : "Book Now"}
        </button>

        {/* Error */}
        {isError && (
          <p className="mt-2 text-sm text-red-500">
            {error?.data?.message || "Something went wrong"}
          </p>
        )}

        {/* Success */}
        {isSuccess && (
          <p className="mt-2 text-sm text-green-600">
            Booking created successfully!
          </p>
        )}
      </form>
    </div>
  );
}