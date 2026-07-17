import assert from "node:assert/strict";
import test from "node:test";
import { BookingStatus } from "@prisma/client";
import { buildBookingStatusSms, normalizeSmsPhoneNumber } from "./sms";

process.env.NEXT_PUBLIC_APP_URL = "https://salon-mate-nine.vercel.app";

const booking = {
  bookingCode: "SKD-ABC123",
  customerName: "Nimali",
  phone: "071 234 5678",
  serviceName: "Hair Cut",
  startsAt: new Date("2026-07-20T09:30:00.000Z"),
};

test("normalizes a local Sri Lankan phone number for SMS delivery", () => {
  assert.equal(normalizeSmsPhoneNumber(booking.phone), "94712345678");
});

test("builds a booking confirmation SMS", () => {
  const message = buildBookingStatusSms({ ...booking, status: BookingStatus.CONFIRMED });

  assert.equal(message?.to, "94712345678");
  assert.match(message?.body ?? "", /booking SKD-ABC123/);
  assert.match(message?.body ?? "", /is confirmed/);
  assert.match(message?.body ?? "", /Hair Cut/);
  assert.match(message?.body ?? "", /View booking status: https:\/\/salon-mate-nine\.vercel\.app\/booking\/SKD-ABC123/);
});

test("builds a booking cancellation SMS", () => {
  const message = buildBookingStatusSms({ ...booking, status: BookingStatus.CANCELLED });

  assert.match(message?.body ?? "", /has been cancelled/);
  assert.match(message?.body ?? "", /View booking status:/);
});

test("does not build SMS messages for other booking statuses", () => {
  assert.equal(buildBookingStatusSms({ ...booking, status: BookingStatus.COMPLETED }), null);
});
