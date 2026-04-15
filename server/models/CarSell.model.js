import mongoose from "mongoose";

const carSellSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: {
    type: [String],
    validate: [arr => arr.length <= 12 && arr.length >= 1, "Images must be between 1 and 12"]
  },
  brand: { type: String, required: true },
  year: { type: Number, required: true, min: 1950, max: new Date().getFullYear() },
  fuel: { 
    type: String, 
    enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"], 
    required: true 
  },
  transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
  kmDriven: { type: Number, required: true, min: 0 },
  owners: { type: Number, required: true, max: 7 },
  registrationNumber: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  expectedPrice: { type: Number, required: true, min: 1000 },
  features: [String],
  conditionNotes: String
}, { timestamps: true });

export default mongoose.model("CarSell", carSellSchema);
