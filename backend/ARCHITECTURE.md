# Coursefy — FastAPI Backend

# Backend Architecture

This document describes the backend architecture and planned API for Cousefy. The backend is built with FastAPI and Supabase, providing authentication, PDF upload, storage, and AI-powered course generation.
## Stack
- FastAPI + Uvicorn
- SQLAlchemy 2.x + Alembic
- Pydantic v2
- Supabase Postgres (with `pgvector`) + Supabase Storage + Supabase Auth (JWT)
- Groq (Llama 3.1 70B) — primary LLM
- LangChain — retrieval + chains
- PyMuPDF (`fitz`) — extraction
- ChromaDB *or* pgvector — vector store (recommend pgvector for one-DB simplicity)
- BAAI/bge-small-en — embeddings

## Layout

```
backend/
├── app/
│   ├── main.py                 # FastAPI app factory, CORS, routers
│   ├── core/
│   │   ├── config.py           # env, settings (pydantic-settings)
│   │   ├── security.py         # JWT verify (Supabase JWKS), password hashing
│   │   └── deps.py             # get_db, get_current_user
│   ├── db/
│   │   ├── base.py             # SQLAlchemy Base
│   │   ├── session.py          # engine + SessionLocal
│   │   └── migrations/         # alembic
│   ├── models/                 # SQLAlchemy ORM
│   │   ├── user.py
│   │   ├── course.py           # Course, Chapter, Topic, Lesson
│   │   ├── pdf.py              # UploadedPdf, PdfChunk
│   │   ├── quiz.py
│   │   ├── chat.py
│   │   └── progress.py
│   ├── schemas/                # Pydantic request/response
│   ├── api/                    # Routers
│   │   ├── auth.py             # /auth/*  (signup, signin, me)
│   │   ├── pdfs.py             # /pdfs/*  (upload, status, list)
│   │   ├── courses.py          # /courses/*
│   │   ├── lessons.py          # /courses/{id}/lessons/{id}, /progress
│   │   ├── quiz.py             # /courses/{id}/quiz/generate, /attempt
│   │   ├── chat.py             # /chat/{course_id}  (SSE stream)
│   │   ├── search.py           # /search  (hybrid)
│   │   ├── history.py          # /history
│   │   └── analytics.py        # /analytics
│   ├── services/               # Business logic (thin routers, thick services)
│   │   ├── ingest.py           # extract → chunk → embed → persist
│   │   ├── course_gen.py       # LLM course/lesson generation
│   │   ├── quiz_gen.py
│   │   ├── rag.py              # hybrid retrieval + answer
│   │   ├── search.py           # BM25 + vector fusion (RRF)
│   │   └── progress.py
│   ├── ai/
│   │   ├── groq_client.py      # Groq SDK wrapper (streaming)
│   │   ├── embeddings.py       # bge-small-en (sentence-transformers)
│   │   └── vector_store.py     # pgvector adapter
│   └── prompts/
│       ├── system.py           # base system prompt (anti-hallucination)
│       ├── course.py           # course skeleton prompt
│       ├── lesson.py           # per-lesson generation, structured JSON
│       ├── quiz.py             # MCQ/TF/short
│       └── chat.py             # RAG answer prompt (with citations)
├── tests/
├── alembic.ini
├── pyproject.toml              # or requirements.txt
├── .env.example
└── Dockerfile                  # for Render deployment
```

## Endpoints the frontend expects

Base URL: set in `src/lib/api-client.ts` (create when wiring):

| Method | Path                                        | Purpose |
|--------|---------------------------------------------|---------|
| POST   | `/auth/signup`                              | email/password → JWT |
| POST   | `/auth/signin`                              | email/password → JWT |
| GET    | `/auth/me`                                  | current user |
| POST   | `/pdfs/upload` (multipart)                  | upload PDF, kicks ingest, returns `{ pdf_id }` |
| GET    | `/pdfs`                                     | list user's PDFs + status |
| GET    | `/pdfs/{id}/status` (SSE)                   | live pipeline progress |
| GET    | `/courses`                                  | list |
| GET    | `/courses/{id}`                             | detail with chapters/topics/lessons |
| GET    | `/courses/{id}/lessons/{lesson_id}`         | single lesson |
| POST   | `/courses/{id}/lessons/{lesson_id}/complete` | mark done |
| POST   | `/courses/{id}/quiz/generate`               | `{ chapter_id?, difficulty }` → Quiz |
| POST   | `/quiz/{quiz_id}/attempt`                   | submit answers → graded |
| POST   | `/chat/{course_id}` (SSE)                   | streaming RAG answer |
| GET    | `/search?q=…`                               | hybrid results |
| GET    | `/history`                                  | timeline |
| GET    | `/analytics`                                | 14-day series + totals |

## Wiring frontend → backend

Once your API is live, create `src/lib/api-client.ts` and swap the
functions in `src/lib/mock-data.ts` for real `fetch` calls (attach the JWT
from `useAuth` as `Authorization: Bearer <token>`). Update `src/lib/auth.tsx`
to call `/auth/signin`, `/auth/signup`, `/auth/me`.

## Environment variables

```
DATABASE_URL=postgresql+psycopg://...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
GROQ_API_KEY=...
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
CORS_ORIGINS=https://your-frontend.lovable.app,http://localhost:5173
```

## Deployment

- Deploy to **Render** (free web service) or Fly.io.
- Frontend deployed via Lovable → `Publish` (one click).
- Set `VITE_API_BASE_URL` build secret pointing to your Render URL.
