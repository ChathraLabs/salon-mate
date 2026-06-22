import { BookingStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/guards";
import { adminBookingUpdateSchema } from "@/server/validation/bookings";
import { listAdminBookings, updateAdminBooking } from "@/server/services/bookings";

export async function GET(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const url = new URL(request.url);
  const status = url.searchParams.get("status") as BookingStatus | null;
  const staffId = url.searchParams.get("staffId") ?? undefined;
  const bookings = await listAdminBookings(
    {
      status: status && Object.values(BookingStatus).includes(status) ? status : undefined,
      staffId,
    },
    auth.user ? { id: auth.user.id, role: auth.user.role } : undefined,
  );

  return NextResponse.json({ bookings });
}

export async function PATCH(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  const parsed = adminBookingUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking update.", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const booking = await updateAdminBooking(
      {
        id: parsed.data.id,
        status: parsed.data.status as BookingStatus | undefined,
        assignedStaffId: parsed.data.assignedStaffId,
        adminNote: parsed.data.adminNote,
      },
      { id: auth.user!.id, role: auth.user!.role as UserRole },
    );

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update booking." },
      { status: 400 },
    );
  }
}
