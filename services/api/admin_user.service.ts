import { UsersAdminRepository } from "@/repositories/users_admin.repository";
import { encryptData } from "@/services/securityService";
import { getUserFromToken } from "@/services/api/getUserFromToken";
import { returnErr } from "@/services/api/errorHandler";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET: ดึงข้อมูลผู้ใช้ทั้งหมด
export async function getAllUsers() {
  const users = await UsersAdminRepository.findAll();
  return {
    success: true,
    data: users,
    status: 200,
  };
}

// ✅ POST: สร้างผู้ใช้ใหม่
export async function createUser(body: any) {
  const { user, password } = body;

  const existing = await UsersAdminRepository.findByUser(user);
  if (existing) {
    return {
      success: false,
      message: "มี user นี้แล้ว",
      status: 409,
    };
  }

  try {
    await UsersAdminRepository.create(user, encryptData(password) ?? "");
    return {
      success: true,
      message: "สร้าง user สำเร็จ",
      status: 200,
    };
  } catch (err) {
    return returnErr(err);
  }
}

// ✅ PUT: แก้ไขรหัสผ่าน
export async function updatePassword(req: NextRequest, body: any) {
  const { password, password_old } = body;
  const user = getUserFromToken(req).userName;

  const userRecord = await UsersAdminRepository.findByUser(user);
  if (!userRecord) {
    return {
      success: false,
      message: "ไม่พบผู้ใช้งาน",
      status: 404,
    };
  }

  const password_en = encryptData(password_old);
  if (userRecord.password_hash !== password_en) {
    return {
      success: false,
      message: "รหัสผ่านเดิมไม่ถูกต้อง",
      status: 401,
    };
  }

  try {
    await UsersAdminRepository.updatePassword(
      user,
      encryptData(password) ?? ""
    );
    return {
      success: true,
      message: "แก้ไขรหัสผ่านสำเร็จ",
      status: 200,
    };
  } catch (err) {
    return returnErr(err);
  }
}

// ✅ DELETE: ลบผู้ใช้
export async function deleteUser(body: any) {
  const { user } = body;

  try {
    const totalUsers = await UsersAdminRepository.countAll();
    if (totalUsers < 2) {
      return {
        success: false,
        message: `ต้องมีผู้ใช้อย่างน้อย 1 คนในระบบ`,
        status: 400,
      };
    }

    const deleted = await UsersAdminRepository.deleteByUser(user);

    if (deleted.count > 0) {
      return {
        success: true,
        message: `ลบ user ${user} สำเร็จ`,
        status: 200,
      };
    } else {
      return {
        success: false,
        message: `ไม่พบ user ${user}`,
        status: 404,
      };
    }
  } catch (err) {
    return returnErr(err);
  }
}
