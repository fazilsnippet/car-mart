import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { desc, asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const bodyType = searchParams.get("bodyType");
  const fuelType = searchParams.get("fuelType");
  const ownerHistory = searchParams.get("ownerHistory");
  const seatingCapacity = searchParams.get("seatingCapacity");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const search = searchParams.get("search")?.toLowerCase();
  const sortBy = searchParams.get("sortBy") || "featured";

  let allVehicles = await db.select().from(vehicles);

  if (brand && brand !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.brand.toLowerCase() === brand.toLowerCase()
    );
  }
  if (category && category !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (bodyType && bodyType !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.bodyType.toLowerCase() === bodyType.toLowerCase()
    );
  }
  if (fuelType && fuelType !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.fuelType.toLowerCase() === fuelType.toLowerCase()
    );
  }
  if (ownerHistory && ownerHistory !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.ownerHistory.toLowerCase() === ownerHistory.toLowerCase()
    );
  }
  if (seatingCapacity && seatingCapacity !== "All") {
    allVehicles = allVehicles.filter(
      (v) => v.seatingCapacity === Number(seatingCapacity)
    );
  }
  if (minYear) {
    allVehicles = allVehicles.filter((v) => v.year >= Number(minYear));
  }
  if (maxYear) {
    allVehicles = allVehicles.filter((v) => v.year <= Number(maxYear));
  }
  if (search) {
    allVehicles = allVehicles.filter(
      (v) =>
        v.title.toLowerCase().includes(search) ||
        v.brand.toLowerCase().includes(search) ||
        v.model.toLowerCase().includes(search) ||
        v.exteriorColor.toLowerCase().includes(search) ||
        v.engineSpecs.toLowerCase().includes(search)
    );
  }

  if (sortBy === "price_asc") {
    allVehicles.sort((a, b) => a.priceRaw - b.priceRaw);
  } else if (sortBy === "price_desc") {
    allVehicles.sort((a, b) => b.priceRaw - a.priceRaw);
  } else if (sortBy === "year_desc") {
    allVehicles.sort((a, b) => b.year - a.year);
  } else if (sortBy === "kms_asc") {
    allVehicles.sort((a, b) => a.kmsDriven - b.kmsDriven);
  } else {
    // featured first, then newest
    allVehicles.sort((a, b) => {
      if (a.isFeatured === b.isFeatured) return b.id - a.id;
      return a.isFeatured ? -1 : 1;
    });
  }

  return NextResponse.json({ vehicles: allVehicles });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug =
      body.slug ||
      `${body.brand}-${body.model}-${body.year}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        slug,
        title: body.title,
        category: body.category || "Pre-Loved Luxury",
        brand: body.brand,
        model: body.model,
        year: Number(body.year),
        priceInr: body.priceInr,
        priceRaw: Number(body.priceRaw || 350),
        kmsDriven: Number(body.kmsDriven || 0),
        fuelType: body.fuelType || "Petrol",
        transmission: body.transmission || "Automatic",
        bodyType: body.bodyType || "Supercar",
        seatingCapacity: Number(body.seatingCapacity || 2),
        ownerHistory: body.ownerHistory || "1st Owner",
        registrationCity: body.registrationCity || "MH-01 Mumbai",
        exteriorColor: body.exteriorColor || "Nero Black",
        interiorColor: body.interiorColor || "Nero Leather",
        engineSpecs: body.engineSpecs || "4.0L Twin-Turbo V8",
        acceleration0to100: body.acceleration0to100 || "3.2 sec",
        topSpeed: body.topSpeed || "310 km/h",
        imageUrl:
          body.imageUrl ||
          "https://images.pexels.com/photos/30687976/pexels-photo-30687976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=750&w=1400",
        galleryImages: body.galleryImages || [
          body.imageUrl ||
            "https://images.pexels.com/photos/30687976/pexels-photo-30687976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=750&w=1400",
        ],
        inspectionPoints: Number(body.inspectionPoints || 150),
        certifiedStatus: true,
        warrantyStatus: body.warrantyStatus || "Wish Wheels Royal Shield 2-Year Cover",
        highlights: body.highlights || ["150-Point Certified", "Full PPF Coating", "Zero Accident History"],
        isFeatured: Boolean(body.isFeatured),
        isHeroSlide: Boolean(body.isHeroSlide),
      })
      .returning();

    return NextResponse.json({ vehicle: newVehicle }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error creating vehicle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
