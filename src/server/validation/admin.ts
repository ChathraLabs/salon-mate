import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const serviceSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  priceCents: z.number().int().min(0),
  durationMinutes: z.number().int().min(5),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const staffSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8).optional(),
  active: z.boolean().optional(),
});

export const availabilitySchema = z.object({
  businessHours: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        opensAt: z.string().regex(/^\d{2}:\d{2}$/),
        closesAt: z.string().regex(/^\d{2}:\d{2}$/),
        slotTimes: z.array(z.string().regex(/^\d{2}:\d{2}$/)),
        active: z.boolean(),
      }),
    )
    .optional(),
  exception: z
    .object({
      id: z.string().min(1).optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      staffId: z.string().min(1).optional().nullable(),
      type: z.enum(["BLOCKED", "SPECIAL_OPEN"]),
      startsAt: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
      endsAt: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
      reason: z.string().trim().optional().nullable(),
    })
    .optional(),
});
