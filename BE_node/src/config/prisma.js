import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { logger } from "../utils/logger.js"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
})

export const connectDB = async () => {
  try {
    await prisma.$connect()
    logger.info("DB connected via Prisma")
  } catch (error) {
    logger.error("Database connection error", {
      message: error.message,
    })
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  await prisma.$disconnect()
  logger.info("DB disconnected")
}
