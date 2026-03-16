import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
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
          throw new Error("Invalid credentials");
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // For demo purposes, auto-register if the user doesn't exist
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.email.split('@')[0],
              voltPoints: 1500, // starting bonus
              clearanceLevel: 1
            }
          });
          return user;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.voltPoints = (user as any).voltPoints;
        token.clearanceLevel = (user as any).clearanceLevel;
      }
      
      // Handle manual session updates
      if (trigger === "update" && session) {
        token.voltPoints = session.voltPoints;
        token.clearanceLevel = session.clearanceLevel;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.voltPoints = token.voltPoints as number;
        session.user.clearanceLevel = token.clearanceLevel as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/membership',
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_volt_secret_key_123",
};
