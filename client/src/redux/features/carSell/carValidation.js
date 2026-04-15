import { z } from "zod";

export const carSchema = z.object({
  title: z.string().min(1),
  images: z.array(z.string().url()).min(1).max(12),
  brand: z.string().min(1),
  year: z.number().min(1950).max(new Date().getFullYear()),
  fuel: z.enum(["Petrol","Diesel","Electric","Hybrid","CNG","LPG"]),
  transmission: z.enum(["Manual","Automatic"]),
  kmDriven: z.number().min(0),
  owners: z.number().max(7),
  registrationNumber: z.string().min(1),
  location: z.string().min(1),
  expectedPrice: z.number().min(1000),
  features: z.array(z.string()).optional(),
  conditionNotes: z.string().optional()
});
