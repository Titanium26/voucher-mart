// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, generateRawToken, sha256Hex } from "@/lib/crypto";

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Generic error helper
    const invalid = () =>
      NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return invalid();
    }

    // If too many recent failures, reject with generic message
    if (user.failedLoginCount >= MAX_FAILED) {
      // Optionally check lastFailedAt to implement time-based lockout. For simplicity we use count.
      return NextResponse.json(
        { error: "Too many failed attempts. Try again later." },
        { status: 429 }
      );
    }

    // Check verified/active
    if (user.status !== "ACTIVE" || !user.emailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) {
      // increment failed counter
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: { increment: 1 } },
      });
      return invalid();
    }

    // success: reset failedLoginCount and set lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lastLoginAt: new Date() },
    });

    // create session token
    const rawToken = generateRawToken(32);
    const tokenHash = sha256Hex(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // set cookie
    const res = NextResponse.json({ ok: true, message: "Logged in" });
    // cookie options: httpOnly, Secure in production, SameSite=Lax
    res.cookies.set({
      name: "session",
      value: rawToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
