import "dotenv/config"
import express from "express"
import { prisma } from "./config/prisma.js"
import { cookbookRouter } from "./routes/catalog.route.js"
import { errorHandler } from "./middware/errorHandler.js"


const app = express()

//import routes
app.get("/", (req, res) => {
  res.json({ message: "cookbook API!" })
})

app.use("/allRecipe", cookbookRouter)




app.use(express.json())

const port = process.env.PORT || 4000

const server = app.listen(port, () => {
  console.log(`cookbook API listening on http://localhost:${port}`)
})


app.use(errorHandler)

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
})