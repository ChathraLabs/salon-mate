import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

const services = [
  { name: "Hair Cutting", priceCents: 250000, durationMinutes: 45, sortOrder: 1 },
  { name: "Hair Styling", priceCents: 250000, durationMinutes: 45, sortOrder: 2 },
  { name: "Manicure & Pedicure", priceCents: 150000, durationMinutes: 60, sortOrder: 3 },
  { name: "Waxing & Threading", priceCents: 50000, durationMinutes: 20, sortOrder: 4 },
  { name: "Fire Cut & Dreadlocks", priceCents: 400000, durationMinutes: 120, sortOrder: 5 },
  { name: "Tattoo & Piercing", priceCents: 0, durationMinutes: 60, sortOrder: 6 },
  { name: "Makeup", priceCents: 500000, durationMinutes: 90, sortOrder: 7 },
  { name: "Bridal Dressing", priceCents: 1500000, durationMinutes: 180, sortOrder: 8 },
  { name: "Groom Dressing", priceCents: 800000, durationMinutes: 120, sortOrder: 9 },
  { name: "Facial & Cleanup", priceCents: 350000, durationMinutes: 60, sortOrder: 10 },
];

const defaultSlotTimes = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

function serviceId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const activeServiceIds = services.map((service) => serviceId(service.name));

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: serviceId(service.name) },
      update: { ...service, active: true },
      create: {
        id: serviceId(service.name),
        ...service,
        active: true,
      },
    });
  }

  await prisma.service.updateMany({
    where: { id: { notIn: activeServiceIds } },
    data: { active: false },
  });

  for (let weekday = 1; weekday <= 6; weekday += 1) {
    await prisma.businessHour.upsert({
      where: { weekday },
      update: { opensAt: "08:00", closesAt: "22:00", slotTimes: defaultSlotTimes, active: true },
      create: { weekday, opensAt: "08:00", closesAt: "22:00", slotTimes: defaultSlotTimes, active: true },
    });
  }

  await prisma.businessHour.upsert({
    where: { weekday: 0 },
    update: { opensAt: "08:00", closesAt: "22:00", slotTimes: [], active: false },
    create: { weekday: 0, opensAt: "08:00", closesAt: "22:00", slotTimes: [], active: false },
  });

  const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@salonmate.local";
  const ownerPassword = process.env.SEED_OWNER_PASSWORD ?? "ChangeMe123!";

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { name: "Salon Owner", role: UserRole.OWNER, active: true },
    create: {
      name: "Salon Owner",
      email: ownerEmail,
      passwordHash: hashPassword(ownerPassword),
      role: UserRole.OWNER,
      active: true,
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
