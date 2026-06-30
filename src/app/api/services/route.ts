import { NextResponse } from "next/server";
import { listPublicServices } from "@/server/services/services";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Online booking is not connected yet." },
      { status: 503 },
    );
  }

  try {
    const services = await listPublicServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load services right now." },
      { status: 503 },
    );
  }
}
