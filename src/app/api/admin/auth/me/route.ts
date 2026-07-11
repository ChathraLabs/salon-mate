import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/guards";

export async function GET() {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  return NextResponse.json({
    user: {
      id: auth.user!.id,
      name: auth.user!.name,
      email: auth.user!.email,
      role: auth.user!.role,
    },
  });
}
