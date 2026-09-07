import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET as string;

// Misma verificacion que /api/transactions: token en cookie httpOnly o Bearer.
export async function verifyRequest(req: NextRequest) {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("authToken")?.value;
  const header = req.headers.get("Authorization");
  const fromHeader =
    header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  const token = fromHeader || fromCookie;
  if (!token) return false;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
