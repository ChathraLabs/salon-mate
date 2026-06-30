import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { listStaff, upsertStaff } from "@/server/services/staff";
import { staffSchema } from "@/server/validation/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const staff = await listStaff();
  return NextResponse.json({ staff });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = staffSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid staff member.", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const staff = await upsertStaff(parsed.data);
    return NextResponse.json({ staff });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save staff member." },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}
