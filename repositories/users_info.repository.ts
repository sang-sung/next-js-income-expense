import { prisma } from "@/lib/prisma";

export const userInfoRepository = {
  findByUserId: async (userId: number) => {
    return await prisma.users_info.findUnique({
      where: { user_id: userId },
    });
  },

  create: async (userId: number, fname: string, lname: string, age: number, sex: string, address: string) => {
    return await prisma.users_info.create({
      data: {
        user_id: userId,
        fname,
        lname,
        age,
        sex,
        address,
      },
    });
  },

  update: async (userId: number, fname: string, lname: string, age: number, sex: string, address: string) => {
    return await prisma.users_info.update({
      where: { user_id: userId },
      data: {
        fname,
        lname,
        age,
        sex,
        address,
      },
    });
  },
};
