// app/api/auth/forgot/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "crypto";

function generateRawToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
function sha256Hex(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond OK to avoid user enumeration
    if (!user) return NextResponse.json({ ok: true, message: "If the email exists, a reset link was sent." });

    // create one-time reset token (30 min expiry)
    const raw = generateRawToken(32);
    const tokenHash = sha256Hex(raw);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // clean old reset tokens for this user
    await prisma.token.deleteMany({ where: { userId: user.id, kind: "PASSWORD_RESET" } });

    await prisma.token.create({
      data: { userId: user.id, kind: "PASSWORD_RESET", tokenHash, expiresAt },
    });

    const link = `${process.env.APP_URL}/reset/${raw}`;
    console.log("🔐 Password reset link:", link);

    return NextResponse.json({ ok: true, message: "If the email exists, a reset link was sent." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
