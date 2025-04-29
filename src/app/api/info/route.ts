import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: "ทดสอบจร้า ไม่ต้องใช้ token" });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ data: "ทดสอบจร้า ต้องใช้ token" });
}
