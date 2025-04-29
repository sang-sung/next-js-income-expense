import { NextRequest, NextResponse } from "next/server";
import { decryptData } from "@/service/securityService";

export async function adminTokenMiddleware(req: NextRequest) {
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
    if (decoded.exp >= Math.floor(Date.now() / 1000) && decoded.admin == 1) {
      return NextResponse.next();
    } else {
      // return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.json(
        { success: false, message: "Invalid or expired admin token" },
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
