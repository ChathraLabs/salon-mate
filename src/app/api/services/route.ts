import { NextResponse } from "next/server";
import { listPublicServices } from "@/server/services/services";

export async function GET() {
  const services = await listPublicServices();
  return NextResponse.json({ services });
}
