import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
})

export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log("DB connected via Prisma")
  } catch (error) {
    console.error(`Database connection error: ${error.message}`)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  await prisma.$disconnect()
  console.log("DB disconnected")
}
