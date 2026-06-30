import { PrismaClient, UserRole } from "@prisma/client";
import { salonServices } from "../src/app/config/services";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

const services = salonServices.map((service, index) => ({
  id: service.id,
  name: service.title,
  priceCents: service.basePrice * 100,
  durationMinutes: service.baseDuration,
  sortOrder: index + 1,
}));

const defaultSlotTimes = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

async function main() {
  const activeServiceIds = services.map((service) => service.id);

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { ...service, active: true },
      create: {
        ...service,
        active: true,
      },
    });
  }

  await prisma.service.updateMany({
    where: { id: { notIn: activeServiceIds } },
    data: { active: false },
  });

  for (let weekday = 0; weekday <= 6; weekday += 1) {
    await prisma.businessHour.upsert({
      where: { weekday },
      update: { opensAt: "08:00", closesAt: "22:00", slotTimes: defaultSlotTimes, active: true },
      create: { weekday, opensAt: "08:00", closesAt: "22:00", slotTimes: defaultSlotTimes, active: true },
    });
  }

  const users = [
    {
      name: "Salonmate Super Admin",
      email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "salonmate@gmail.com",
      password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? "sadmin12345",
      role: UserRole.SUPER_ADMIN,
    },
    {
      name: "Dimuthu Srinath Weerasinghe",
      email: process.env.SEED_OWNER_EMAIL ?? "srinathdimuthu@gmail.com",
      password: process.env.SEED_OWNER_PASSWORD ?? "admin12345",
      role: UserRole.OWNER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash: hashPassword(user.password),
        role: user.role,
        active: true,
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash: hashPassword(user.password),
        role: user.role,
        active: true,
      },
    });
  }

  await prisma.user.updateMany({
    where: { email: "owner@salonmate.local" },
    data: { active: false },
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
