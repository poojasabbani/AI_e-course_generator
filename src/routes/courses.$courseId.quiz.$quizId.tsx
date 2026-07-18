import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Trophy, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api, type Quiz } from "@/lib/mock-data";

export const Route = createFileRoute("/courses/$courseId/quiz/$quizId")({
  head: () => ({ meta: [{ title: "Quiz — Coursefy" }] }),
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
  const quiz = useQuery({ queryKey: ["quiz", courseId], queryFn: () => api.generateQuiz(courseId) });

  if (quiz.isLoading || !quiz.data)
    return (
      <div className="mx-auto max-w-2xl p-10 text-center">
        <Loader2 className="size-6 mx-auto animate-spin text-primary" />
        <div className="mt-3 text-sm text-muted-foreground">Generating quiz from your PDF…</div>
      </div>
    );

  return <Runner quiz={quiz.data} courseId={courseId} />;
}

function Runner({ quiz, courseId }: { quiz: Quiz; courseId: string }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);

  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;

  function score() {
    let s = 0;
    for (const question of quiz.questions) {
      const a = answers[question.id];
      if (a === undefined) continue;
      if (question.type === "mcq" && a === question.answer) s++;
      else if (question.type === "tf" && String(a).toLowerCase() === String(question.answer).toLowerCase()) s++;
      else if (question.type === "short" && String(a).trim().length > 10) s++;
    }
    return s;
  }

  if (submitted) {
    const s = score();
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-8 text-center">
          <Trophy className="size-12 mx-auto text-warning" />
          <h1 className="mt-4 font-display text-3xl font-bold">You scored {s} / {total}</h1>
          <p className="mt-2 text-muted-foreground">
            {s === total ? "Perfect!" : s / total >= 0.7 ? "Nice work." : "Keep studying — review the citations below."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link
              to="/courses/$courseId"
              params={{ courseId }}
              className="glass rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              Back to course
            </Link>
            <button
              onClick={() => {
                setAnswers({});
                setIdx(0);
                setSubmitted(false);
              }}
              className="gradient-primary rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow"
            >
              Retake
            </button>
          </div>
        </motion.div>

        <div className="mt-8 space-y-4">
          {quiz.questions.map((question) => {
            const a = answers[question.id];
            const correct =
              (question.type === "mcq" && a === question.answer) ||
              (question.type === "tf" && String(a).toLowerCase() === String(question.answer).toLowerCase()) ||
              (question.type === "short" && String(a ?? "").trim().length > 10);
            return (
              <div key={question.id} className="glass rounded-xl p-5">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="size-5 text-success shrink-0" />
                  ) : (
                    <XCircle className="size-5 text-destructive shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{question.prompt}</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Explanation:</span> {question.explanation}
                    </div>
                    <div className="mt-2 text-xs font-mono text-primary">Source: {question.citation}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Question {idx + 1} of {total}</div>
        <div>{answered} answered</div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full gradient-primary transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-6 glass-strong rounded-2xl p-6"
        >
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">{q.type.toUpperCase()}</div>
          <h2 className="mt-2 font-display text-xl font-semibold">{q.prompt}</h2>
          <div className="mt-5 space-y-2">
            {q.type === "mcq" &&
              q.choices?.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className={`w-full text-left rounded-lg border p-3 text-sm transition-colors ${
                    answers[q.id] === i
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/50 hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            {q.type === "tf" &&
              ["true", "false"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  className={`w-full text-left rounded-lg border p-3 text-sm capitalize transition-colors ${
                    answers[q.id] === v
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/50 hover:bg-muted"
                  }`}
                >
                  {v}
                </button>
              ))}
            {q.type === "short" && (
              <textarea
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                rows={4}
                placeholder="Your answer…"
                className="w-full rounded-lg bg-muted border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="glass rounded-lg px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        {idx < total - 1 ? (
          <button
            onClick={() => setIdx((i) => i + 1)}
            className="gradient-primary rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground glow flex items-center gap-1"
          >
            Next <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            className="gradient-primary rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground glow"
          >
            Submit quiz
          </button>
        )}
      </div>
    </div>
  );
}
