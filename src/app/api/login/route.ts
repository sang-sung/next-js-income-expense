// src/app/api/auth/route.ts
import { loginUser } from "@/services/api/user_login.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user, password } = await req.json();
  const result = await loginUser(user, password);
  const { status, ...responseBody } = result;
  return NextResponse.json(responseBody, { status });
}

// import { encryptData } from "@/services/securityService";
// import db from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

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

//     // เปรียบเทียบรหัสผ่าน
//     const password_en = encryptData(password);
//     if (userRecord.password_hash !== password_en) {
//       return NextResponse.json(
//         { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
//         { status: 401 }
//       );
//     }

//     // สร้าง Token
//     const token = encryptData(
//       JSON.stringify({
//         userId: userRecord.user_id,
//         userName: userRecord.user,
//         exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60, // add 1 Hr
//       })
//     );

//     return NextResponse.json({
//       success: true,
//       token,
//       message: "เข้าสู่ระบบสำเร็จ",
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
