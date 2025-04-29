import db from "@/lib/db";
import { returnErr } from "@/service/errorHandler";
import { getUserFromToken } from "@/service/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user_id = getUserFromToken(req).userId;

  const [rows] = (await db.execute(
    "SELECT * FROM categories WHERE user_id = ?",
    [user_id]
  )) as unknown as [any[]];

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: NextRequest) {
  const user_id = getUserFromToken(req).userId;
  const body = await req.json();
  const { cate_name } = body;

  try {
    const [existing]: any = await db.execute(
      "SELECT * FROM categories WHERE user_id = ?",
      [user_id]
    );

    if (existing.length > 0) {
      await db.execute(
        "UPDATE categories SET cate_name = ? WHERE user_id = ?",
        [cate_name, user_id]
      );

      return NextResponse.json({
        success: true,
        message: "อัปเดตหมวดหมู่สำเร็จ",
      });
    } else {
      const [result]: any = await db.execute(
        "INSERT INTO categories (user_id, cate_name) VALUES (?, ?)",
        [user_id, cate_name]
      );

      return NextResponse.json({
        success: !!result,
        message: result ? "เพิ่มหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่ไม่สำเร็จ",
      });
    }
  } catch (err) {
    return returnErr(err);
  }
}
