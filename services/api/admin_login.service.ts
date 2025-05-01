import { UsersAdminRepository } from "@/repositories/users_admin.repository";
import { encryptData } from "@/services/securityService";

export async function loginAdmin(user: string, password: string) {
  const userRecord = await UsersAdminRepository.findByUser(user);

  if (!userRecord) {
    return {
      success: false,
      message: "ไม่พบผู้ใช้งาน",
      status: 404,
    };
  }

  let password_en = "";
  if (password != "") {
    password_en = encryptData(password) ?? "";
  }
  if (userRecord.password_hash !== password_en) {
    return {
      success: false,
      message: "รหัสผ่านไม่ถูกต้อง",
      status: 401,
    };
  }

  const token = encryptData(
    JSON.stringify({
      admin: 1,
      userName: userRecord.user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    })
  );

  return {
    success: true,
    message: "เข้าสู่ระบบสำเร็จ",
    token,
    status: 200,
  };
}
