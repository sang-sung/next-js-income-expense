import { CategoriesRepository } from "@/repositories/categories.repository";
import { getUserFromToken } from "@/services/api/getUserFromToken";
import { NextRequest } from "next/server";

export const CategoriesService = {
  async getAll(req: NextRequest) {
    const user_id = getUserFromToken(req).userId;
    const data = await CategoriesRepository.findByUserId(user_id);

    return { success: true, data, status: 200 };
  },

  async upsertCategory(req: NextRequest, cate_name: string) {
    const user_id = getUserFromToken(req).userId;
    const existing = await CategoriesRepository.findByUserId(user_id);

    if (existing) {
      await CategoriesRepository.updateByUserId(user_id, cate_name);
      return {
        success: true,
        message: "อัปเดตหมวดหมู่สำเร็จ",
        status: 200,
      };
    } else {
      await CategoriesRepository.create(user_id, cate_name);
      return {
        success: true,
        message: "เพิ่มหมวดหมู่สำเร็จ",
        status: 201,
      };
    }
  },
};
