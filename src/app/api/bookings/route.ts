import { NextResponse } from "next/server";
import { publicBookingSchema } from "@/server/validation/bookings";
import { createPublicBooking } from "@/server/services/bookings";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Online booking is not connected yet. Please call the salon to confirm this appointment." },
      { status: 503 },
    );
  }

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
    console.error(error);
    return NextResponse.json(
      { error: "Unable to create the booking right now. Please call the salon to confirm this appointment." },
      { status: 503 },
    );
  }
}
