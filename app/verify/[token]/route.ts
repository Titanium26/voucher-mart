// app/verify/[token]/route.ts
import { prisma } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const tokenHash = sha256Hex(params.token);

  const token = await prisma.token.findFirst({
    where: {
      kind: "EMAIL_VERIFY",
      tokenHash,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!token) {
    return NextResponse.redirect(`${process.env.APP_URL}/verify/invalid`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: token.userId },
      data: { emailVerified: new Date(), status: "ACTIVE" },
    });
    await tx.token.delete({ where: { id: token.id } });
  });

  return NextResponse.redirect(`${process.env.APP_URL}/verify/success`);
}
