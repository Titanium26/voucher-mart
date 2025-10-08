// app/api/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await prisma.session.findFirst({
    where: { tokenHash: sha256Hex(session), expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (!row?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Return only safe fields
  return NextResponse.json({
    id: row.user.id,
    username: row.user.username,
    email: row.user.email,
  });
}

