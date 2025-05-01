import { CategoriesService } from "@/services/api/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const result = await CategoriesService.getAll(req);

  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

export async function POST(req: NextRequest) {
  const { cate_name } = await req.json();

  const result = await CategoriesService.upsertCategory(req, cate_name);
  const { status, ...responseBody } = result;

  return NextResponse.json(responseBody, { status });
}

// import db from "@/lib/db";
// import { returnErr } from "@/services/api/errorHandler";
// import { getUserFromToken } from "@/services/api/getUserFromToken";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const user_id = getUserFromToken(req).userId;

//   const [rows] = (await db.execute(
//     "SELECT * FROM categories WHERE user_id = ?",
//     [user_id]
//   )) as unknown as [any[]];

//   return NextResponse.json({ success: true, data: rows });
// }

// export async function POST(req: NextRequest) {
//   const user_id = getUserFromToken(req).userId;
//   const body = await req.json();
//   const { cate_name } = body;

//   try {
//     const [existing]: any = await db.execute(
//       "SELECT * FROM categories WHERE user_id = ?",
//       [user_id]
//     );

//     if (existing.length > 0) {
//       await db.execute(
//         "UPDATE categories SET cate_name = ? WHERE user_id = ?",
//         [cate_name, user_id]
//       );

//       return NextResponse.json({
//         success: true,
//         message: "อัปเดตหมวดหมู่สำเร็จ",
//       });
//     } else {
//       const [result]: any = await db.execute(
//         "INSERT INTO categories (user_id, cate_name) VALUES (?, ?)",
//         [user_id, cate_name]
//       );

//       return NextResponse.json({
//         success: !!result,
//         message: result ? "เพิ่มหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่ไม่สำเร็จ",
//       });
//     }
//   } catch (err) {
//     return returnErr(err);
//   }
// }
