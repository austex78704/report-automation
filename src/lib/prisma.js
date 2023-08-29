import { PrismaClient } from "@prisma/client";

const isDevelopmentEnv = process.env.NODE_ENV === "development";
const prisma = global.prisma || new PrismaClient();

if (isDevelopmentEnv) global.prisma = prisma;

export default prisma;
