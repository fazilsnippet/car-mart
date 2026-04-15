import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema } from "./carValidation.js";
import { useCreateCarSellMutation } from "./carSellApi";

const CarForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(carSchema)
  });
  const [createCar] = useCreateCarSellMutation();

  const onSubmit = async (data) => {
    await createCar(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 bg-white shadow rounded-xl">
      <input {...register("title")} placeholder="Car Title / Model Name" className="w-full p-2 border rounded" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <input {...register("brand")} placeholder="Brand" className="w-full p-2 border rounded" />
      <input type="number" {...register("year")} placeholder="Year" className="w-full p-2 border rounded" />
      <select {...register("fuel")} className="w-full p-2 border rounded">
        <option value="">Select Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="Hybrid">Hybrid</option>
        <option value="CNG">CNG</option>
        <option value="LPG">LPG</option>
      </select>
      {/* … other inputs for transmission, kmDriven, owners, registrationNumber, location, expectedPrice, features, conditionNotes */}
      <button type="submit" className="w-full py-3 text-white bg-indigo-600 rounded-xl">Submit</button>
    </form>
  );
};

export default CarForm;
