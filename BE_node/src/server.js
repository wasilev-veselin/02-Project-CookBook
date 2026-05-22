import "dotenv/config"
import express from "express"
// import { prisma } from "./config/prisma.js"

const port = process.env.PORT || 4000

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "cookbook API!" })
})

const server = app.listen(port, () => {
  console.log(`cookbook API listening on http://localhost:${port}`)
})

// process.on("SIGINT", async () => {
//   await prisma.$disconnect()
//   server.close(() => process.exit(0))
// })
