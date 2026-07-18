import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api, type ChatMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat — Coursefy" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ course: (s.course as string) || undefined }),
  component: () => (
    <AuthGuard>
      <AppShell>
        <Page />
      </AppShell>
    </AuthGuard>
  ),
});

function Page() {
  const { course } = Route.useSearch();
  const courses = useQuery({ queryKey: ["courses"], queryFn: api.listCourses });
  const [selected, setSelected] = useState<string | undefined>(course);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected && courses.data?.[0]) setSelected(courses.data[0].id);
  }, [selected, courses.data]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const activeCourse = courses.data?.find((c) => c.id === selected);

  async function send() {
    const q = input.trim();
    if (!q || pending || !selected) return;
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", content: q, created_at: new Date().toISOString() }]);
    setPending(true);
    try {
      const reply = await api.chat(selected, q, messages);
      setMessages((m) => [...m, reply]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 h-[calc(100vh-4rem)] md:h-screen flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">RAG Chat</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Ask your PDF</h1>
        </div>
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value)}
          className="glass rounded-lg px-3 py-2 text-sm"
        >
          {(courses.data ?? []).map((c) => (
            <option key={c.id} value={c.id} className="bg-card">
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div ref={scrollerRef} className="mt-6 flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-2">
        {messages.length === 0 && activeCourse && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="gradient-primary size-12 rounded-2xl grid place-items-center mx-auto glow">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">
              Chat with <span className="gradient-text">{activeCourse.title}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              Every answer cites the chapter and lesson it came from. The model refuses when the PDF doesn't contain the answer.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                "Summarize the whole book in 5 bullets",
                "Which chapter covers boundaries?",
                "Generate 3 quiz questions on Chapter 3",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="glass text-xs px-3 py-2 rounded-lg hover:bg-accent/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.role === "user" ? "gradient-primary text-primary-foreground" : "glass"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-sm">{m.content}</div>
              )}
              {m.citations && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.citations.map((c) => (
                    <span
                      key={c.label}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono"
                      title={`${c.chapter} · ${c.lesson}`}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ))}
        {pending && (
          <div className="glass rounded-2xl px-4 py-3 max-w-[80%] flex gap-1.5">
            <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
          </div>
        )}
      </div>

      <div className="glass-strong rounded-2xl p-3 mt-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask about the PDF…"
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none max-h-32"
          />
          <button
            onClick={send}
            disabled={pending || !input.trim()}
            className="gradient-primary size-10 rounded-lg grid place-items-center text-primary-foreground disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="size-2 rounded-full bg-muted-foreground"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}
