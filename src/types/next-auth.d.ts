import { DefaultSession } from "next-auth"

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: string
    voltPoints: number
    clearanceLevel: number
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string
    voltPoints: number
    clearanceLevel: number
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      voltPoints: number
      clearanceLevel: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    voltPoints: number
    clearanceLevel: number
  }
}
