import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

const services = [
  { name: "Hair Cut & Styling", priceCents: 250000, durationMinutes: 45, sortOrder: 1 },
  { name: "Bridal Dressing", priceCents: 1500000, durationMinutes: 180, sortOrder: 2 },
  { name: "Facial Treatment", priceCents: 350000, durationMinutes: 60, sortOrder: 3 },
  { name: "Nail Care", priceCents: 150000, durationMinutes: 30, sortOrder: 4 },
  { name: "Waxing & Threading", priceCents: 50000, durationMinutes: 20, sortOrder: 5 },
  { name: "Makeup", priceCents: 500000, durationMinutes: 90, sortOrder: 6 },
  { name: "Hair Coloring", priceCents: 400000, durationMinutes: 120, sortOrder: 7 },
  { name: "Tattoo Training", priceCents: 0, durationMinutes: 120, sortOrder: 8 },
];

const defaultSlotTimes = ["09:00", "10:00", "11:00", "11:30", "14:00", "15:00", "16:00", "16:30", "17:30"];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") },
      update: service,
      create: {
        id: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        ...service,
      },
    });
  }

  for (let weekday = 1; weekday <= 6; weekday += 1) {
    await prisma.businessHour.upsert({
      where: { weekday },
      update: { opensAt: "09:00", closesAt: "19:00", slotTimes: defaultSlotTimes, active: true },
      create: { weekday, opensAt: "09:00", closesAt: "19:00", slotTimes: defaultSlotTimes, active: true },
    });
  }

  await prisma.businessHour.upsert({
    where: { weekday: 0 },
    update: { opensAt: "09:00", closesAt: "19:00", slotTimes: [], active: false },
    create: { weekday: 0, opensAt: "09:00", closesAt: "19:00", slotTimes: [], active: false },
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
