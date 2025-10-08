// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/session=([^;]+)/);
    if (match) {
      const raw = match[1];
      const tokenHash = sha256Hex(raw);

      // delete the session
      await prisma.session.deleteMany({ where: { tokenHash } });
    }

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
