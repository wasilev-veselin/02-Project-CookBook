import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { logger } from "../utils/logger.js"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({ connectionString })
const isDevelopment = process.env.NODE_ENV === "development"

const getPositiveNumberFromEnv = (name, fallbackValue) => {
  const parsedValue = Number(process.env[name])

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue
}

const slowQueryThresholdMs = getPositiveNumberFromEnv("SLOW_QUERY_THRESHOLD_MS", 200)

export const prisma = new PrismaClient({
  adapter,
  log: isDevelopment
    ? [{ emit: "event", level: "query" }, "info", "warn", "error"]
    : [{ emit: "event", level: "query" }, "warn", "error"],
})

prisma.$on("query", (event) => {
  if (event.duration < slowQueryThresholdMs) {
    return
  }

  logger.warn("Slow database query", {
    event: "SLOW_DATABASE_QUERY",
    durationMs: event.duration,
    thresholdMs: slowQueryThresholdMs,
    query: event.query,
    ...(isDevelopment && {
      params: event.params,
    }),
  })
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
