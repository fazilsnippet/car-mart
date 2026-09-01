import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'Pre-Loved Luxury' | 'Un-Registered Exotics' | 'Bespoke Showroom'
  brand: text("brand").notNull(), // Porsche, Ferrari, Lamborghini, Mercedes-AMG, Rolls-Royce, BMW M, Range Rover, Bentley, McLaren
  model: text("model").notNull(),
  year: integer("year").notNull(),
  priceInr: text("price_inr").notNull(), // e.g. "₹ 3.85 Cr"
  priceRaw: integer("price_raw").notNull(), // in Lakhs for sorting (e.g. 385 for 3.85 Cr)
  kmsDriven: integer("kms_driven").notNull(),
  fuelType: text("fuel_type").notNull(), // Petrol, Hybrid, Electric, Diesel
  transmission: text("transmission").notNull(),
  bodyType: text("body_type").notNull(), // Supercar, Coupe, Convertible, Luxury SUV, Grand Tourer, Limousine
  seatingCapacity: integer("seating_capacity").notNull(),
  ownerHistory: text("owner_history").notNull(), // Unregistered (0 KM), 1st Owner, Single Corporate Owner
  registrationCity: text("registration_city").notNull(),
  exteriorColor: text("exterior_color").notNull(),
  interiorColor: text("interior_color").notNull(),
  engineSpecs: text("engine_specs").notNull(),
  acceleration0to100: text("acceleration_0_to_100").notNull(),
  topSpeed: text("top_speed").notNull(),
  imageUrl: text("image_url").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull(),
  inspectionPoints: integer("inspection_points").notNull().default(150),
  certifiedStatus: boolean("certified_status").notNull().default(true),
  warrantyStatus: text("warranty_status").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isHeroSlide: boolean("is_hero_slide").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "VIP Showroom Viewing" | "29-Minute Car Valuation" | "Vehicle Inquiry" | "Performance & PPF Service"
  vehicleId: integer("vehicle_id"),
  vehicleTitle: text("vehicle_title"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  preferredDate: text("preferred_date"),
  city: text("city"),
  carToSellBrand: text("car_to_sell_brand"),
  carToSellModel: text("car_to_sell_model"),
  carToSellYear: integer("car_to_sell_year"),
  estimatedValuation: text("estimated_valuation"),
  notes: text("notes"),
  status: text("status").notNull().default("New Inquiry"), // New Inquiry, Concierge Assigned, Showroom Scheduled, Completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  vehiclePurchased: text("vehicle_purchased").notNull(),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  verifiedBy: text("verified_by").notNull().default("Verified by Google"),
  date: text("date").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
