import CarSell from "../models/CarSell.model.js";
import { carValidation } from "../utils/validators/car.validators.js";
import { uploadOnCloudinary, cleanupUploadsFolder, deleteFromCloudinary } from "../utils/cloudinary.js";
// ✅ Create Car
export const createCarSell = async (req, res) => {
  try {
    const { error } = carValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const car = new CarSell(req.body);
    let uploadedImages = [];
    
        if (req.files?.length > 0) {
          const results = await Promise.allSettled(
            req.files.map(file => uploadOnCloudinary(file.path))
          );
    
          uploadedImages = results
            .filter(r => r.status === "fulfilled" && r.value)
            .map(r => ({
              url: r.value.url || r.value.secure_url,
              publicId: r.value.public_id
            }));
        }
    await car.save();
    res.status(201).json(car);
  } catch (error) {
     if (error?.code === 11000) {
       return res.status(409).json({
         success: false,
         message: "Duplicate car entry detected."
       });
     }
     next(error);
   } finally {
     cleanupUploadsFolder();
   }
};

// ✅ Get All Cars
export const getCarsSell = async (req, res) => {
  try {
    const cars = await CarSell.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Car By ID
export const getCarSellById = async (req, res) => {
  try {
    const car = await CarSell.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Car
export const updateCarSell = async (req, res) => {
  try {
    const { error } = carValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const car = await CarSell.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: "Car not found" });
    
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Car
export const deleteCarSell = async (req, res) => {
  try {
    const car = await CarSell.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
