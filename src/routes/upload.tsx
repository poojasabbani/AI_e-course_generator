import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, Loader2, Upload as UploadIcon, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { uploadPDF } from "@/api/upload";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload PDF — Coursefy" }] }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

type Stage = "idle" | "uploading" | "extracting" | "chunking" | "embedding" | "generating" | "ready";
const STAGES: { key: Stage; label: string }[] = [
  { key: "uploading", label: "Uploading PDF" },
  { key: "extracting", label: "Extracting text & headings" },
  { key: "chunking", label: "Creating semantic chunks" },
  { key: "embedding", label: "Generating embeddings" },
  { key: "generating", label: "Generating course with Groq (Llama 3.1 70B)" },
  { key: "ready", label: "Ready" },
];

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onFile = (f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      toast.error("File too large (25 MB max on free tier)");
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }, []);

  async function start() {
    if (!file) return;

    try {
      setStage("uploading");

      await uploadPDF(file);

      setStage("ready");

      toast.success("PDF uploaded successfully!");

      // Refresh the dashboard courses
      await queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      navigate({
        to: "/dashboard",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Upload failed"
      );
      setStage("idle");
    }
  }

  const currentIdx = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-primary font-semibold">Upload</div>
      <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Turn your PDF into a course</h1>
      <p className="mt-2 text-muted-foreground">
        Books, research papers, documentation, notes — up to 25 MB, ~500 pages.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-8 glass rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        {!file ? (
          <>
            <div className="gradient-primary size-14 rounded-2xl grid place-items-center mx-auto glow">
              <UploadIcon className="size-6 text-primary-foreground" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">Drop a PDF here</div>
            <div className="text-sm text-muted-foreground">or click to browse</div>
            <label className="mt-6 inline-block cursor-pointer glass rounded-lg px-5 py-2.5 text-sm font-semibold">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              Choose file
            </label>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-3">
              <div className="gradient-primary size-12 rounded-xl grid place-items-center">
                <FileText className="size-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              {stage === "idle" && (
                <button
                  onClick={() => setFile(null)}
                  className="ml-2 p-1.5 rounded-md hover:bg-muted"
                  aria-label="Remove"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {stage === "idle" && (
              <button
                onClick={start}
                className="mt-6 gradient-primary rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground glow"
              >
                Generate course
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {stage !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 glass rounded-2xl p-6"
          >
            <div className="font-display font-semibold">Pipeline</div>
            <div className="mt-4 space-y-3">
              {STAGES.map((s, i) => {
                const done = i < currentIdx || stage === "ready";
                const active = s.key === stage && stage !== "ready";
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div
                      className={`size-6 rounded-full grid place-items-center shrink-0 ${
                        done ? "bg-success text-success-foreground" : active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="size-4" />
                      ) : active ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <span className="text-[10px]">{i + 1}</span>
                      )}
                    </div>
                    <div className={`text-sm ${done || active ? "" : "text-muted-foreground"}`}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
