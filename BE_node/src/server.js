import "dotenv/config"
import express from "express"
import { connectDB, disconnectDB } from "./config/prisma.js"
import { catalogRouter } from "./routes/catalog.route.js"
import { healthRouter } from "./routes/health.route.js"
import { errorHandler, notFoundHandler, requestLogger, requestTimeout } from "./middware/errorHandler.js"
import { authRouter } from "./routes/auth.route.js"

const app = express()
const port = process.env.PORT || 4000

app.use(requestLogger)
app.use(requestTimeout())
app.use(express.json())
await connectDB()

// Routes
app.use("/", healthRouter)
app.use("/allRecipe", catalogRouter)

app.use("/auth", authRouter)


app.use(notFoundHandler)
app.use(errorHandler)


const server = app.listen(port, () => {
  console.log(`Cookbook API listening on http://localhost:${port}`)
})


process.on("SIGINT", async () => {
 
  server.close(async () => {
    await disconnectDB();
    process.exit(0)
  })
})


process.on("SIGTERM", async () => {
  server.close(async () => {
    await disconnectDB();
    process.exit(0)
  })
})
