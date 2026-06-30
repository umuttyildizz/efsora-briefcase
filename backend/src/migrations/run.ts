import "reflect-metadata"
import "dotenv/config"
import { AppDataSource } from "../data-source"

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations()
    console.log("Migrations completed successfully")
    process.exit(0)
  })
  .catch((err: Error) => {
    console.error("Migration failed:", err.message)
    process.exit(1)
  })
