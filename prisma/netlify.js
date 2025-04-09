import { PrismaClient } from '@prisma/client';

// This is needed because in development we load env multiple times 
// and this would create multiple connections with Prisma
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 