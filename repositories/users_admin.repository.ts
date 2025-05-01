import { prisma } from "@/lib/prisma";

export const UsersAdminRepository = {
  findAll: () => prisma.users_admin.findMany(),

  findByUser: (user: string) =>
    prisma.users_admin.findUnique({ where: { user } }),

  create: (user: string, password_hash: string) =>
    prisma.users_admin.create({
      data: { user, password_hash },
    }),

  updatePassword: (user: string, password_hash: string) =>
    prisma.users_admin.update({
      where: { user },
      data: { password_hash },
    }),

  deleteByUser: (user: string) =>
    prisma.users_admin.deleteMany({ where: { user } }),

  countAll: () => prisma.users_admin.count(),
};
