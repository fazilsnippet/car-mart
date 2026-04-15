import { useParams } from "react-router-dom";
import { useGetCarSellByIdQuery, useUpdateCarSellMutation } from "../store/carsApi";
import CarForm from "./carForm.jsx";

const EditListingPage = () => {
  const { id } = useParams();
  const { data: car, isLoading } = useGetCarSellByIdQuery(id);
  const [updateCar] = useUpdateCarSellMutation();

  if (isLoading) return <p>Loading...</p>;

  const handleUpdate = async (values) => {
    await updateCar({ id, ...values });
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Edit Listing</h1>
      <CarForm defaultValues={car} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditListingPage;
