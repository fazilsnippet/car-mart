import { z } from "zod";

export const carSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  // 🔥 Files, not URLs
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(12, "Maximum 12 images allowed"),

  brand: z.string().min(2, "Brand is required"),

  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .min(1950)
    .max(new Date().getFullYear()),

  // 🔥 Must match backend field name
  fuelType: z.enum([
    "Petrol",
    "Diesel",
    "Electric",
    "Hybrid",
    "CNG",
    "LPG",
  ]),

  transmission: z.enum(["Manual", "Automatic"]),

  kmDriven: z
    .number({ invalid_type_error: "KM Driven must be a number" })
    .min(0),

  owners: z
    .number({ invalid_type_error: "Owners must be a number" })
    .min(0)
    .max(7),

  registrationNumber: z.string().min(1, "Registration number required"),


  // 🔥 Match backend: price (not expectedPrice)
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(1000, "Price must be at least 1000"),

  features: z.array(z.string()).optional(),

  conditionNotes: z.string().optional(),
});