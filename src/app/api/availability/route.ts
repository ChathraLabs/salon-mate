import { NextResponse } from "next/server";
import { getAvailability } from "@/server/services/availability";

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Online booking is not connected yet." },
      { status: 503 },
    );
  }

  try {
    const url = new URL(request.url);
    const duration = Number(url.searchParams.get("duration") ?? 0);
    const serviceId = url.searchParams.get("serviceId");
    const availability = await getAvailability(
      7,
      Number.isFinite(duration) && duration > 0 ? duration : 0,
      serviceId,
    );
    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load availability right now." },
      { status: 503 },
    );
  }
}
