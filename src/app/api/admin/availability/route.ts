import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { availabilitySchema } from "@/server/validation/admin";
import { deleteAvailabilityException, getAdminAvailability, updateAvailability } from "@/server/services/availability";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const availability = await getAdminAvailability();
    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load availability." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = availabilitySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid availability.", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await updateAvailability(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save availability." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Availability block id is required." }, { status: 400 });
  }

  try {
    const result = await deleteAvailabilityException(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete availability block." },
      { status: 400 },
    );
  }
}
