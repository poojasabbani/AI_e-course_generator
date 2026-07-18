import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [model, setModel] = useState("llama-3.1-70b");
  const [difficulty, setDifficulty] = useState("intermediate");

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary font-semibold">Settings</div>
        <h1 className="mt-1 font-display text-3xl font-bold">Preferences</h1>
      </div>

      <Section title="Profile">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </Field>
      </Section>

      <Section title="AI">
        <Field label="Preferred model">
          <select value={model} onChange={(e) => setModel(e.target.value)} className="input">
            <option value="llama-3.1-70b">Groq · Llama 3.1 70B</option>
            <option value="llama-3.1-8b">Groq · Llama 3.1 8B (faster)</option>
            <option value="gemini-flash">Lovable AI · Gemini Flash</option>
          </select>
        </Field>
        <Field label="Default course difficulty">
          <div className="flex gap-2">
            {["beginner", "intermediate", "advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 rounded-lg py-2 text-sm capitalize border transition-colors ${
                  difficulty === d
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-muted/50 text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Settings saved")}
          className="gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground glow"
        >
          Save changes
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-muted);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: none; box-shadow: 0 0 0 2px var(--color-ring); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="font-display font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
