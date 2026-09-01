import { NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { desc } from "drizzle-orm";

export async function GET() {
  await ensureSeeded();
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));
  return NextResponse.json({ testimonials: allTestimonials });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.comment) {
      return NextResponse.json(
        { error: "Name and comment are required." },
        { status: 400 }
      );
    }
    const initials = body.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const [newTestimonial] = await db
      .insert(testimonials)
      .values({
        name: body.name,
        vehiclePurchased: body.vehiclePurchased || "Porsche 911 GT3",
        rating: Number(body.rating || 5),
        comment: body.comment,
        verifiedBy: "Verified by Google",
        date: "Just now",
        avatarInitials: initials || "WW",
      })
      .returning();

    return NextResponse.json({ testimonial: newTestimonial }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error creating testimonial";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
