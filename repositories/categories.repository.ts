import { prisma } from "@/lib/prisma";

export const CategoriesRepository = {
  findByUserId: (user_id: number) => {
    return prisma.categories.findFirst({
      where: { user_id },
    });
  },

  updateByUserId: (user_id: number, cate_name: string) => {
    return prisma.categories.updateMany({
      where: { user_id },
      data: { cate_name },
    });
  },

  create: (user_id: number, cate_name: string) => {
    return prisma.categories.create({
      data: { user_id, cate_name },
    });
  },

  deleteByUserId: (user_id: number) => {
    return prisma.categories.delete({
      where: { user_id },
    });
  },
};
