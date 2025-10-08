// app/api/auth/reset/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createHash } from "crypto";
import { hash as argonHash } from "argon2";

function sha256Hex(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function passwordMeetsRules(pw: string) {
  // Keep it simple per your preference
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw)
  );
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }
    if (!passwordMeetsRules(password)) {
      return NextResponse.json({ error: "Password does not meet requirements" }, { status: 400 });
    }

    const tokenHash = sha256Hex(token);
    const row = await prisma.token.findFirst({
      where: {
        kind: "PASSWORD_RESET",
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!row) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
    }

    const newHash = await argonHash(password, { type: 2 }); // Argon2id
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: row.userId },
        data: { passwordHash: newHash, failedLoginCount: 0 },
      });
      // Invalidate all sessions for security (force re-login everywhere)
      await tx.session.deleteMany({ where: { userId: row.userId } });
      // Consume token
      await tx.token.delete({ where: { id: row.id } });
    });

    // Clear session cookie if present (optional)
    const res = NextResponse.json({ ok: true, message: "Password updated" });
    res.cookies.set({
      name: "session",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
