import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "@/services/securityService";

export async function tokenMiddleware(req: NextRequest) {
  const token = req.headers.get("token")?.split(" ")[0];

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
    // return NextResponse.json(
    //   { success: false, message: "Token not provided" },
    //   { status: 401 }
    // );
  }

  try {
    const decoded = JSON.parse(decryptData(token) || "");
    if (decoded.exp >= Math.floor(Date.now() / 1000)) {
      return NextResponse.next();
    } else {
      // return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.json(
        { success: false, message: "Expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
    // return NextResponse.json(
    //   { success: false, message: "Invalid or expired token" },
    //   { status: 401 }
    // );
  }
}
