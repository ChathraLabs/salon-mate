import assert from "node:assert/strict";
import test from "node:test";
import { adminBookingUpdateSchema, publicBookingSchema } from "./bookings";

const validBooking = {
  serviceId: "hair-cut-styling",
  date: "2026-06-23",
  time: "09:00",
  customer: {
    name: "Nimali Perera",
    phone: "0712345678",
    email: "nimali@example.com",
  },
  note: "Prefer morning appointment.",
};

test("publicBookingSchema accepts valid booking details", () => {
  assert.equal(publicBookingSchema.safeParse(validBooking).success, true);
});

test("publicBookingSchema rejects missing customer name", () => {
  const result = publicBookingSchema.safeParse({
    ...validBooking,
    customer: { ...validBooking.customer, name: "" },
  });

  assert.equal(result.success, false);
});

test("publicBookingSchema rejects missing customer phone", () => {
  const result = publicBookingSchema.safeParse({
    ...validBooking,
    customer: { ...validBooking.customer, phone: "" },
  });

  assert.equal(result.success, false);
});

test("publicBookingSchema rejects invalid date and time shapes", () => {
  assert.equal(publicBookingSchema.safeParse({ ...validBooking, date: "23-06-2026" }).success, false);
  assert.equal(publicBookingSchema.safeParse({ ...validBooking, time: "9 AM" }).success, false);
});

test("adminBookingUpdateSchema accepts supported status updates", () => {
  const result = adminBookingUpdateSchema.safeParse({
    id: "booking_1",
    status: "CONFIRMED",
    assignedStaffId: null,
    adminNote: "Confirmed by phone.",
  });

  assert.equal(result.success, true);
});

test("adminBookingUpdateSchema rejects unsupported statuses", () => {
  const result = adminBookingUpdateSchema.safeParse({
    id: "booking_1",
    status: "WAITLISTED",
  });

  assert.equal(result.success, false);
});
