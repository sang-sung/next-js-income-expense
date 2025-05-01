import { UsersRepository } from "@/repositories/users.repository";
import { encryptData } from "@/services/securityService";
import { returnErr } from "@/services/api/errorHandler";

export async function updatePassword(user: string, password: string) {
  const userRecord = await UsersRepository.findByUser(user);

  if (!userRecord) {
    return {
      success: false,
      message: "ไม่พบผู้ใช้งาน",
      status: 404,
    };
  }

  const passwordHash = encryptData(password);

  try {
    await UsersRepository.updatePassword(user, passwordHash ?? "");
    return {
      success: true,
      message: "แก้ไขรหัสผ่านสำเร็จ",
      status: 200,
    };
  } catch (err) {
    return returnErr(err);
  }
}
