import { UsersRepository } from "@/repositories/users.repository";
import { encryptData } from "@/services/securityService";
import { getUserFromToken } from "@/services/api/getUserFromToken";
import { returnErr } from "@/services/api/errorHandler";
import { NextRequest } from "next/server";

export const getAllUsers = async () => ({
  success: true,
  data: await UsersRepository.findAll(),
  status: 200,
});

export const createUser = async (body: any) => {
  const { user, password } = body;
  const existing = await UsersRepository.findByUser(user);
  if (existing)
    return { success: false, message: "มี user นี้แล้ว", status: 409 };

  try {
    const passwordHash = encryptData(password) ?? "";
    const newUser = await UsersRepository.create(user, passwordHash);
    return {
      success: true,
      userId: newUser.user_id,
      message: "เพิ่ม user สำเร็จ",
      status: 200,
    };
  } catch (err) {
    return returnErr(err);
  }
};

export const updatePassword = async (req: NextRequest, body: any) => {
  const { password, password_old } = body;
  const user = getUserFromToken(req).userName;

  const userRecord = await UsersRepository.findByUser(user);
  if (!userRecord)
    return { success: false, message: "ไม่พบผู้ใช้งาน", status: 404 };

  const password_en = encryptData(password_old);
  if (userRecord.password_hash !== password_en)
    return { success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง", status: 401 };

  try {
    await UsersRepository.updatePassword(user, encryptData(password) ?? "");
    return { success: true, message: "แก้ไขรหัสผ่านสำเร็จ", status: 200 };
  } catch (err) {
    return returnErr(err);
  }
};

export const deleteUser = async (body: any) => {
  const { user } = body;
  try {
    const existing = await UsersRepository.findByUser(user);
    if (!existing)
      return { success: false, message: "ไม่พบ user " + user, status: 404 };

    await UsersRepository.deleteByUser(user);
    return {
      success: true,
      message: "ลบ user " + user + " สำเร็จ",
      status: 200,
    };
  } catch (err) {
    return returnErr(err);
  }
};
