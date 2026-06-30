import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"

const router = Router()
const userRepo = () => AppDataSource.getRepository(User)

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string }

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ error: "password must be at least 6 characters" })
    return
  }

  const existing = await userRepo().findOne({ where: { email } })
  if (existing) {
    res.status(409).json({ error: "email already in use" })
    return
  }

  const password_hash = await bcrypt.hash(password, 10)
  const user = userRepo().create({ email, password_hash })
  await userRepo().save(user)

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "10m" })
  res.status(201).json({ token, user: { id: user.id, email: user.email } })
})

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string }

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" })
    return
  }

  const user = await userRepo().findOne({ where: { email } })
  if (!user) {
    res.status(401).json({ error: "invalid credentials" })
    return
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    res.status(401).json({ error: "invalid credentials" })
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "10m" })
  res.json({ token, user: { id: user.id, email: user.email } })
})

export default router