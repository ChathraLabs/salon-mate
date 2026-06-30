import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db";
import { dateKey, dateTimeFromLocalParts, nextDateOptions } from "./time";

const publicSlotTimes = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export async function getAvailability(days = 7) {
  const dateOptions = nextDateOptions(days);
  const keys = dateOptions.map((date) => date.date);
  const start = dateTimeFromLocalParts(keys[0], "00:00");
  const end = dateTimeFromLocalParts(keys[keys.length - 1], "23:59");

  const [businessHours, exceptions, confirmedBookings] = await Promise.all([
    prisma.businessHour.findMany({ where: { weekday: { in: dateOptions.map((date) => date.weekday) } } }),
    prisma.availabilityException.findMany({
      where: { date: { gte: start, lte: end } },
    }),
    prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        startsAt: { gte: start, lte: end },
      },
      select: { startsAt: true },
    }),
  ]);

  const hoursByWeekday = new Map(businessHours.map((hour) => [hour.weekday, hour]));
  const exceptionsByDate = new Map<string, typeof exceptions>();
  for (const exception of exceptions) {
    const key = dateKey(exception.date);
    exceptionsByDate.set(key, [...(exceptionsByDate.get(key) ?? []), exception]);
  }

  const confirmedSlotKeys = new Set(
    confirmedBookings.map((booking) => {
      const date = dateKey(booking.startsAt);
      const time = booking.startsAt.toISOString().slice(11, 16);
      return `${date}:${time}`;
    }),
  );

  return dateOptions.map((date) => {
    const dayHours = hoursByWeekday.get(date.weekday);
    const dayExceptions = exceptionsByDate.get(date.date) ?? [];
    const isBlocked = dayExceptions.some((exception) => exception.type === "BLOCKED" && !exception.startsAt);
    const specialOpen = dayExceptions.filter((exception) => exception.type === "SPECIAL_OPEN" && exception.startsAt);
    const baseSlots = dayHours?.active && !isBlocked ? publicSlotTimes : [];
    const specialSlots = specialOpen.map((exception) => exception.startsAt).filter(Boolean) as string[];
    const blockedSlots = new Set(
      dayExceptions
        .filter((exception) => exception.type === "BLOCKED" && exception.startsAt)
        .map((exception) => exception.startsAt as string),
    );

    const allSlots = Array.from(new Set([...publicSlotTimes, ...specialSlots])).sort();
    const bookedSlots = allSlots.filter((slot) => confirmedSlotKeys.has(`${date.date}:${slot}`));
    const slots = Array.from(new Set([...baseSlots, ...specialSlots]))
      .filter((slot) => !blockedSlots.has(slot))
      .filter((slot) => !confirmedSlotKeys.has(`${date.date}:${slot}`))
      .sort();

    return {
      label: date.label,
      date: date.date,
      allSlots,
      slots,
      bookedSlots,
    };
  });
}

export async function getAdminAvailability() {
  const [businessHours, exceptions] = await Promise.all([
    prisma.businessHour.findMany({ orderBy: { weekday: "asc" } }),
    prisma.availabilityException.findMany({ orderBy: { date: "asc" }, take: 100 }),
  ]);

  return { businessHours, exceptions };
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
      const data = {
        date: dateTimeFromLocalParts(input.exception.date, "00:00"),
        type: input.exception.type,
        startsAt: input.exception.startsAt,
        endsAt: input.exception.endsAt,
        reason: input.exception.reason,
      } satisfies Prisma.AvailabilityExceptionUncheckedCreateInput;

      if (input.exception.id) {
        await tx.availabilityException.update({ where: { id: input.exception.id }, data });
      } else {
        await tx.availabilityException.create({ data });
      }
    }

    return { ok: true };
  });
}
