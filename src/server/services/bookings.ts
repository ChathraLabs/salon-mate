import { BookingStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { addMinutes, dateTimeFromLocalParts, parseDisplayTime } from "./time";

function bookingCode() {
  return `SKD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createPublicBooking(input: {
  serviceId: string;
  date: string;
  time: string;
  customer: { name: string; phone: string; email?: string };
  note?: string;
}) {
  const service = await prisma.service.findFirst({
    where: { id: input.serviceId, active: true },
  });

  if (!service) {
    throw new Error("Selected service is not available.");
  }

  const time = parseDisplayTime(input.time);
  const startsAt = dateTimeFromLocalParts(input.date, time);
  const endsAt = addMinutes(startsAt, service.durationMinutes);

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        name: input.customer.name,
        phone: input.customer.phone,
        email: input.customer.email || null,
      },
    });

    return tx.booking.create({
      data: {
        bookingCode: bookingCode(),
        serviceId: service.id,
        customerId: customer.id,
        startsAt,
        endsAt,
        status: BookingStatus.PENDING,
        customerNote: input.note,
      },
      include: {
        service: true,
        customer: true,
      },
    });
  });
}

export async function listAdminBookings(filters: { status?: BookingStatus; staffId?: string }, viewer?: { id: string; role: UserRole }) {
  const where: Prisma.BookingWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.staffId) where.assignedStaffId = filters.staffId;
  if (viewer?.role === UserRole.STAFF) {
    where.OR = [{ assignedStaffId: viewer.id }, { assignedStaffId: null }];
  }

  return prisma.booking.findMany({
    where,
    include: {
      service: true,
      customer: true,
      assignedStaff: { select: { id: true, name: true, email: true } },
    },
    orderBy: { startsAt: "desc" },
    take: 100,
  });
}

export async function updateAdminBooking(
  input: {
    id: string;
    status?: BookingStatus;
    assignedStaffId?: string | null;
    adminNote?: string | null;
  },
  actor: { id: string; role: UserRole },
) {
  const booking = await prisma.booking.findUnique({ where: { id: input.id } });
  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (actor.role === UserRole.STAFF && booking.assignedStaffId && booking.assignedStaffId !== actor.id) {
    throw new Error("You cannot update another staff member's booking.");
  }

  if (actor.role === UserRole.STAFF && input.assignedStaffId !== undefined) {
    throw new Error("Only owners can assign staff.");
  }

  if (input.status === BookingStatus.CONFIRMED) {
    const duplicate = await prisma.booking.findFirst({
      where: {
        id: { not: input.id },
        status: BookingStatus.CONFIRMED,
        startsAt: booking.startsAt,
      },
    });

    if (duplicate) {
      throw new Error("This slot already has a confirmed booking.");
    }
  }

  const updated = await prisma.booking.update({
    where: { id: input.id },
    data: {
      status: input.status,
      assignedStaffId: actor.role === UserRole.OWNER ? input.assignedStaffId : undefined,
      adminNote: input.adminNote,
    },
    include: {
      service: true,
      customer: true,
      assignedStaff: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: actor.id,
      action: "booking.update",
      entity: "Booking",
      entityId: input.id,
      metadata: {
        status: input.status,
        assignedStaffId: input.assignedStaffId,
      },
    },
  });

  return updated;
}
