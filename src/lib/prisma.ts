import { PrismaClient } from "@/generated/prisma";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}
