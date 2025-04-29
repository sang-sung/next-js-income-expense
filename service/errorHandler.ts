import { NextResponse } from "next/server";

export function returnErr(err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาด",
        error: err.message,
      },
      { status: 500 }
    );
  }

  console.error("Unknown error:", err);
  return NextResponse.json(
    {
      success: false,
      message: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
    },
    { status: 500 }
  );
}
