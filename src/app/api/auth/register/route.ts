import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailSanitized = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(emailSanitized)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: emailSanitized } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user with unverified email
    await prisma.user.create({
      data: {
        email: emailSanitized,
        password: hashedPassword,
        name: emailSanitized.split('@')[0],
        voltPoints: 100,
        clearanceLevel: 1,
      }
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.verificationToken.create({
      data: {
        identifier: emailSanitized,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}&email=${encodeURIComponent(emailSanitized)}`;
    
    // Server console log simulates email delivery
    console.log(`\n\n[SECURITY] DEMO MODE: Email Verification Link for ${emailSanitized}:\n${verifyUrl}\n\n`);

    return NextResponse.json({ success: true, message: "Verification link dispatched. Check server console." });
  } catch (err: unknown) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
