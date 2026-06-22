import { z } from "zod";

export const publicBookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customer: z.object({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(7),
    email: z.string().trim().email().optional().or(z.literal("")),
  }),
  note: z.string().trim().max(1000).optional(),
});

export const adminBookingUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"]).optional(),
  assignedStaffId: z.string().min(1).nullable().optional(),
  adminNote: z.string().trim().max(1000).nullable().optional(),
});
