import { UsersRepository } from "@/repositories/users.repository";
import { encryptData } from "@/services/securityService";

export async function loginUser(user: string, password: string) {
  if (!user || !password) {
    return {
      success: false,
      message: "กรุณาระบุ user และ password",
      status: 400,
    };
  }

  const userRecord = await UsersRepository.findByUser(user);

  if (!userRecord) {
    return {
      success: false,
      message: "ไม่พบผู้ใช้งาน",
      status: 404,
    };
  }

  const password_en = encryptData(password);
  if (userRecord.password_hash !== password_en) {
    return {
      success: false,
      message: "รหัสผ่านไม่ถูกต้อง",
      status: 401,
    };
  }

  const token = encryptData(
    JSON.stringify({
      userId: userRecord.user_id,
      userName: userRecord.user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 ชั่วโมง
    })
  );

  return {
    success: true,
    token,
    message: "เข้าสู่ระบบสำเร็จ",
    status: 200,
  };
}
