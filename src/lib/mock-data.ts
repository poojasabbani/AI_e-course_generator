// Mock data layer — swap for real API calls once FastAPI backend is wired.
// Every function returns a Promise so the components already look/feel async.

export type PdfStatus =
  | "queued"
  | "extracting"
  | "chunking"
  | "embedding"
  | "generating"
  | "ready"
  | "failed";

export interface UploadedPdf {
  id: string;
  filename: string;
  size_bytes: number;
  page_count: number;
  status: PdfStatus;
  created_at: string;
  course_id?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration_min: number;
  content_md: string;
  summary: string;
  learning_objectives: string[];
  key_takeaways: string[];
  examples: { title: string; body: string }[];
  notes: string[];
  completed?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  summary: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_minutes: number;
  prerequisites: string[];
  objectives: string[];
  key_takeaways: string[];
  cover_gradient: string;
  chapters: Chapter[];
  progress: number;
  lessons_total: number;
  lessons_done: number;
  created_at: string;
  pdf_filename: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "tf" | "short";
  prompt: string;
  choices?: string[];
  answer: string | number;
  explanation: string;
  citation: string;
}

export interface Quiz {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { label: string; chapter: string; lesson: string }[];
  created_at: string;
}

export interface SearchResult {
  id: string;
  course_id: string;
  course_title: string;
  chapter: string;
  lesson: string;
  snippet: string;
  score: number;
  match_type: "semantic" | "keyword" | "hybrid";
}

export interface AnalyticsPoint {
  date: string;
  minutes: number;
  lessons: number;
}

const GRADIENTS = [
  "linear-gradient(135deg, oklch(0.55 0.22 285), oklch(0.6 0.2 320))",
  "linear-gradient(135deg, oklch(0.55 0.22 200), oklch(0.6 0.2 260))",
  "linear-gradient(135deg, oklch(0.6 0.2 155), oklch(0.6 0.2 200))",
  "linear-gradient(135deg, oklch(0.65 0.2 40), oklch(0.6 0.22 320))",
  "linear-gradient(135deg, oklch(0.55 0.22 320), oklch(0.6 0.2 20))",
];

function makeLesson(i: number, chapter: string, topic: string): Lesson {
  const done = Math.random() > 0.55;
  return {
    id: `lesson-${chapter}-${topic}-${i}`,
    title: [
      "Foundations and terminology",
      "Core patterns in practice",
      "Case study: production system",
      "Common pitfalls & how to avoid them",
      "Advanced techniques",
    ][i % 5],
    duration_min: 8 + ((i * 3) % 15),
    completed: done,
    summary:
      "A concise, grounded synthesis of this section of the source PDF, focused on the ideas that recur across chapters.",
    content_md: `## Overview

This lesson distills the key ideas from the source material into an accessible narrative. Each concept is grounded in the original PDF and cross-referenced against related chapters.

### Why this matters

Real-world systems fail at the boundaries. The author repeatedly returns to this idea: **complexity accumulates where responsibilities blur**. When a component owns two concerns, changes in one force changes in the other.

### Core ideas

1. **Separation of concerns** — each module owns a single reason to change.
2. **Explicit interfaces** — dependencies flow in one direction, always.
3. **Progressive disclosure** — surface simple defaults; expose power on demand.

> "The best architectures are boring in the middle and interesting at the edges." — Ch. 3

### A worked example

Consider a document ingestion pipeline. A naïve design couples extraction, chunking, and embedding into a single function. When the embedding model changes, every step re-runs. Split them:

\`\`\`ts
const chunks = chunk(await extract(pdf));
const vectors = await embed(chunks);
\`\`\`

Now each stage is cacheable, testable, and replaceable.

### Recap

- Complexity concentrates at boundaries — design them intentionally.
- Prefer composition over inheritance for evolving systems.
- Measure what changes; keep interfaces stable for what doesn't.
`,
    learning_objectives: [
      "Explain the core principle in your own words",
      "Identify the pattern in an existing codebase",
      "Apply the technique to a new problem",
    ],
    key_takeaways: [
      "Boundaries are the highest-leverage design decision",
      "Cacheable stages compound: small wins accumulate",
      "Complexity you can't see is complexity you can't fix",
    ],
    examples: [
      {
        title: "Refactoring a monolithic function",
        body: "Split the pipeline into extract → chunk → embed → persist, each with its own contract.",
      },
      {
        title: "Anti-pattern: shared mutable state",
        body: "Two modules writing to the same object couples their release cadence forever.",
      },
    ],
    notes: [
      "The author draws heavily from the 1994 GoF work but reframes it for distributed systems.",
      "Chapter 7 revisits this with a case study from a payments team.",
    ],
  };
}

function makeCourse(i: number): Course {
  const chapters: Chapter[] = Array.from({ length: 6 }, (_, c) => ({
    id: `ch-${i}-${c}`,
    order: c + 1,
    title: [
      "Foundations",
      "Core patterns",
      "System design",
      "Data & persistence",
      "Observability & ops",
      "Scaling & the future",
    ][c],
    summary: "A grounded synthesis of the chapter's key ideas, distilled from the source material.",
    topics: Array.from({ length: 2 }, (_, t) => ({
      id: `top-${i}-${c}-${t}`,
      title: ["Concepts", "Techniques"][t],
      summary: "Topic overview drawn directly from the PDF.",
      lessons: Array.from({ length: 3 }, (_, l) => makeLesson(l, `${c}`, `${t}`)),
    })),
  }));
  const allLessons = chapters.flatMap((c) => c.topics.flatMap((t) => t.lessons));
  const done = allLessons.filter((l) => l.completed).length;
  return {
    id: `course-${i}`,
    title: [
      "Designing Data-Intensive Applications",
      "The Pragmatic Programmer",
      "Building Microservices",
      "Deep Learning with Python",
      "System Design Interview",
      "Clean Architecture",
    ][i % 6],
    slug: `course-${i}`,
    description:
      "An AI-generated interactive course distilled from your uploaded PDF, structured into chapters, topics, and lessons with grounded explanations.",
    difficulty: (["beginner", "intermediate", "advanced"] as const)[i % 3],
    estimated_minutes: 240 + i * 20,
    prerequisites: ["Basic programming", "Familiarity with the domain"],
    objectives: [
      "Build a mental model for the entire book",
      "Apply the ideas to a real system",
      "Recognize the anti-patterns in your own code",
    ],
    key_takeaways: [
      "Boundaries dominate architecture decisions",
      "Data outlives code — model it carefully",
      "Simplicity is a feature, not an accident",
    ],
    cover_gradient: GRADIENTS[i % GRADIENTS.length],
    chapters,
    progress: Math.round((done / allLessons.length) * 100),
    lessons_total: allLessons.length,
    lessons_done: done,
    created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    pdf_filename: `book-${i + 1}.pdf`,
  };
}

const COURSES: Course[] = Array.from({ length: 6 }, (_, i) => makeCourse(i));

const PDFS: UploadedPdf[] = COURSES.map((c, i) => ({
  id: `pdf-${i}`,
  filename: c.pdf_filename,
  size_bytes: 2_400_000 + i * 500_000,
  page_count: 180 + i * 40,
  status: "ready" as PdfStatus,
  created_at: c.created_at,
  course_id: c.id,
}));

// --- API ---
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  async listCourses(): Promise<Course[]> {
    await delay(120);
    return COURSES;
  },
  async getCourse(id: string): Promise<Course | undefined> {
    await delay(80);
    return COURSES.find((c) => c.id === id);
  },
  async getLesson(courseId: string, lessonId: string) {
    await delay(80);
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return undefined;
    for (const ch of course.chapters) {
      for (const t of ch.topics) {
        const l = t.lessons.find((x) => x.id === lessonId);
        if (l) return { course, chapter: ch, topic: t, lesson: l };
      }
    }
    return undefined;
  },
  async listPdfs(): Promise<UploadedPdf[]> {
    await delay(100);
    return PDFS;
  },
  async listRecentActivity() {
    await delay(60);
    return COURSES.slice(0, 4).map((c, i) => ({
      id: `act-${i}`,
      type: (["lesson_completed", "quiz_passed", "course_generated", "chat_asked"] as const)[i % 4],
      course_title: c.title,
      detail: ["Finished lesson: Core patterns", "Passed quiz 4/5", "New course generated", "Asked 3 questions"][i % 4],
      time: `${i + 1}h ago`,
    }));
  },
  async getAnalytics(): Promise<AnalyticsPoint[]> {
    await delay(80);
    return Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(5, 10),
      minutes: 20 + Math.round(Math.random() * 80),
      lessons: 1 + Math.round(Math.random() * 4),
    }));
  },
  async getStats() {
    await delay(60);
    return {
      courses_generated: COURSES.length,
      lessons_completed: COURSES.reduce((s, c) => s + c.lessons_done, 0),
      minutes_studied: 1240,
      streak_days: 7,
      avg_quiz_score: 82,
    };
  },
  async generateQuiz(_courseId: string, _chapterId?: string): Promise<Quiz> {
    await delay(500);
    return {
      id: `quiz-${Date.now()}`,
      title: "Chapter checkpoint",
      difficulty: "medium",
      questions: [
        {
          id: "q1",
          type: "mcq",
          prompt: "What does the author identify as the highest-leverage design decision?",
          choices: [
            "Choice of programming language",
            "Boundaries between modules",
            "Team size and structure",
            "Deployment pipeline",
          ],
          answer: 1,
          explanation: "The author repeatedly returns to boundaries as the primary lever for managing complexity.",
          citation: "Ch. 2 · Foundations and terminology",
        },
        {
          id: "q2",
          type: "tf",
          prompt: "Cacheable pipeline stages compound over time.",
          answer: "true",
          explanation: "Small wins accumulate when each stage is independently cacheable.",
          citation: "Ch. 3 · Core patterns in practice",
        },
        {
          id: "q3",
          type: "short",
          prompt: "In one sentence, why does complexity concentrate at boundaries?",
          answer: "Because unclear ownership forces changes in one module to propagate to another.",
          explanation: "Blurred responsibilities are the source of most cross-cutting change.",
          citation: "Ch. 2 · Foundations and terminology",
        },
        {
          id: "q4",
          type: "mcq",
          prompt: "Which anti-pattern couples release cadence between modules?",
          choices: ["Shared mutable state", "Dependency injection", "Feature flags", "Structured logging"],
          answer: 0,
          explanation: "Two modules writing to the same object cannot be released independently.",
          citation: "Ch. 3 · Anti-patterns",
        },
      ],
    };
  },
  async chat(_courseId: string, question: string, history: ChatMessage[]): Promise<ChatMessage> {
    await delay(700);
    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      created_at: new Date().toISOString(),
      content: `Based on the source PDF: ${
        question.length > 30 ? question.slice(0, 30) + "…" : question
      }\n\nThe author addresses this directly in Chapter 3. The core idea is that boundaries between modules are where complexity concentrates — when responsibilities blur, small changes propagate widely. The recommended technique is to make each stage independently cacheable and testable.\n\n**In practice**, this means splitting your pipeline so each step owns a single concern.`,
      citations: [
        { label: "Ch.3 · L2", chapter: "Core patterns", lesson: "Core patterns in practice" },
        { label: "Ch.2 · L1", chapter: "Foundations", lesson: "Foundations and terminology" },
      ],
    };
  },
  async search(query: string): Promise<SearchResult[]> {
    await delay(180);
    if (!query.trim()) return [];
    return COURSES.slice(0, 4).flatMap((c, i) =>
      c.chapters.slice(0, 2).map((ch, j) => ({
        id: `sr-${i}-${j}`,
        course_id: c.id,
        course_title: c.title,
        chapter: ch.title,
        lesson: ch.topics[0].lessons[0].title,
        snippet: `…the author writes that <mark>${query}</mark> is best understood through the lens of boundaries and explicit interfaces, which recurs throughout ${ch.title}…`,
        score: 0.92 - i * 0.07 - j * 0.03,
        match_type: (["hybrid", "semantic", "keyword"] as const)[j % 3],
      })),
    );
  },
  async listHistory() {
    await delay(80);
    return Array.from({ length: 12 }, (_, i) => ({
      id: `h-${i}`,
      type: (["lesson", "quiz", "chat", "upload"] as const)[i % 4],
      title: [
        "Read: Core patterns in practice",
        "Quiz attempt · 4/5",
        "Asked: Why do boundaries matter?",
        "Uploaded: designing-data-intensive.pdf",
      ][i % 4],
      course_title: COURSES[i % COURSES.length].title,
      time: `${i + 1}h ago`,
    }));
  },
};
