import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const [q, setQ] = useState("boundaries");
  const results = useQuery({ queryKey: ["search", q], queryFn: () => api.search(q), enabled: q.length > 0 });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-primary font-semibold">Hybrid search</div>
      <h1 className="mt-1 font-display text-3xl font-bold">Search across all your courses</h1>
      <p className="mt-2 text-muted-foreground">Keyword (BM25) + semantic (vector) fused with reciprocal rank.</p>

      <div className="mt-6 glass-strong rounded-xl p-3 flex items-center gap-2">
        <SearchIcon className="size-5 text-muted-foreground ml-2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="flex-1 bg-transparent px-2 py-2 focus:outline-none"
        />
      </div>

      <div className="mt-6 space-y-3">
        {(results.data ?? []).map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to="/courses/$courseId"
              params={{ courseId: r.course_id }}
              className="block glass rounded-xl p-5 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {r.course_title} · {r.chapter} · {r.lesson}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-semibold text-primary">
                    {r.match_type}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {r.score.toFixed(2)}
                  </span>
                </div>
              </div>
              <div
                className="mt-2 text-sm [&_mark]:bg-primary/30 [&_mark]:text-foreground [&_mark]:px-0.5 [&_mark]:rounded"
                dangerouslySetInnerHTML={{ __html: r.snippet }}
              />
            </Link>
          </motion.div>
        ))}
        {results.data?.length === 0 && q.trim() && (
          <div className="text-center py-16 text-muted-foreground text-sm">No matches. Try another query.</div>
        )}
      </div>
    </div>
  );
}
