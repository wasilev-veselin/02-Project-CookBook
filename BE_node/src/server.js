import "dotenv/config"
import express from "express"
import { connectDB, disconnectDB } from "./config/prisma.js"
import { catalogRouter } from "./routes/catalog.route.js"
import { healthRouter } from "./routes/health.route.js"
import { errorHandler } from "./middware/errorHandler.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())


app.use("/", healthRouter)
app.use("/allRecipe", catalogRouter)

app.use(errorHandler)

await connectDB()

const server = app.listen(port, () => {
  console.log(`Cookbook API listening on http://localhost:${port}`)
})

process.on("SIGINT", async () => {
  await disconnectDB()
  server.close(() => process.exit(0))
})

process.on("SIGTERM", async () => {
  await disconnectDB()
  server.close(() => process.exit(0))
})
