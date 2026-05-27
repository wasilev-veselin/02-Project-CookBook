import "dotenv/config"
import cors from "cors"
import express from "express"
import { connectDB, disconnectDB } from "./config/prisma.js"
import { healthRouter } from "./routes/health.route.js"
import { errorHandler, notFoundHandler, requestLogger, requestTimeout } from "./middware/errorHandler.js"
import { authRouter } from "./routes/auth.route.js"
import { recipeRouter } from "./routes/recipe.route.js"
import { mealPlanRouter } from "./routes/mealPlan.route.js"
import { favoriteRouter } from "./routes/favorite.route.js"
import { commentRouter } from "./routes/comment.route.js"

const app = express()
const port = process.env.PORT || 4000
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]


app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
)
app.use(requestLogger)
app.use(requestTimeout())

app.use(express.json())

await connectDB()

// Routes
app.use("/", healthRouter)
app.use("/auth", authRouter)

app.use("/allRecipe", recipeRouter)
app.use("/mealPlan", mealPlanRouter)
app.use("/favorite", favoriteRouter)
app.use("/comment", commentRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`Cookbook API listening on http://localhost:${port}`)
})

let isShuttingDown = false

const shutdown = async (exitCode = 0) => {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true

  server.close(async () => {
    await disconnectDB()
    process.exit(exitCode)
  })
}

process.on("unhandledRejection", async (error) => {
  console.error("Unhandled Rejection:", error)
  await shutdown(1)
})

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error)
  await shutdown(1)
})

process.on("SIGINT", async () => {
  await shutdown(0)
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  await shutdown(0)
})
