import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const data = useQuery({ queryKey: ["analytics"], queryFn: api.getAnalytics });
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.getStats });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-primary font-semibold">Analytics</div>
      <h1 className="mt-1 font-display text-3xl font-bold">Your learning</h1>
      <p className="mt-2 text-muted-foreground">Streaks, minutes studied, quiz scores.</p>

      <div className="mt-8 grid md:grid-cols-4 gap-4">
        {[
          { label: "Streak", value: `${stats.data?.streak_days ?? 0}d`, tone: "text-warning" },
          { label: "Minutes (14d)", value: (data.data ?? []).reduce((s, d) => s + d.minutes, 0) },
          { label: "Lessons (14d)", value: (data.data ?? []).reduce((s, d) => s + d.lessons, 0) },
          { label: "Avg quiz", value: `${stats.data?.avg_quiz_score ?? 0}%`, tone: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass rounded-xl p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={`mt-1 font-display text-3xl font-semibold ${s.tone ?? ""}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="font-display font-semibold">Minutes studied · last 14 days</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.data ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area dataKey="minutes" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="font-display font-semibold">Lessons per day</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.data ?? []}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="lessons" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
