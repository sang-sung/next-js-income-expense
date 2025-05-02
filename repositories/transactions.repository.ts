import { prisma } from "@/lib/prisma";

export const transactionsRepository = {
  getAllByUserId: async (
    userId: number,
    options?: {
      page?: number;
      itemPerPage?: number;
      date?: string;
      startDate?: string;
      endDate?: string;
      month?: number; // 1-12
      year?: number;
    }
  ) => {
    const { page, itemPerPage, date, startDate, endDate, month, year } =
      options || {};

    const where: any = {
      user_id: userId,
    };

    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 2);
      const end = new Date(year, month, 1);
      where.date = {
        gte: start.toISOString().split("T")[0],
        lte: end.toISOString().split("T")[0],
      };
    } else if (year) {
      const start = new Date(year, 0, 2);
      const end = new Date(year, 12, 1);
      where.date = {
        gte: start.toISOString().split("T")[0],
        lte: end.toISOString().split("T")[0],
      };
    }

    const take = itemPerPage ?? 100;
    const skip = page && itemPerPage ? (page - 1) * itemPerPage : undefined;

    return prisma.transactions.findMany({
      where,
      orderBy: { date: "desc" },
      take,
      skip,
    });
  },

  countByUserId: async (
    userId: number,
    options?: {
      date?: string;
      startDate?: string;
      endDate?: string;
      month?: number;
      year?: number;
    }
  ) => {
    const { date, startDate, endDate, month, year } = options || {};

    const where: any = {
      user_id: userId,
    };

    if (date) {
      where.date = date;
    } else if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 2);
      const end = new Date(year, month, 1);
      where.date = {
        gte: start.toISOString().split("T")[0],
        lte: end.toISOString().split("T")[0],
      };
    } else if (year) {
      const start = new Date(year, 0, 2);
      const end = new Date(year, 12, 1);
      where.date = {
        gte: start.toISOString().split("T")[0],
        lte: end.toISOString().split("T")[0],
      };
    }

    return prisma.transactions.count({ where });
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
