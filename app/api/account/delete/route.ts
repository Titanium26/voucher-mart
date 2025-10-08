// app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto";
import { verifyPassword } from "@/lib/crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Identify current user from session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findFirst({
      where: { tokenHash: sha256Hex(sessionCookie), expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Re-authenticate
    const ok = await verifyPassword(session.user.passwordHash, password);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Soft delete: set status INACTIVE (and optionally track a deletedAt)
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.userId },
        data: { status: "INACTIVE" }, // you already have UserStatus enum
      });

      // Invalidate ALL sessions for this user (log out everywhere)
      await tx.session.deleteMany({ where: { userId: session.userId } });

      // Optional: clean any outstanding tokens
      await tx.token.deleteMany({ where: { userId: session.userId } });
    });

    // Clear cookie in browser
    const res = NextResponse.json({ ok: true });
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
