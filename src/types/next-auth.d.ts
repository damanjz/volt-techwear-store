declare module "next-auth/adapters" {
  interface AdapterUser {
    voltPoints: number
    clearanceLevel: number
  }
}

// Augment the generic Auth core types as well, just in case
declare module "@auth/core/adapters" {
  interface AdapterUser {
    voltPoints: number
    clearanceLevel: number
  }
}

// NextAuth v4 main augmentation
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
