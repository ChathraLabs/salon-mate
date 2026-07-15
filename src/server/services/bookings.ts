import { BookingStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { getSalonService, getStaffRoleLabelForService, isStaffAllowedForService } from "@/app/config/services";
import { canManageSalon } from "@/server/auth/roles";
import { addMinutes, dateTimeFromLocalParts, parseDisplayTime } from "./time";
import { getAvailableStaffForAppointment } from "./availability";

function bookingCode() {
  return `SKD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createPublicBooking(input: {
  serviceId: string;
  staffId?: string;
  optionIds?: string[];
  date: string;
  time: string;
  customer: { name: string; phone: string; email?: string };
  note?: string;
}) {
  const service = await prisma.service.findFirst({
    where: { id: input.serviceId, active: true },
    include: { options: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
  });

  if (!service) {
    throw new Error("Selected service is not available.");
  }

  const serviceConfig = getSalonService(service.id);
  const staffRoleLabel = getStaffRoleLabelForService(service.id).toLowerCase();
  const selectedOptionIds = input.optionIds ?? [];
  const storedOptions = service.options.map((option) => ({ id: option.id, name: option.name, duration: option.durationMinutes, price: option.priceCents / 100 }));
  const availableOptions = storedOptions.length > 0 ? storedOptions : serviceConfig?.options ?? [];
  const selectedOptions = availableOptions.filter((option) => selectedOptionIds.includes(option.id));

  if (availableOptions.length > 0 && selectedOptionIds.length > 0 && selectedOptions.length !== selectedOptionIds.length) {
    throw new Error("Selected service options are not available.");
  }

  const durationMinutes = selectedOptions.length > 0
    ? selectedOptions.reduce((total, option) => total + option.duration, 0)
    : service.durationMinutes;
  const time = parseDisplayTime(input.time);
  const startsAt = dateTimeFromLocalParts(input.date, time);
  const endsAt = addMinutes(startsAt, durationMinutes);
  const availability = await getAvailableStaffForAppointment({
    serviceId: service.id,
    date: input.date,
    time,
    durationMinutes,
  });
  const selectedStaff = input.staffId
    ? availability.availableStaff.find((member) => member.id === input.staffId)
    : availability.availableStaff.find((member) => member.isMain) ?? availability.availableStaff[0];

  if (!selectedStaff) {
    const hasRequestedStaff = input.staffId && availability.staff.some((member) => member.id === input.staffId);
    throw new Error(hasRequestedStaff
      ? `Selected ${staffRoleLabel} is no longer available for this time. Please choose another ${staffRoleLabel} or time.`
      : "Selected time is no longer available. Please choose another time.");
  }

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
        assignedStaffId: selectedStaff.id,
        startsAt,
        endsAt,
        status: BookingStatus.PENDING,
        customerNote: input.note,
      },
      include: {
        service: true,
        customer: true,
        assignedStaff: { select: { id: true, name: true, email: true } },
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

  if (input.assignedStaffId) {
    const staff = await prisma.user.findUnique({
      where: { id: input.assignedStaffId },
      select: { name: true, role: true, active: true },
    });

    if (!staff || !staff.active || staff.role === UserRole.SUPER_ADMIN) {
      throw new Error("Selected staff member is not available for assignment.");
    }

    if (!isStaffAllowedForService(booking.serviceId, staff.name)) {
      throw new Error("Selected staff member does not provide this service.");
    }
  }

  if (input.status === BookingStatus.CONFIRMED) {
    const assignedStaffId = input.assignedStaffId !== undefined ? input.assignedStaffId : booking.assignedStaffId;
    const [selectedStaff, owner] = await Promise.all([
      assignedStaffId
        ? prisma.user.findUnique({ where: { id: assignedStaffId }, select: { role: true } })
        : null,
      prisma.user.findFirst({ where: { active: true, role: UserRole.OWNER }, select: { id: true } }),
    ]);
    const staffConflictWhere: Prisma.BookingWhereInput[] = assignedStaffId
      ? [
          { assignedStaffId },
          ...(selectedStaff?.role === UserRole.OWNER ? [{ assignedStaffId: null }] : []),
        ]
      : [
          { assignedStaffId: null },
          ...(owner ? [{ assignedStaffId: owner.id }] : []),
        ];
    const duplicate = await prisma.booking.findFirst({
      where: {
        id: { not: input.id },
        status: BookingStatus.CONFIRMED,
        startsAt: { lt: booking.endsAt },
        endsAt: { gt: booking.startsAt },
        OR: staffConflictWhere,
      },
    });

    if (duplicate) {
      const staffRoleLabel = getStaffRoleLabelForService(booking.serviceId).toLowerCase();
      throw new Error(`This ${staffRoleLabel} already has a confirmed booking at that time.`);
    }
  }

  const updated = await prisma.booking.update({
    where: { id: input.id },
    data: {
      status: input.status,
      assignedStaffId: canManageSalon(actor.role) ? input.assignedStaffId : undefined,
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
