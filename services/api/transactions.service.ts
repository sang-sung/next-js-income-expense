import { transactionsRepository } from "@/repositories/transactions.repository";
import { returnErr } from "@/services/api/errorHandler";

export const transactionsService = {
  getAll: async (userId: number) => {
    try {
      const rows = await transactionsRepository.getAllByUserId(userId);
      //   const rowsWithLocalTime = rows.map((row: any) => ({
      //     ...row,
      //     date: new Date(row.date).toLocaleString("en-TH", {
      //       timeZone: "Asia/Bangkok",
      //     }),
      //   }));
      return { success: true, data: rows, status: 200 };
    } catch (err) {
      return returnErr(err);
    }
  },

  create: async (userId: number, body: any) => {
    try {
      const { date, desc, amount, type, cate } = body;
      const created = await transactionsRepository.create({
        user_id: userId,
        date,
        desc,
        amount,
        type,
        cate,
        create_at: new Date(),
      });

      return {
        success: !!created,
        message: created ? "เพิ่มรายการสำเร็จ" : "ไม่สามารถเพิ่มรายการได้",
        status: 200,
      };
    } catch (err) {
      return returnErr(err);
    }
  },

  update: async (id: number, body: any) => {
    try {
      const { date, desc, amount, type, cate } = body;
      const updated = await transactionsRepository.update(id, {
        date,
        desc,
        amount,
        type,
        cate,
      });

      return {
        success: !!updated,
        message: updated ? "อัพเดทรายการสำเร็จ" : "ไม่สามารถอัพเดทรายการได้",
        status: 200,
      };
    } catch (err) {
      return returnErr(err);
    }
  },

  delete: async (id: number) => {
    try {
      const deleted = await transactionsRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          message: "ไม่พบข้อมูลที่ต้องการลบ",
          status: 404,
        };
      }

      return {
        success: true,
        message: "ลบข้อมูลสำเร็จ",
        status: 200,
      };
    } catch (err) {
      return returnErr(err);
    }
  },
};
