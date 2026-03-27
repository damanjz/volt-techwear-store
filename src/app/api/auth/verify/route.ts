import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return new NextResponse("Invalid verification link", { status: 400 });
    }

    const vt = await prisma.verificationToken.findFirst({
      where: { identifier: email, token }
    });

    if (!vt) {
      return new NextResponse("Verification link is invalid or has already been used.", { status: 400 });
    }

    if (vt.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token } }
      });
      return new NextResponse("Verification link expired. Please register again.", { status: 400 });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } }
    });

    // Redirect to login page with success flag
    return NextResponse.redirect(new URL("/membership?verified=1", req.url));
  } catch (err) {
    console.error("Verification error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
