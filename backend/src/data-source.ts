import "reflect-metadata"
import "dotenv/config"
import { DataSource } from "typeorm"
import { User } from "./entities/User"
import { Note } from "./entities/Note"

const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl,
  entities: [User, Note],
  migrations: [
    process.env.NODE_ENV === "production"
      ? "dist/migrations/*.js"
      : "src/migrations/*.ts",
  ],
  synchronize: false,
  logging: false,
})