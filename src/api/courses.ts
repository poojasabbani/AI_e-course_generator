import { apiFetch } from "./client";

export interface Course {
  id: string;
  title: string;
  pdf_path: string;
  status: string;
  created_at?: string;
  user_id?: string | null;
}

export async function getCourses(): Promise<Course[]> {
  return apiFetch<Course[]>("/courses/");
}