import { adminTokenMiddleware } from "@/lib/middleware/adminTokenMiddleware";
import { tokenMiddleware } from "@/lib/middleware/tokenMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const excepRoutes = [
    { path: "/api/admin/login", method: "POST" },
    { path: "/api/login", method: "POST" },
    { path: "/api/info", method: "GET" },
  ];
  if (
    excepRoutes.some(
      (route) =>
        route.path === req.nextUrl.pathname && req.method === route.method
    )
  ) {
    return NextResponse.next();
  }
  
  const adminRoute = [
    { path: "/api/admin", method: "ALL" },
    { path: "/api/users", method: "GET" },
    { path: "/api/users", method: "POST" },
  ];
  if (
    adminRoute.some(
      (route) =>
        req.nextUrl.pathname.startsWith(route.path) &&
        (route.method === "ALL" || req.method === route.method)
    )
  ) {
    return adminTokenMiddleware(req);
  }

  return tokenMiddleware(req);
}

export const config = {
  matcher: "/api/:path*",
};
