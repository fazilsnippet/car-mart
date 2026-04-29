// import { z } from "zod";

// export const carSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),

//   // 🔥 Optional for edit mode, required logic handled in component
//   images: z
//     .array(z.instanceof(File))
//     .max(12, "Maximum 12 images allowed")
//     .optional(),

//   brand: z.string().min(2, "Brand is required"),

//   year: z.coerce
//     .number()
//     .min(1950)
//     .max(new Date().getFullYear()),

//   fuelType: z.enum([
//     "Petrol",
//     "Diesel",
//     "Electric",
//     "Hybrid",
//     "CNG",
//     "LPG",
//   ]),

//   transmission: z.enum(["Manual", "Automatic"]),

//   kmDriven: z.coerce.number().min(0),

//   owners: z.coerce.number().min(1).max(7),

//   registrationNumber: z
//     .string()
//     .min(1, "Registration number required")
//     .transform((val) => val.toUpperCase()),

//   // ✅ FIXED NAME
//   expectedPrice: z.coerce
//     .number()
//     .min(1000, "Price must be at least 1000"),

//   // 🔥 Accept string → convert to array
//   features: z
//     .string()
//     .optional()
//     .transform((val) =>
//       val
//         ? val.split(",").map((f) => f.trim()).filter(Boolean)
//         : []
//     ),

//   conditionNotes: z.string().optional(),
// });

import { z } from "zod";

export const carSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  // 🔥 REQUIRED on create, optional on edit (handle in component)
  images: z
    .array(z.instanceof(File))
    .min(1, "At least 1 image is required")
    .max(12, "Maximum 12 images allowed")
    .optional(),

  brand: z.string().min(2, "Brand is required"),

  year: z.coerce
    .number()
    .min(1950)
    .max(new Date().getFullYear()),

  fuelType: z.enum([
    "Petrol",
    "Diesel",
    "Electric",
    "Hybrid",
    "CNG",
    "LPG",
  ]),

  transmission: z.enum(["Manual", "Automatic"]),

  kmDriven: z.coerce.number().min(0, "KM must be positive"),

  owners: z.coerce.number().min(1).max(7),

  registrationNumber: z
    .string()
    .min(1, "Registration number required")
    .transform((val) => val.toUpperCase()),

  expectedPrice: z.coerce
    .number()
    .min(1000, "Price must be at least 1000"),

  // 🔥 NEW (REQUIRED)
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),

  // 🔥 NEW (REQUIRED)
  location: z
    .string()
    .min(2, "Location is required"),

  // 🔥 Better parsing → always array
  features: z
    .union([
      z.string(),
      z.array(z.string())
    ])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }),

  conditionNotes: z.string().max(1000).optional(),
});