// lib/auth.ts
import { prisma } from "./db";
import { sha256Hex } from "./crypto";

export async function getUserFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  const raw = match[1];
  const tokenHash = sha256Hex(raw);

  const session = await prisma.session.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (!session) return null;
  return session.user;
}
