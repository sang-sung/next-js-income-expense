import { updatePassword } from "@/services/api/admin_resetpass.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, password } = await req.json();

  const result = await updatePassword(user, password);
  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}
// import { encryptData } from "@/services/securityService";
// import db from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { returnErr } from "@/services/api/errorHandler";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (!body.user || !body.password) {
//       return NextResponse.json(
//         { success: false, message: "กรุณาระบุ user และ password" },
//         { status: 400 }
//       );
//     }

//     const { user, password } = body;

//     // ตรวจสอบผู้ใช้ในฐานข้อมูล
//     const [rows] = (await db.execute("SELECT * FROM users WHERE user = ?", [
//       user,
//     ])) as unknown as [any[]];

//     const userRecord = rows[0];

//     if (!userRecord) {
//       return NextResponse.json(
//         { success: false, message: "ไม่พบผู้ใช้งาน" },
//         { status: 404 }
//       );
//     }

//     const passwordHash = encryptData(password);

//     const [result] = await db.execute(
//       "UPDATE users SET password_hash = ? WHERE user = ?",
//       [passwordHash, user]
//     );

//     return NextResponse.json({ success: true, message: "แก้ไขรหัสผ่านสำเร็จ" });
//   } catch (err) {
//     return returnErr(err);
//   }
// }
