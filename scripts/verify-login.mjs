import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "lvl1@volt.sys" } });
  if (!user) {
    console.log("USER NOT FOUND");
    return;
  }
  
  console.log("User:", user.email, "| Verified:", user.emailVerified);
  console.log("Banned?:", user.isBanned);
  const isValid = await compare("password123", user.password);
  console.log("Password valid?:", isValid);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
