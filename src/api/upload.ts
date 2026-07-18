import { apiFetch } from "./client";

export interface UploadResponse {
  message: string;
  course: {
    id: string;
    title: string;
    pdf_path: string;
    status: string;
    created_at: string;
  }[];
}

export async function uploadPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UploadResponse>("/upload/", {
    method: "POST",
    body: formData,
  });
}