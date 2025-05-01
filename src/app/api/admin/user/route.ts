import {
  getAllUsers,
  createUser,
  updatePassword,
  deleteUser,
} from "@/services/api/admin_user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await getAllUsers();

  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await createUser(body);
  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const result = await updatePassword(req, body);
  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const result = await deleteUser(body);
  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

// import db from "@/lib/db";
// import { returnErr } from "@/services/errorHandler";
// import { getUserFromToken } from "@/services/getUserFromToken";
// import { encryptData } from "@/services/securityService";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const [rows, fields] = await db.query(`SELECT * FROM users_admin`);
//   return NextResponse.json({ success: true, data: rows });
// }

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { user, password } = body;

//   const [rows] = (await db.execute("SELECT * FROM users_admin WHERE user = ?", [
//     user,
//   ])) as unknown as [any[]];

//   const userRecord = rows[0];

//   if (userRecord) {
//     return NextResponse.json(
//       { success: false, message: "มี user นี้แล้ว" },
//       { status: 404 }
//     );
//   }

//   const passwordHash = encryptData(password);

//   try {
//     const [result] = await db.execute(
//       "INSERT INTO users_admin (user, password_hash) VALUES (?, ?)",
//       [user, passwordHash]
//     );
//     return NextResponse.json({ success: true, message: "สร้าง user สำเร็จ" });
//   } catch (err) {
//     return returnErr(err);
//   }
// }

// export async function PUT(req: NextRequest) {
//   const body = await req.json();
//   const { password, password_old } = body;
//   const user = getUserFromToken(req).userName;

//   // ตรวจสอบผู้ใช้ในฐานข้อมูล
//   const [rows] = (await db.execute("SELECT * FROM users_admin WHERE user = ?", [
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
//       "UPDATE users_admin SET password_hash = ? WHERE user = ?",
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
//     const [countRows]: any = await db.execute(
//       "SELECT COUNT(*) as total FROM users_admin"
//     );
//     const totalUsers = countRows[0].total;

//     if (totalUsers < 2) {
//       return NextResponse.json({
//         success: false,
//         message: "ไม่สามารถลบได้ เนื่องจากต้องมีผู้ใช้อย่างน้อย 1 คนในระบบ",
//       });
//     }

//     // ถ้ามีผู้ใช้มากกว่า 1 คน → ลบได้
//     const [result]: any = await db.execute(
//       "DELETE FROM users_admin WHERE user = ?",
//       [user]
//     );

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
