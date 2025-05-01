import {
  getAllUsers,
  createUser,
  updatePassword,
  deleteUser,
} from "@/services/api/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await getAllUsers();

  const { status, ...body } = result;

  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await createUser(body);
  const { status, ...bodyData } = result;

  return NextResponse.json(bodyData, { status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const result = await updatePassword(req, body);
  const { status, ...bodyData } = result;

  return NextResponse.json(bodyData, { status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const result = await deleteUser(body);
  const { status, ...bodyData } = result;

  return NextResponse.json(bodyData, { status });
}

// import db from "@/lib/db";
// import { returnErr } from "@/services/api/errorHandler";
// import { getUserFromToken } from "@/services/api/getUserFromToken";
// import { encryptData } from "@/services/securityService";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const [rows, fields] = await db.query(`SELECT * FROM users`);
//   return NextResponse.json({ success: true, data: rows });
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { user, password } = body;

//   const passwordHash = encryptData(password);
//   const [result] = await db.execute(
//     "INSERT INTO users (user, password_hash) VALUES (?, ?)",
//     [user, passwordHash]
//   );

//   return NextResponse.json({
//     success: true,
//     userId: (result as any).insertId,
//     message: "เพิ่ม user สำเร็จ",
//   });
// }

// export async function PUT(req: NextRequest) {
//   const body = await req.json();
//   const { password, password_old } = body;
//   const user = getUserFromToken(req).userName;

//   // ตรวจสอบผู้ใช้ในฐานข้อมูล
//   const [rows] = (await db.execute("SELECT * FROM users WHERE user = ?", [
//     user,
//   ])) as unknown as [any[]];

//   const userRecord = rows[0];

//   if (!userRecord) {
//     return NextResponse.json(
//       { success: false, message: "ไม่พบผู้ใช้งาน" },
//       { status: 404 }
//     );
//   }

//   const password_en = encryptData(password_old);
//   if (userRecord.password_hash !== password_en) {
//     return NextResponse.json(
//       { success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" },
//       { status: 401 }
//     );
//   }

//   const passwordHash = encryptData(password);

//   try {
//     const [result] = await db.execute(
//       "UPDATE users SET password_hash = ? WHERE user = ?",
//       [passwordHash, user]
//     );

//     return NextResponse.json({ success: true, message: "แก้ไขรหัสผ่านสำเร็จ" });
//   } catch (err) {
//     return returnErr(err);
//   }
// }

// export async function DELETE(req: NextRequest) {
//   const body = await req.json();
//   const { user } = body;

//   try {
//     const [result]: any = await db.execute("DELETE FROM users WHERE user = ?", [
//       user,
//     ]);

//     if (result.affectedRows > 0) {
//       return NextResponse.json({
//         success: true,
//         message: "ลบ user " + user + " สำเร็จ",
//       });
//     } else {
//       return NextResponse.json({
//         success: true,
//         message: "ไม่พบ user " + user,
//       });
//     }
//   } catch (err) {
//     return returnErr(err);
//   }
// }
