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
}) {
  return {
    ...service,
    price: Math.round(service.priceCents / 100),
    duration: formatDuration(service.durationMinutes),
  };
}

export async function listPublicServices() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return services.map(serializeService);
}

export async function listAdminServices() {
  return prisma.service.findMany({
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
}) {
  if (input.id) {
    return prisma.service.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        durationMinutes: input.durationMinutes,
        active: input.active,
        sortOrder: input.sortOrder,
      },
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
    },
  });
}
