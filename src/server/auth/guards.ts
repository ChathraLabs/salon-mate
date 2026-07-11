import { NextResponse } from "next/server";
import { canManageSalon } from "./roles";
import { getCurrentUser } from "./session";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { user, response: null };
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (auth.response) return auth;

  if (!auth.user || !canManageSalon(auth.user.role)) {
    return { user: auth.user, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return auth;
}
