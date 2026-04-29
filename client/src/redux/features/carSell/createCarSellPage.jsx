import { useNavigate } from "react-router-dom";
import { useCreateCarSellMutation } from "./carSellApi";
import CarForm from "./carForm";

const CreateCarPage = () => {
  const navigate = useNavigate();
  const [createCarSell, { isLoading }] = useCreateCarSellMutation();

  const handleSubmit = async (data, resetForm) => {
    try {
      const res = await createCarSell(data).unwrap();

      // ✅ SUCCESS STRATEGY
      // Option A: Redirect
      navigate("/myListings");

      // Option B (alternative): reset form instead
      // resetForm();

    } catch (err) {

      // 🔥 HANDLE CONFLICT (409)
      if (err.status === 409) {
        alert("Car with this registration already exists.");
        return;
      }

      // 🔥 VALIDATION ERRORS
      if (err.status === 400 && err.data?.errors) {
        alert(err.data.errors.join("\n"));
        return;
      }

      // 🔥 FALLBACK
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <CarForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default CreateCarPage;