import { randomUUID } from "crypto";
import { BookingStatus, UserRole } from "@prisma/client";
import { getStaffKeysForService, staffAvatarForName, staffKeyForName } from "@/app/config/services";
import { prisma } from "@/server/db";
import { addMinutes, dateKey, dateTimeFromLocalParts, nextDateOptions } from "./time";

const publicSlotTimes = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const blockingBookingStatuses = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
const publicStaffRoles = [UserRole.OWNER, UserRole.STAFF];

type StaffMember = {
  id: string;
  name: string;
  role: UserRole;
};

type BlockingBooking = {
  startsAt: Date;
  endsAt: Date;
  assignedStaffId: string | null;
};

type BlockingException = {
  type: "BLOCKED" | "SPECIAL_OPEN";
  startsAt: string | null;
  endsAt: string | null;
  staffId: string | null;
};

type AvailabilityExceptionRecord = BlockingException & {
  id: string;
  date: Date;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function minutesFromTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function rangesOverlap(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

function timeRangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return minutesFromTime(startA) < minutesFromTime(endB) && minutesFromTime(endA) > minutesFromTime(startB);
}

function serializePublicStaff(staff: StaffMember[], mainStaffId: string | null) {
  return staff.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role as "OWNER" | "STAFF",
    isMain: member.id === mainStaffId,
    avatarUrl: staffAvatarForName(member.name),
  }));
}

function getMainStaffId(staff: StaffMember[]) {
  return staff.find((member) => member.role === UserRole.OWNER)?.id ?? staff[0]?.id ?? null;
}

function slotFitsWindow(input: {
  slot: string;
  durationMinutes: number;
  dayHours?: { opensAt: string; closesAt: string; active: boolean } | null;
  specialOpenings: Array<{ startsAt: string | null; endsAt: string | null }>;
}) {
  if (input.durationMinutes <= 0) return true;

  const startsAt = minutesFromTime(input.slot);
  const endsAt = startsAt + input.durationMinutes;
  const matchingSpecialOpening = input.specialOpenings.find((opening) => opening.startsAt === input.slot);

  if (matchingSpecialOpening) {
    return !matchingSpecialOpening.endsAt || endsAt <= minutesFromTime(matchingSpecialOpening.endsAt);
  }

  if (!input.dayHours?.active) return false;

  return startsAt >= minutesFromTime(input.dayHours.opensAt) && endsAt <= minutesFromTime(input.dayHours.closesAt);
}

function bookingBlocksStaff(booking: BlockingBooking, staffId: string, mainStaffId: string | null, startsAt: Date, endsAt: Date) {
  const bookingStaffId = booking.assignedStaffId ?? mainStaffId;

  return bookingStaffId === staffId
    && rangesOverlap(startsAt, endsAt, booking.startsAt, booking.endsAt);
}

function exceptionBlocksSalon(exception: BlockingException, slot: string, durationMinutes: number) {
  if (exception.type !== "BLOCKED" || exception.staffId) return false;
  if (!exception.startsAt) return true;

  const slotEndsAt = timeFromMinutes(minutesFromTime(slot) + durationMinutes);
  const exceptionEndsAt = exception.endsAt ?? timeFromMinutes(minutesFromTime(exception.startsAt) + 60);
  return timeRangesOverlap(slot, slotEndsAt, exception.startsAt, exceptionEndsAt);
}

function exceptionBlocksStaff(exception: BlockingException, staffId: string, slot: string, durationMinutes: number) {
  if (exception.type !== "BLOCKED") return false;
  if (exception.staffId && exception.staffId !== staffId) return false;
  if (!exception.startsAt) return true;

  const slotEndsAt = timeFromMinutes(minutesFromTime(slot) + durationMinutes);
  const exceptionEndsAt = exception.endsAt ?? timeFromMinutes(minutesFromTime(exception.startsAt) + 60);
  return timeRangesOverlap(slot, slotEndsAt, exception.startsAt, exceptionEndsAt);
}

function timeFromMinutes(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

async function listBookableStaff() {
  return prisma.user.findMany({
    where: { active: true, role: { in: publicStaffRoles } },
    select: { id: true, name: true, role: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

async function listAvailabilityExceptionsForDate(date: Date) {
  return prisma.$queryRaw<AvailabilityExceptionRecord[]>`
    SELECT
      "id",
      "date",
      "staffId",
      "type"::text AS "type",
      "startsAt",
      "endsAt",
      "reason",
      "createdAt",
      "updatedAt"
    FROM "AvailabilityException"
    WHERE "date" = ${date}
  `;
}

async function listAvailabilityExceptionsForRange(start: Date, end: Date) {
  return prisma.$queryRaw<AvailabilityExceptionRecord[]>`
    SELECT
      "id",
      "date",
      "staffId",
      "type"::text AS "type",
      "startsAt",
      "endsAt",
      "reason",
      "createdAt",
      "updatedAt"
    FROM "AvailabilityException"
    WHERE "date" >= ${start} AND "date" <= ${end}
  `;
}

async function listAdminAvailabilityExceptions() {
  return prisma.$queryRaw<AvailabilityExceptionRecord[]>`
    SELECT
      "id",
      "date",
      "staffId",
      "type"::text AS "type",
      "startsAt",
      "endsAt",
      "reason",
      "createdAt",
      "updatedAt"
    FROM "AvailabilityException"
    ORDER BY "date" DESC, "startsAt" ASC NULLS FIRST
    LIMIT 100
  `;
}

function filterStaffForService(staff: StaffMember[], serviceId?: string | null) {
  const assignedStaff = getStaffKeysForService(serviceId);
  if (!assignedStaff) return staff;

  return staff
    .filter((member) => {
      const staffKey = staffKeyForName(member.name);
      return staffKey !== null && assignedStaff.includes(staffKey);
    })
    .sort((first, second) => {
      const firstKey = staffKeyForName(first.name);
      const secondKey = staffKeyForName(second.name);
      return assignedStaff.indexOf(firstKey!) - assignedStaff.indexOf(secondKey!);
    });
}

export async function getAvailableStaffForAppointment(input: {
  serviceId?: string | null;
  date: string;
  time: string;
  durationMinutes: number;
}) {
  const appointmentDate = dateTimeFromLocalParts(input.date, "00:00");
  const weekday = appointmentDate.getUTCDay();
  const startsAt = dateTimeFromLocalParts(input.date, input.time);
  const endsAt = addMinutes(startsAt, input.durationMinutes);

  const [allStaff, dayHours, dayExceptions, blockingBookings] = await Promise.all([
    listBookableStaff(),
    prisma.businessHour.findUnique({ where: { weekday } }),
    listAvailabilityExceptionsForDate(appointmentDate),
    prisma.booking.findMany({
      where: {
        status: { in: blockingBookingStatuses },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { startsAt: true, endsAt: true, assignedStaffId: true },
    }),
  ]);
  const staff = filterStaffForService(allStaff, input.serviceId);
  const mainStaffId = getMainStaffId(allStaff);

  const isBlockedDay = dayExceptions.some((exception) => exceptionBlocksSalon(exception, input.time, input.durationMinutes));
  const specialOpenings = dayExceptions.filter((exception) => exception.type === "SPECIAL_OPEN" && exception.startsAt && !exception.staffId);
  const baseSlots = dayHours?.active && !isBlockedDay ? (dayHours.slotTimes.length > 0 ? dayHours.slotTimes : publicSlotTimes) : [];
  const specialSlots = specialOpenings.map((exception) => exception.startsAt).filter(Boolean) as string[];
  const availableSlots = new Set([...baseSlots, ...specialSlots]);
  const isValidSalonSlot = availableSlots.has(input.time)
    && slotFitsWindow({
      slot: input.time,
      durationMinutes: input.durationMinutes,
      dayHours,
      specialOpenings,
    });

  if (!isValidSalonSlot) {
    return { staff: serializePublicStaff(staff, mainStaffId), availableStaff: [] };
  }

  return {
    staff: serializePublicStaff(staff, mainStaffId),
    availableStaff: serializePublicStaff(
      staff.filter((member) => (
        !dayExceptions.some((exception) => exceptionBlocksStaff(exception, member.id, input.time, input.durationMinutes))
        && !blockingBookings.some((booking) => bookingBlocksStaff(booking, member.id, mainStaffId, startsAt, endsAt))
      )),
      mainStaffId,
    ),
  };
}

export async function getAvailability(days = 7, durationMinutes = 0, serviceId?: string | null) {
  const dateOptions = nextDateOptions(days);
  const keys = dateOptions.map((date) => date.date);
  const start = dateTimeFromLocalParts(keys[0], "00:00");
  const end = dateTimeFromLocalParts(keys[keys.length - 1], "23:59");

  const [allStaff, businessHours, exceptions, blockingBookings] = await Promise.all([
    listBookableStaff(),
    prisma.businessHour.findMany({ where: { weekday: { in: dateOptions.map((date) => date.weekday) } } }),
    listAvailabilityExceptionsForRange(start, end),
    prisma.booking.findMany({
      where: {
        status: { in: blockingBookingStatuses },
        startsAt: { gte: start, lte: end },
      },
      select: { startsAt: true, endsAt: true, assignedStaffId: true },
    }),
  ]);
  const staff = filterStaffForService(allStaff, serviceId);
  const mainStaffId = getMainStaffId(allStaff);

  const hoursByWeekday = new Map(businessHours.map((hour) => [hour.weekday, hour]));
  const exceptionsByDate = new Map<string, typeof exceptions>();
  for (const exception of exceptions) {
    const key = dateKey(exception.date);
    exceptionsByDate.set(key, [...(exceptionsByDate.get(key) ?? []), exception]);
  }

  const daysPayload = dateOptions.map((date) => {
    const dayHours = hoursByWeekday.get(date.weekday);
    const dayExceptions = exceptionsByDate.get(date.date) ?? [];
    const globalDayBlocks = dayExceptions.filter((exception) => exception.type === "BLOCKED" && !exception.staffId);
    const specialOpen = dayExceptions.filter((exception) => exception.type === "SPECIAL_OPEN" && exception.startsAt && !exception.staffId);
    const isBlockedDay = globalDayBlocks.some((exception) => !exception.startsAt);
    const baseSlots = dayHours?.active && !isBlockedDay ? (dayHours.slotTimes.length > 0 ? dayHours.slotTimes : publicSlotTimes) : [];
    const specialSlots = specialOpen.map((exception) => exception.startsAt).filter(Boolean) as string[];

    const allSlots = Array.from(new Set([...publicSlotTimes, ...baseSlots, ...specialSlots])).sort();
    const salonSlots = Array.from(new Set([...baseSlots, ...specialSlots]))
      .filter((slot) => !globalDayBlocks.some((exception) => exceptionBlocksSalon(exception, slot, durationMinutes)))
      .filter((slot) => slotFitsWindow({
        slot,
        durationMinutes,
        dayHours,
        specialOpenings: specialOpen,
      }))
      .sort();
    const availableStaffBySlot: Record<string, string[]> = {};
    const staffSlots: Record<string, string[]> = {};
    const staffBookedSlots: Record<string, string[]> = {};

    for (const member of staff) {
      staffSlots[member.id] = [];
      staffBookedSlots[member.id] = [];
    }

    for (const slot of salonSlots) {
      const slotStart = dateTimeFromLocalParts(date.date, slot);
      const slotEnd = addMinutes(slotStart, durationMinutes);

      for (const member of staff) {
        const isBooked = dayExceptions.some((exception) => exceptionBlocksStaff(exception, member.id, slot, durationMinutes))
          || blockingBookings.some((booking) => bookingBlocksStaff(booking, member.id, mainStaffId, slotStart, slotEnd));
        if (isBooked) {
          staffBookedSlots[member.id]?.push(slot);
        } else {
          staffSlots[member.id]?.push(slot);
          availableStaffBySlot[slot] = [...(availableStaffBySlot[slot] ?? []), member.id];
        }
      }
    }

    const slots = salonSlots.filter((slot) => (availableStaffBySlot[slot]?.length ?? 0) > 0);
    const bookedSlots = mainStaffId ? (staffBookedSlots[mainStaffId] ?? []) : [];

    return {
      label: date.label,
      date: date.date,
      allSlots,
      slots,
      bookedSlots,
      staffSlots,
      staffBookedSlots,
      availableStaffBySlot,
    };
  });

  return {
    staff: serializePublicStaff(staff, mainStaffId),
    days: daysPayload,
  };
}

export async function getAdminAvailability() {
  const [businessHours, exceptions, staff] = await Promise.all([
    prisma.businessHour.findMany({ orderBy: { weekday: "asc" } }),
    listAdminAvailabilityExceptions(),
    prisma.user.findMany({
      where: { role: { in: publicStaffRoles } },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const staffById = new Map(staff.map((member) => [member.id, member]));

  return {
    businessHours,
    exceptions: exceptions.map((exception) => ({
      ...exception,
      staff: exception.staffId ? (staffById.get(exception.staffId) ?? null) : null,
    })),
  };
}

export async function updateAvailability(input: {
  businessHours?: Array<{
    weekday: number;
    opensAt: string;
    closesAt: string;
    slotTimes: string[];
    active: boolean;
  }>;
  exception?: {
    id?: string;
    date: string;
    staffId?: string | null;
    type: "BLOCKED" | "SPECIAL_OPEN";
    startsAt?: string | null;
    endsAt?: string | null;
    reason?: string | null;
  };
}) {
  return prisma.$transaction(async (tx) => {
    if (input.businessHours) {
      for (const hour of input.businessHours) {
        await tx.businessHour.upsert({
          where: { weekday: hour.weekday },
          create: hour,
          update: hour,
        });
      }
    }

    if (input.exception) {
      const exceptionDate = dateTimeFromLocalParts(input.exception.date, "00:00");
      const staffId = input.exception.staffId ?? null;
      const startsAt = input.exception.startsAt ?? null;
      const endsAt = input.exception.endsAt ?? null;
      const reason = input.exception.reason ?? null;

      if (input.exception.id) {
        await tx.$executeRaw`
          UPDATE "AvailabilityException"
          SET
            "date" = ${exceptionDate},
            "staffId" = ${staffId},
            "type" = ${input.exception.type}::"AvailabilityExceptionType",
            "startsAt" = ${startsAt},
            "endsAt" = ${endsAt},
            "reason" = ${reason},
            "updatedAt" = NOW()
          WHERE "id" = ${input.exception.id}
        `;
      } else {
        await tx.$executeRaw`
          INSERT INTO "AvailabilityException" (
            "id",
            "date",
            "staffId",
            "type",
            "startsAt",
            "endsAt",
            "reason",
            "createdAt",
            "updatedAt"
          )
          VALUES (
            ${randomUUID()},
            ${exceptionDate},
            ${staffId},
            ${input.exception.type}::"AvailabilityExceptionType",
            ${startsAt},
            ${endsAt},
            ${reason},
            NOW(),
            NOW()
          )
        `;
      }
    }

    return { ok: true };
  });
}

export async function deleteAvailabilityException(id: string) {
  await prisma.$executeRaw`
    DELETE FROM "AvailabilityException"
    WHERE "id" = ${id}
  `;
  return { ok: true };
}
