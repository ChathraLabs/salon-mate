import { NextResponse } from "next/server";
import { getAvailability } from "@/server/services/availability";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Online booking is not connected yet." },
      { status: 503 },
    );
  }

  try {
    const days = await getAvailability();
    return NextResponse.json({ days });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load availability right now." },
      { status: 503 },
    );
  }
}
