import { prisma } from "@/lib/prisma";

export const UsersRepository = {
  findAll: () => prisma.users.findMany(),

  findByUser: (user: string) => prisma.users.findUnique({ where: { user } }),

  create: (user: string, passwordHash: string) =>
    prisma.users.create({ data: { user, password_hash: passwordHash } }),

  updatePassword: (user: string, passwordHash: string) =>
    prisma.users.update({
      where: { user },
      data: { password_hash: passwordHash },
    }),

  deleteByUser: (user: string) => prisma.users.delete({ where: { user } }),
};
