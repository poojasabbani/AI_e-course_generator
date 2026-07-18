import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  StickyNote,
  Target,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";
import { ChatDrawer } from "@/components/chat/chat-drawer";

export const Route = createFileRoute("/courses/$courseId/lessons/$lessonId")({
  head: () => ({ meta: [{ title: "Lesson — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const { courseId, lessonId } = Route.useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const q = useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: () => api.getLesson(courseId, lessonId),
  });

  const flat = useMemo(() => {
    if (!q.data) return { list: [] as { id: string; title: string }[], index: -1 };
    const list = q.data.course.chapters
      .flatMap((c) => c.topics.flatMap((t) => t.lessons))
      .map((l) => ({ id: l.id, title: l.title }));
    return { list, index: list.findIndex((l) => l.id === lessonId) };
  }, [q.data, lessonId]);

  if (q.isLoading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!q.data) return <div className="p-10">Not found.</div>;
  const { course, chapter, lesson } = q.data;

  const prev = flat.index > 0 ? flat.list[flat.index - 1] : null;
  const next = flat.index >= 0 && flat.index < flat.list.length - 1 ? flat.list[flat.index + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[240px_1fr_300px] gap-8">
      <aside className="hidden lg:block sticky top-10 self-start">
        <Link
          to="/courses/$courseId"
          params={{ courseId: course.id }}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" /> {course.title}
        </Link>
        <div className="mt-4 space-y-1">
          {course.chapters.map((ch) => (
            <div key={ch.id}>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                {ch.title}
              </div>
              {ch.topics.flatMap((t) =>
                t.lessons.map((l) => (
                  <Link
                    key={l.id}
                    to="/courses/$courseId/lessons/$lessonId"
                    params={{ courseId: course.id, lessonId: l.id }}
                    className={`block truncate text-sm py-1 px-2 rounded-md ${
                      l.id === lesson.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.title}
                  </Link>
                )),
              )}
            </div>
          ))}
        </div>
      </aside>

      <article>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">
            Chapter · {chapter.title}
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">{lesson.title}</h1>
          <p className="mt-3 text-muted-foreground">{lesson.summary}</p>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          >
            <MessageSquare className="size-4" /> Ask about this
          </button>
          <button
            onClick={() => toast.success("Lesson marked complete")}
            className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          >
            <CheckCircle2 className="size-4" /> Mark complete
          </button>
        </div>

        <div className="mt-8 prose prose-invert prose-headings:font-display max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <Block icon={Lightbulb} title="Examples" tone="warning">
            <ul className="space-y-3 text-sm">
              {lesson.examples.map((e) => (
                <li key={e.title}>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-muted-foreground">{e.body}</div>
                </li>
              ))}
            </ul>
          </Block>
          <Block icon={StickyNote} title="Notes" tone="accent">
            <ul className="space-y-2 text-sm">
              {lesson.notes.map((n) => (
                <li key={n} className="text-muted-foreground">· {n}</li>
              ))}
            </ul>
          </Block>
        </div>

        <div className="mt-8 flex justify-between gap-3">
          {prev ? (
            <button
              onClick={() =>
                navigate({
                  to: "/courses/$courseId/lessons/$lessonId",
                  params: { courseId: course.id, lessonId: prev.id },
                })
              }
              className="glass inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
            >
              <ChevronLeft className="size-4" /> {prev.title}
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              onClick={() =>
                navigate({
                  to: "/courses/$courseId/lessons/$lessonId",
                  params: { courseId: course.id, lessonId: next.id },
                })
              }
              className="gradient-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground glow"
            >
              {next.title} <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </article>

      <aside className="hidden lg:block sticky top-10 self-start space-y-4">
        <div className="glass rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
            <Target className="size-3.5" /> Objectives
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {lesson.learning_objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Key takeaways
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {lesson.key_takeaways.map((k) => (
              <li key={k} className="flex gap-2">
                <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /> {k}
              </li>
            ))}
          </ul>
        </div>
        <Link
          to="/courses/$courseId/quiz/$quizId"
          params={{ courseId: course.id, quizId: `chap-${chapter.id}` }}
          className="gradient-primary flex items-center gap-2 rounded-xl p-4 text-sm font-semibold text-primary-foreground glow"
        >
          <Trophy className="size-4" /> Take chapter quiz
        </Link>
      </aside>

      <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} courseId={course.id} contextLabel={lesson.title} />
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  children,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  tone: "warning" | "accent";
}) {
  const toneClass = tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="glass rounded-xl p-5">
      <div className={`text-xs uppercase tracking-widest font-semibold flex items-center gap-2 ${toneClass}`}>
        <Icon className="size-3.5" /> {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
