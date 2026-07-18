import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Trophy, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";

const ICONS = { lesson: BookOpen, quiz: Trophy, chat: MessageSquare, upload: Upload };

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const q = useQuery({ queryKey: ["history"], queryFn: api.listHistory });
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-primary font-semibold">Timeline</div>
      <h1 className="mt-1 font-display text-3xl font-bold">Learning history</h1>
      <p className="mt-2 text-muted-foreground">Everything you've done, in order.</p>

      <div className="mt-8 space-y-3">
        {(q.data ?? []).map((h, i) => {
          const Icon = ICONS[h.type];
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass rounded-xl p-4 flex items-center gap-3"
            >
              <div className="gradient-primary size-9 rounded-lg grid place-items-center shrink-0">
                <Icon className="size-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{h.title}</div>
                <div className="text-xs text-muted-foreground truncate">{h.course_title}</div>
              </div>
              <div className="text-xs text-muted-foreground">{h.time}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
