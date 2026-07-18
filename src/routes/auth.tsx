import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Coursefy" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email || "demo@coursefy.app", password || "demo");
        toast.success("Welcome back!");
      } else {
        await signUp(email || "demo@coursefy.app", password || "demo", name || "Learner");
        toast.success("Account created");
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, oklch(0.55 0.24 285 / 0.35), transparent 55%), radial-gradient(circle at 70% 70%, oklch(0.6 0.22 320 / 0.3), transparent 55%)",
          }}
        />
        <Link to="/" className="flex items-center gap-2">
          <div className="gradient-primary size-8 rounded-lg grid place-items-center glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold gradient-text">Coursefy</span>
        </Link>
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight max-w-md">
            Learn any PDF, <span className="gradient-text">the interactive way.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Upload once. Get a full course, a chatbot, and quizzes — grounded in your source.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass-strong rounded-2xl p-8"
        >
          <div className="flex gap-1 rounded-lg bg-muted p-1 text-sm">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md py-1.5 font-medium transition-colors ${
                  mode === m ? "bg-card text-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="mt-1 w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              disabled={submitting}
              className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground glow disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Demo mode — any email/password works. Wire your FastAPI JWT endpoints in{" "}
            <code className="text-primary">src/lib/auth.tsx</code>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
