import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, CheckCircle2, Clock, Flame, TrendingUp, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/mock-data";
import { getCourses } from "@/api/courses";
import { CourseCard } from "@/components/course/course-card";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Dashboard />
      </AppShell>
    </AuthGuard>
  ),
});

function Dashboard() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const courses = useQuery({ queryKey: ["courses"], queryFn: getCourses });
  console.log(courses.data);
  const activity = useQuery({ queryKey: ["activity"], queryFn: api.listRecentActivity });

  const cards = [
    { label: "Courses generated", value: stats.data?.courses_generated ?? "—", icon: BookOpen },
    { label: "Lessons completed", value: stats.data?.lessons_completed ?? "—", icon: CheckCircle2 },
    { label: "Minutes studied", value: stats.data?.minutes_studied ?? "—", icon: Clock },
    { label: "Day streak", value: stats.data?.streak_days ?? "—", icon: Flame },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Overview</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Pick up where you left off, or generate a new course from a PDF.</p>
        </div>
        <Link
          to="/upload"
          className="gradient-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow self-start md:self-auto"
        >
          <Upload className="size-4" /> Upload PDF
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{c.label}</div>
              <c.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">{c.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Your courses</h2>
            <Link to="/courses" className="text-sm text-primary flex items-center gap-1">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {courses.data?.map((c, index) => (
              <CourseCard
                key={c.id}
                course={c}
                index={index}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Recent activity</h2>
          <div className="mt-4 glass rounded-xl divide-y divide-border/60">
            {(activity.data ?? []).map((a) => (
              <div key={a.id} className="p-4 flex items-start gap-3">
                <div className="gradient-primary size-8 rounded-lg grid place-items-center shrink-0">
                  <TrendingUp className="size-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.detail}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.course_title}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
