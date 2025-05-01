import { decryptData } from "@/services/securityService";
import { NextRequest } from "next/server";

export function getUserFromToken(req: NextRequest) {
  const token = req.headers.get("token")?.split(" ")[0];
  if (!token) throw new Error("Token not provided");

  const decoded = JSON.parse(decryptData(token) || "{}");

  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return decoded;
}
