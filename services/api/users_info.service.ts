import { userInfoRepository } from "@/repositories/users_info.repository";

export const userInfoService = {
  getUserInfo: async (userId: number) => {
    const userInfo = await userInfoRepository.findByUserId(userId);
    return userInfo
      ? { success: true, data: userInfo }
      : { success: false, message: "ไม่พบข้อมูลผู้ใช้", status: 404 };
  },

  createOrUpdateUserInfo: async (userId: number, body: any) => {
    const { fname, lname, age, sex, address } = body;

    try {
      const existingUserInfo = await userInfoRepository.findByUserId(userId);

      if (existingUserInfo) {
        // Update
        await userInfoRepository.update(
          userId,
          fname,
          lname,
          age,
          sex,
          address
        );
        return { success: true, message: "อัปเดตข้อมูลสำเร็จ", status: 200 };
      } else {
        // Create
        await userInfoRepository.create(
          userId,
          fname,
          lname,
          age,
          sex,
          address
        );
        return { success: true, message: "เพิ่มข้อมูลสำเร็จ", status: 200 };
      }
    } catch (err) {
      return { success: false, message: "เกิดข้อผิดพลาด", status: 500 };
    }
  },
};
