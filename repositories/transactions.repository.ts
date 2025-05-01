import { prisma } from "@/lib/prisma";

export const transactionsRepository = {
  getAllByUserId: async (userId: number) => {
    return prisma.transactions.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
      take: 100,
    });
  },

  create: async (data: {
    user_id: number;
    date: string;
    desc: string;
    amount: number;
    type: number;
    cate: string;
    create_at: Date;
  }) => {
    return prisma.transactions.create({
      data: { ...data },
    });
  },

  update: async (
    id: number,
    data: {
      date: string;
      desc: string;
      amount: number;
      type: number;
      cate: string;
    }
  ) => {
    return prisma.transactions.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.transactions.delete({ where: { id } });
  },
};
