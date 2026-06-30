import { UserRole } from "@prisma/client";

export function canManageSalon(role: UserRole) {
  return role === UserRole.SUPER_ADMIN || role === UserRole.OWNER;
}
