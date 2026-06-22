import { NextResponse } from "next/server";
import { requireOwner } from "@/server/auth/guards";
import { listAdminServices, upsertService } from "@/server/services/services";
import { serviceSchema } from "@/server/validation/admin";

export async function GET() {
  const auth = await requireOwner();
  if (auth.response) return auth.response;

  const services = await listAdminServices();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const auth = await requireOwner();
  if (auth.response) return auth.response;

  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid service.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const service = await upsertService(parsed.data);
  return NextResponse.json({ service });
}

export async function PATCH(request: Request) {
  return POST(request);
}
