import { NextResponse } from "next/server";
import { getAvailability } from "@/server/services/availability";

export async function GET() {
  const days = await getAvailability();
  return NextResponse.json({ days });
}
