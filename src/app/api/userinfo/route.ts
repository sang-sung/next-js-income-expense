import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/services/api/getUserFromToken";
import { userInfoService } from "@/services/api/users_info.service";

export async function GET(req: NextRequest) {
  const userId = getUserFromToken(req).userId;

  const result = await userInfoService.getUserInfo(userId);
  const { status, ...bodyData } = result;

  return NextResponse.json(bodyData, { status });
}

export async function POST(req: NextRequest) {
  const userId = getUserFromToken(req).userId;
  const body = await req.json();

  const result = await userInfoService.createOrUpdateUserInfo(userId, body);
  const { status, ...bodyData } = result;

  return NextResponse.json(bodyData, { status });
}

// import db from "@/lib/db";
// import { returnErr } from "@/services/api/errorHandler";
// import { getUserFromToken } from "@/services/api/getUserFromToken";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const user_id = getUserFromToken(req).userId;
//   const [rows, fields] = await db.query(
//     `SELECT * FROM user_info WHERE user_id = ?`,
//     [user_id]
//   );
//   return NextResponse.json({ success: true, data: rows });
// }

// export async function POST(req: NextRequest) {
//   const user_id = getUserFromToken(req).userId;
//   const body = await req.json();
//   const { fname, lname, age, sex, address } = body;

//   try {
//     const [existing]: any = await db.execute(
//       "SELECT * FROM user_info WHERE user_id = ?",
//       [user_id]
//     );

//     if (existing.length > 0) {
//       await db.execute(
//         `UPDATE user_info
//          SET fname = ?, lname = ?, age = ?, sex = ?, address = ?
//          WHERE user_id = ?`,
//         [fname, lname, age, sex, address, user_id]
//       );

//       return NextResponse.json({
//         success: true,
//         message: "อัปเดตข้อมูลสำเร็จ",
//       });
//     } else {
//       const [result]: any = await db.execute(
//         "INSERT INTO user_info (user_id, fname, lname, age, sex, address) VALUES (?, ?, ?, ?, ?, ?)",
//         [user_id, fname, lname, age, sex, address]
//       );

//       return NextResponse.json({
//         success: !!result,
//         message: result ? "เพิ่มข้อมูลสำเร็จ" : "เพิ่มข้อมูลไม่สำเร็จ",
//       });
//     }
//   } catch (err) {
//     return returnErr(err);
//   }
// }
