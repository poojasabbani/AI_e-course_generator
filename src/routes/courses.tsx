import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { CourseCard } from "@/components/course/course-card";
import { api } from "@/lib/mock-data";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const courses = useQuery({ queryKey: ["courses"], queryFn: api.listCourses });
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <div className="text-xs uppercase tracking-widest text-primary font-semibold">Library</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Your courses</h1>
        <p className="mt-2 text-muted-foreground">Every course you've generated from a PDF.</p>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(courses.data ?? []).map((c, i) => (
          <CourseCard key={c.id} course={c} index={i} />
        ))}
      </div>
    </div>
  );
}
