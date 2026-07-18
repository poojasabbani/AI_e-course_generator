import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, FileText, MessageSquare, Search, Sparkles, Target, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-primary size-8 rounded-lg grid place-items-center glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold gradient-text">Coursefy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link
              to="/auth"
              className="gradient-primary rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground glow"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Grounded RAG · Llama 3.1 70B · pgvector hybrid search
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Turn any PDF into an <br />
          <span className="gradient-text">AI-powered course.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground"
        >
          Upload a book, research paper, or documentation. Get a structured course with chapters,
          lessons, quizzes, and a chatbot grounded strictly in your source.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Link
            to="/auth"
            className="gradient-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground glow transition-transform hover:scale-[1.02]"
          >
            Start free <ArrowRight className="size-4" />
          </Link>
          <a
            href="#features"
            className="glass inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 mx-auto max-w-4xl glass-strong rounded-2xl p-2 glow"
        >
          <div className="rounded-xl overflow-hidden border border-border/50 bg-card/50 aspect-[16/9] grid place-items-center relative">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, oklch(0.55 0.24 285 / 0.35), transparent 60%), radial-gradient(circle at 70% 60%, oklch(0.6 0.22 320 / 0.3), transparent 60%)",
              }}
            />
            <div className="relative grid grid-cols-3 gap-4 p-8 w-full max-w-2xl">
              {["PDF", "Chunks", "Course"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                  <div className="mt-1 font-display font-semibold">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Features</div>
          <h2 className="mt-3 font-display text-4xl font-bold">Everything a learner needs</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {[
            { icon: FileText, title: "Smart PDF ingest", body: "Heading detection, semantic chunking, streaming ingest for 500+ page books." },
            { icon: Brain, title: "Grounded generation", body: "Every lesson is traced to source chunks. Zero hallucinated content." },
            { icon: MessageSquare, title: "RAG chatbot", body: "Ask anything. Answers cite chapter and lesson, always from your PDF." },
            { icon: Target, title: "Adaptive quizzes", body: "MCQ, true/false, short answer — with grounded explanations." },
            { icon: Search, title: "Hybrid search", body: "BM25 + semantic vector search fused with reciprocal rank." },
            { icon: Zap, title: "Streaming UX", body: "First token in under a second. Cancel anytime. Progressive rendering." },
          ].map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="gradient-primary size-10 rounded-lg grid place-items-center glow">
                <Icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="glass-strong rounded-3xl p-12 glow">
          <h2 className="font-display text-4xl font-bold">Ready to build your first course?</h2>
          <p className="mt-3 text-muted-foreground">Upload a PDF. Two minutes later, you have a course.</p>
          <Link
            to="/auth"
            className="gradient-primary mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground glow"
          >
            Get started <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        Built with TanStack Start · FastAPI · Groq · pgvector
      </footer>
    </div>
  );
}
