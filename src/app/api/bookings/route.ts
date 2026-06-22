import { NextResponse } from "next/server";
import { publicBookingSchema } from "@/server/validation/bookings";
import { createPublicBooking } from "@/server/services/bookings";

export async function POST(request: Request) {
  const parsed = publicBookingSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking details.", issues: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const booking = await createPublicBooking(parsed.data);
    return NextResponse.json({
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        status: booking.status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 400 },
    );
  }
}
