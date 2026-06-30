import "reflect-metadata"
import "dotenv/config"
import express from "express"
import cors from "cors"
import { AppDataSource } from "./data-source"
import authRoutes from "./routes/auth"
import notesRoutes from "./routes/notes"

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors({ origin: process.env.FRONTEND_URL ?? "*" }))
app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.use("/auth", authRoutes)
app.use("/notes", notesRoutes)

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations()
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err: Error) => {
    console.error("Startup failed:", err.message)
    process.exit(1)
  })