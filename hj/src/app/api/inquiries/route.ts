import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  const allInquiries = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));
  return NextResponse.json({ inquiries: allInquiries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    // If it's a 29-Minute Valuation, compute an estimated luxury valuation range automatically if not provided
    let estimatedValuation = body.estimatedValuation || null;
    if (body.type === "29-Minute Car Valuation" && !estimatedValuation) {
      const year = Number(body.carToSellYear || 2022);
      const brand = body.carToSellBrand || "Luxury";
      const baseEstimate =
        brand === "Ferrari" || brand === "Lamborghini" || brand === "Rolls-Royce"
          ? 380
          : brand === "Porsche" || brand === "Bentley" || brand === "McLaren"
          ? 220
          : 110;
      const ageAdjustment = Math.max(0.65, 1 - (2026 - year) * 0.08);
      const lowCr = ((baseEstimate * ageAdjustment) / 100).toFixed(2);
      const highCr = (((baseEstimate * ageAdjustment) * 1.12) / 100).toFixed(2);
      estimatedValuation = `₹ ${lowCr} Cr – ₹ ${highCr} Cr`;
    }

    const [created] = await db
      .insert(inquiries)
      .values({
        type: body.type || "VIP Showroom Viewing",
        vehicleId: body.vehicleId ? Number(body.vehicleId) : null,
        vehicleTitle: body.vehicleTitle || null,
        customerName: body.customerName,
        phone: body.phone,
        email: body.email || null,
        preferredDate: body.preferredDate || null,
        city: body.city || "Mumbai Flagship Showroom",
        carToSellBrand: body.carToSellBrand || null,
        carToSellModel: body.carToSellModel || null,
        carToSellYear: body.carToSellYear ? Number(body.carToSellYear) : null,
        estimatedValuation,
        notes: body.notes || null,
        status: "New Inquiry",
      })
      .returning();

    return NextResponse.json({ inquiry: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error creating inquiry";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const [updated] = await db
      .update(inquiries)
      .set({ status: body.status })
      .where(eq(inquiries.id, Number(body.id)))
      .returning();
    return NextResponse.json({ inquiry: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error updating inquiry";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
