import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCarSellByIdQuery,
  useUpdateCarSellMutation,
} from "./carSellApi.js";
import CarForm from "./carForm.jsx";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCarSellByIdQuery(id);

  const [updateCar, { isLoading: isUpdating }] =
    useUpdateCarSellMutation();

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return (
      <p className="text-red-500">
        {error?.data?.message || "Failed to load car"}
      </p>
    );
  }

  const car = data?.data ?? data;

  if (!car) {
    return <p className="text-gray-500">Car not found</p>;
  }

  const handleUpdate = async (values) => {
    try {
      await updateCar({ id, ...values }).unwrap();

      // 🔥 simple UX improvement
      navigate("/carSell"); // or your listings page
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Edit Listing</h1>

      <CarForm
        defaultValues={car}
        onSubmit={handleUpdate}
        isEditing
        isLoading={isUpdating}
      />
    </div>
  );
};

export default EditListingPage;