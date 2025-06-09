import { PrismaClient } from "../generated/prisma/index.js";
import { hashPassword } from "../middlewares/auth.middlewares.js";

const globalForPrisma = globalThis;

const db = globalForPrisma.prisma || new PrismaClient()

db.$use(hashPassword)
if(process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = db;

export {db}