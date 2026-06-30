import { Router, Response } from "express"
import { AppDataSource } from "../data-source"
import { Note } from "../entities/Note"
import { authMiddleware, AuthRequest } from "../middleware/auth"
import { generateSummaryAndTags } from "../services/ai"

const router = Router()
router.use(authMiddleware)

const noteRepo = () => AppDataSource.getRepository(Note)

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(id: string): boolean {
  return UUID_PATTERN.test(id)
}

router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { tag } = req.query as { tag?: string }

  const qb = noteRepo()
    .createQueryBuilder("note")
    .where("note.user_id = :userId", { userId: req.userId })
    .orderBy("note.created_at", "DESC")

  if (tag) {
    qb.andWhere(":tag = ANY(note.tags)", { tag })
  }

  const notes = await qb.getMany()
  res.json(notes)
})

router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, content } = req.body as { title?: string; content: string }

  if (!content || content.trim().length === 0) {
    res.status(400).json({ error: "content is required" })
    return
  }

  if (content.trim().length > 20000) {
    res.status(400).json({ error: "content exceeds maximum length" })
    return
  }

  const note = noteRepo().create({
    title: title ?? null,
    content: content.trim(),
    user_id: req.userId!,
    summary: null,
    tags: [],
  })

  await noteRepo().save(note)

  generateSummaryAndTags(content)
    .then(async (result) => {
      if (result) {
        await noteRepo().update(note.id, { summary: result.summary, tags: result.tags })
      }
    })
    .catch(() => null)

  res.status(201).json(note)
})

router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const noteId = String(req.params.id)

  if (!isValidUuid(noteId)) {
    res.status(400).json({ error: "invalid note id" })
    return
  }

  const note = await noteRepo().findOne({
    where: { id: noteId, user_id: req.userId },
  })

  if (!note) {
    res.status(404).json({ error: "note not found" })
    return
  }

  await noteRepo().remove(note)
  res.status(204).send()
})

router.post("/:id/summarize", async (req: AuthRequest, res: Response): Promise<void> => {
  const noteId = String(req.params.id)

  if (!isValidUuid(noteId)) {
    res.status(400).json({ error: "invalid note id" })
    return
  }

  const note = await noteRepo().findOne({
    where: { id: noteId, user_id: req.userId },
  })

  if (!note) {
    res.status(404).json({ error: "note not found" })
    return
  }

  const result = await generateSummaryAndTags(note.content)

  if (!result) {
    res.status(502).json({ error: "AI summarization failed" })
    return
  }

  await noteRepo().update(noteId, { summary: result.summary, tags: result.tags })
  res.json({ ...note, summary: result.summary, tags: result.tags })
})

export default router