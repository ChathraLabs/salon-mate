import { NextResponse } from "next/server";
import { requireOwner } from "@/server/auth/guards";
import { availabilitySchema } from "@/server/validation/admin";
import { getAdminAvailability, updateAvailability } from "@/server/services/availability";

export async function GET() {
  const auth = await requireOwner();
  if (auth.response) return auth.response;

  const availability = await getAdminAvailability();
  return NextResponse.json(availability);
}

export async function POST(request: Request) {
  const auth = await requireOwner();
  if (auth.response) return auth.response;

  const parsed = availabilitySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid availability.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await updateAvailability(parsed.data);
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  return POST(request);
}
