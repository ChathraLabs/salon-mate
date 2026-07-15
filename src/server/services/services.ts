import { prisma } from "@/server/db";

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} hour${minutes === 60 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr ${minutes % 60} min`;
}

export function serializeService(service: {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  options?: Array<{ id: string; name: string; durationMinutes: number; priceCents: number }>;
}) {
  return {
    ...service,
    price: Math.round(service.priceCents / 100),
    duration: formatDuration(service.durationMinutes),
    options: service.options?.map((option) => ({ id: option.id, name: option.name, duration: option.durationMinutes, price: Math.round(option.priceCents / 100) })),
  };
}

export async function listPublicServices() {
  const services = await prisma.service.findMany({
    where: { active: true },
    include: { options: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return services.map(serializeService);
}

export async function listAdminServices() {
  return prisma.service.findMany({
    include: { options: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function upsertService(input: {
  id?: string;
  name: string;
  description?: string | null;
  priceCents: number;
  durationMinutes: number;
  active?: boolean;
  sortOrder?: number;
  options?: Array<{ id: string; name: string; durationMinutes: number; priceCents: number; sortOrder: number; active?: boolean }>;
}) {
  if (input.id) {
    return prisma.$transaction(async (tx) => {
      const service = await tx.service.update({ where: { id: input.id }, data: {
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        durationMinutes: input.durationMinutes,
        active: input.active,
        sortOrder: input.sortOrder,
      } });
      if (input.options) {
        await tx.serviceOption.deleteMany({ where: { serviceId: input.id } });
        if (input.options.length) await tx.serviceOption.createMany({ data: input.options.map((option) => ({ ...option, active: option.active ?? true, serviceId: input.id! })) });
      }
      return tx.service.findUniqueOrThrow({ where: { id: service.id }, include: { options: { orderBy: { sortOrder: "asc" } } } });
    });
  }

  return prisma.service.create({
    data: {
      name: input.name,
      description: input.description,
      priceCents: input.priceCents,
      durationMinutes: input.durationMinutes,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
      options: input.options?.length ? { create: input.options.map((option) => ({ id: option.id, name: option.name, durationMinutes: option.durationMinutes, priceCents: option.priceCents, sortOrder: option.sortOrder, active: option.active ?? true })) } : undefined,
    },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });
}
