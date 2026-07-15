import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { listAdminServices, upsertService } from "@/server/services/services";
import { serviceSchema } from "@/server/validation/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const services = await listAdminServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Unable to load admin services", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load services." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const parsed = serviceSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid service.", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const service = await upsertService(parsed.data);
    return NextResponse.json({ service });
  } catch (error) {
    console.error("Unable to save admin service", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save service." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}
