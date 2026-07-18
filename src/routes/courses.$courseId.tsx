import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ChevronRight, Clock, MessageSquare, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";

export const Route = createFileRoute("/courses/$courseId")({
  head: () => ({ meta: [{ title: "Course — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const { courseId } = Route.useParams();
  const q = useQuery({ queryKey: ["course", courseId], queryFn: () => api.getCourse(courseId) });
  const course = q.data;

  if (q.isLoading) return <div className="p-10 text-muted-foreground">Loading course…</div>;
  if (!course) return <div className="p-10">Course not found.</div>;

  const firstLesson = course.chapters[0]?.topics[0]?.lessons[0];

  return (
    <div>
      <div className="relative h-56 md:h-72" style={{ background: course.cover_gradient }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 h-full flex items-end pb-8 relative">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/90 font-semibold">
              {course.difficulty} · {course.pdf_filename}
            </div>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold text-white max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 -mt-4">
        <p className="text-muted-foreground max-w-3xl">{course.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {firstLesson && (
            <Link
              to="/courses/$courseId/lessons/$lessonId"
              params={{ courseId: course.id, lessonId: firstLesson.id }}
              className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow"
            >
              Continue learning <ChevronRight className="size-4" />
            </Link>
          )}
          <Link
            to="/chat"
            search={{ course: course.id }}
            className="glass inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            <MessageSquare className="size-4" /> Ask the AI
          </Link>
          <Link
            to="/courses/$courseId/quiz/$quizId"
            params={{ courseId: course.id, quizId: "overview" }}
            className="glass inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            <Trophy className="size-4" /> Take quiz
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
            { label: "Progress", value: `${course.progress}%`, icon: CheckCircle2 },
            { label: "Duration", value: `${Math.round(course.estimated_minutes / 60)}h`, icon: Clock },
            { label: "Lessons", value: course.lessons_total, icon: BookOpen },
            { label: "Chapters", value: course.chapters.length, icon: Target },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                {s.label} <s.icon className="size-4" />
              </div>
              <div className="mt-1 font-display text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold">Curriculum</h2>
            <div className="mt-4 space-y-3">
              {course.chapters.map((ch) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Chapter {ch.order}</div>
                      <div className="font-display font-semibold">{ch.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ch.topics.reduce((s, t) => s + t.lessons.length, 0)} lessons
                    </div>
                  </div>
                  <div className="divide-y divide-border/50">
                    {ch.topics.flatMap((t) =>
                      t.lessons.map((l) => (
                        <Link
                          key={l.id}
                          to="/courses/$courseId/lessons/$lessonId"
                          params={{ courseId: course.id, lessonId: l.id }}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-accent/30 transition-colors"
                        >
                          <div
                            className={`size-5 rounded-full grid place-items-center text-[10px] shrink-0 ${
                              l.completed
                                ? "bg-success text-success-foreground"
                                : "border border-border text-muted-foreground"
                            }`}
                          >
                            {l.completed ? "✓" : ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{l.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{t.title}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{l.duration_min}m</div>
                        </Link>
                      )),
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Section title="Objectives">
              <ul className="space-y-2 text-sm">
                {course.objectives.map((o) => (
                  <li key={o} className="flex gap-2">
                    <Target className="size-4 text-primary shrink-0 mt-0.5" /> {o}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Prerequisites">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {course.prerequisites.map((p) => <li key={p}>· {p}</li>)}
              </ul>
            </Section>
            <Section title="Key takeaways">
              <ul className="space-y-2 text-sm">
                {course.key_takeaways.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> {k}
                  </li>
                ))}
              </ul>
            </Section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
