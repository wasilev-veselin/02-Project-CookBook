import "dotenv/config"
import express from "express"
import { prisma } from "./config/prisma.js"
import { catalogRouter } from "./routes/catalog.route.js"
import { healthRouter } from "./routes/health.route.js"
import { errorHandler } from "./middware/errorHandler.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())


app.use("/", healthRouter)
app.use("/allRecipe", catalogRouter)

app.use(errorHandler)

const server = app.listen(port, () => {
  console.log(`cookbook API listening on http://localhost:${port}`)
})

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
})
