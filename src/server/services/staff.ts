import { UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { hashPassword } from "@/server/auth/password";

export async function listStaff() {
  return prisma.user.findMany({
    where: { active: true, role: { in: [UserRole.OWNER, UserRole.STAFF] } },
    select: { id: true, name: true, email: true, role: true, active: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function upsertStaff(input: {
  id?: string;
  name: string;
  email: string;
  password?: string;
  active?: boolean;
}) {
  if (input.id) {
    return prisma.user.update({
      where: { id: input.id },
      data: {
        name: input.name,
        email: input.email,
        active: input.active,
        passwordHash: input.password ? hashPassword(input.password) : undefined,
      },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
  }

  if (!input.password) {
    throw new Error("Password is required for new staff.");
  }

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: UserRole.STAFF,
      active: input.active ?? true,
    },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
}
