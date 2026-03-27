import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// NEXTAUTH_SECRET validation happens at runtime via NextAuth itself.
// In production, ensure NEXTAUTH_SECRET is set in your environment variables.

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: "Syndicate ID",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "operative@volt.sys" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Sanitize and validate email
        const email = credentials.email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL_LENGTH) {
          throw new Error("Invalid email format");
        }

        // Validate password length
        if (
          credentials.password.length < MIN_PASSWORD_LENGTH ||
          credentials.password.length > MAX_PASSWORD_LENGTH
        ) {
          throw new Error(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`);
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        // Removed auto-register to prevent unauthorized account creation
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Email not verified. Check server console for verification link.");
        }

        // Check if user is banned
        if (user.isBanned) {
          throw new Error("Account suspended. Contact support.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return user as NextAuthUser;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.voltPoints = user.voltPoints;
        token.clearanceLevel = user.clearanceLevel;
      }

      // Handle manual session updates by fetching truth from DB
      if (trigger === "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { voltPoints: true, clearanceLevel: true, role: true, isBanned: true }
          });
          
          if (dbUser) {
            token.voltPoints = dbUser.voltPoints;
            token.clearanceLevel = dbUser.clearanceLevel;
            token.role = dbUser.role;
            // Unset role if banned so session effectively dies or limits them
            if (dbUser.isBanned) token.role = "BANNED";
          }
        } catch (error) {
          console.error("JWT Update - Failed to fetch user from DB:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.voltPoints = token.voltPoints as number;
        session.user.clearanceLevel = token.clearanceLevel as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/membership',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
