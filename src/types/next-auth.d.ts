import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      voltPoints: number
      clearanceLevel: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    voltPoints: number
    clearanceLevel: number
  }
}
