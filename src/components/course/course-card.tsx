import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";
import type { Course } from "@/api/courses";

export function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="group glass rounded-xl p-5 block">
        <div className="flex items-center gap-3">
          <div className="gradient-primary rounded-lg p-3">
            <FileText className="text-white size-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg line-clamp-2">
              {course.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              {course.status}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          {course.created_at
            ? new Date(course.created_at).toLocaleDateString()
            : "Just now"}
        </div>
      </div>
    </motion.div>
  );
}
