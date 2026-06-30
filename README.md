# BriefBase

An AI-powered note-taking app that automatically generates summaries and tags for your notes using Anthropic Claude.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js · Express 5 · TypeScript |
| Frontend | Next.js 16 · TypeScript · TanStack React Query v5 |
| Database | PostgreSQL (Neon) · TypeORM 0.3 · Migrations |
| Auth | JWT · bcrypt |
| AI | Anthropic Claude (`claude-haiku-4-5`) |
| i18n | next-intl (TR / EN) |
| Containers | Docker · docker-compose |

---

## Features

- **Authentication** — Register and login with email/password; sessions managed via JWT
- **Notes** — Create, list, and delete personal notes
- **AI Summarization** — Each note gets a 2-sentence summary and 3–5 tags generated asynchronously by Claude
- **Tag Filtering** — Filter the note list by any AI-generated tag
- **Re-summarize** — Trigger a fresh AI pass on any existing note
- **Multi-language** — Full TR / EN support via next-intl; language preference persists in localStorage

---

## Local Setup

### Backend

```bash
cd backend
npm install
cp ../.env.example .env    # veya elle oluştur (aşağıdaki tabloya bak)
npm run dev                # ts-node-dev, port 4000
```

Migration'ları çalıştırmak için (ilk kurulumda):

```bash
npm run migration:run
```

### Frontend

```bash
cd frontend
npm install
# .env.local oluştur (aşağıdaki tabloya bak)
npm run dev                # Next.js, port 3000
```

### Environment Variables

**`backend/.env`**

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `DATABASE_SSL` | Enable SSL for Neon | `true` |
| `JWT_SECRET` | Secret used to sign tokens | `change-me-32-chars-minimum` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-api03-...` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `PORT` | HTTP port | `4000` |

**`frontend/.env.local`**

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:4000` |

---

## Docker

```bash
docker compose up -d
```

Migration'ları Docker üzerinden çalıştırmak için:

```bash
docker compose run --rm backend node dist/scripts/run-migrations.js
```

> `docker compose up --build` komutu ile backend ve postgres servisleri sorunsuz ayağa kalkmaktadır. `/health` endpoint'i doğrulanmıştır. Local stack tam olarak test edilmiş ve çalışır durumdadır.

---

## Test Account

| Field | Value |
|---|---|
| Email | `railway-test@test.com` |
| Password | `123456` |

Bu hesap production Neon veritabanına kayıtlıdır. Hem Railway backend hem de local backend aynı veritabanını kullandığından her iki ortamda da geçerlidir.

---

## Deployment

| | URL |
|---|---|
| Frontend (Vercel) | https://efsora-briefcase.vercel.app |
| Backend (Railway) | https://laudable-quietude-production.up.railway.app |

---

## AI Provider

This project uses **Anthropic Claude** (`claude-haiku-4-5`) for note summarization and tag extraction. The model receives the raw note content and returns a structured JSON object containing a 2-sentence summary and 3–5 lowercase tags. A retry pass is triggered automatically if the first response cannot be parsed.

---

## Demo Video

https://www.loom.com/share/a9afed3eb99443a7b33fa5ada1201eb4

---

## Submission Checklist

- [x] User registration and login (email + password, bcrypt hashed)
- [x] JWT-based session management with protected API routes
- [x] Note creation with title (optional) and content
- [x] Note listing with descending chronological order
- [x] Note deletion
- [x] AI-generated 2-sentence summary per note (Anthropic Claude)
- [x] AI-generated 3–5 lowercase tags per note
- [x] Tag-based note filtering
- [x] Re-summarize endpoint (`POST /notes/:id/summarize`)
- [x] Multi-language UI: English and Turkish (next-intl)
- [x] Language preference persisted in localStorage
- [x] TypeORM schema managed via versioned migrations (no raw SQL)
- [x] Docker Compose local stack verified (`docker compose up --build`, `/health` confirmed)
- [x] Live deployment URL

---

## Project Structure

```
briefcase/
├── backend/
│   ├── src/
│   │   ├── entities/        # User, Note (TypeORM entities)
│   │   ├── migrations/      # Versioned DB migrations + runner
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── routes/          # auth.ts, notes.ts
│   │   ├── services/        # ai.ts (Anthropic integration)
│   │   ├── data-source.ts   # TypeORM DataSource config
│   │   └── index.ts         # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router ([locale] group)
│   │   ├── components/      # ui/, notes/, auth/, layout/
│   │   ├── hooks/           # useNotes, useCreateNote, useDeleteNote, useResummarize
│   │   ├── i18n/            # next-intl routing + request config
│   │   ├── lib/api/         # Typed API client (auth, notes)
│   │   └── types/           # Shared TypeScript types
│   ├── next.config.ts       # API rewrite → backend
│   └── package.json
├── docker-compose.yml
└── .env
```
