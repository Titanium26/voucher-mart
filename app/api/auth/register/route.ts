// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/lib/validation";
import { hashPassword, generateRawToken, sha256Hex } from "@/lib/crypto";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user + token
    const { rawToken } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { username, email, passwordHash },
      });

      const rawToken = generateRawToken(32);
      await tx.token.create({
        data: {
          userId: user.id,
          kind: "EMAIL_VERIFY",
          tokenHash: sha256Hex(rawToken),
          expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 mins
        },
      });

      return { rawToken };
    });

    const verifyLink = `${process.env.APP_URL}/verify/${rawToken}`;
    await sendVerificationEmail(email, verifyLink);

    return NextResponse.json({ success: true, message: "Check your email to verify your account." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
