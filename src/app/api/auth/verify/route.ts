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

    await prisma.$transaction(async (tx) => {
      const deleted = await tx.verificationToken.deleteMany({
        where: {
          identifier: email,
          token,
          expires: { gt: new Date() },
        },
      });

      if (deleted.count === 0) {
        throw new Error("INVALID_OR_EXPIRED");
      }

      await tx.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });
    });

    return NextResponse.redirect(new URL("/membership?verified=1", req.url));
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_OR_EXPIRED") {
      return new NextResponse(
        "Verification link is invalid, expired, or has already been used.",
        { status: 400 }
      );
    }
    console.error("Verification error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
