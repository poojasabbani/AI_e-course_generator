import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, type ChatMessage } from "@/lib/mock-data";

export function ChatDrawer({
  open,
  onOpenChange,
  courseId,
  contextLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  contextLabel?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function send() {
    const q = input.trim();
    if (!q || pending) return;
    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setPending(true);
    try {
      const reply = await api.chat(courseId, q, messages);
      setMessages((m) => [...m, reply]);
    } finally {
      setPending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md glass-strong border-l border-border/50 flex flex-col"
          >
            <header className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="gradient-primary size-8 rounded-lg grid place-items-center glow">
                  <Sparkles className="size-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Course AI</div>
                  {contextLabel && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                      Context: {contextLabel}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X className="size-4" />
              </button>
            </header>
            <div ref={scrollerRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <MessageSquare className="size-8 mx-auto text-muted-foreground" />
                  <div className="mt-3 text-sm text-muted-foreground">
                    Ask anything about this course. Answers cite chapter and lesson.
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {[
                      "Summarize this chapter in 3 bullets",
                      "What are the anti-patterns to avoid?",
                      "Give me a quiz on this lesson",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="glass text-xs px-3 py-2 rounded-lg text-left hover:bg-accent/40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                      m.role === "user"
                        ? "gradient-primary text-primary-foreground"
                        : "glass"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
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
                  </div>
                </div>
              ))}
              {pending && (
                <div className="glass rounded-xl px-3.5 py-2.5 text-sm max-w-[85%] flex gap-1">
                  <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                </div>
              )}
            </div>
            <div className="p-3 border-t border-border/50">
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
                  placeholder="Ask a question…"
                  className="flex-1 resize-none bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                />
                <button
                  onClick={send}
                  disabled={pending || !input.trim()}
                  className="gradient-primary size-9 rounded-lg grid place-items-center text-primary-foreground disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="size-1.5 rounded-full bg-muted-foreground"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
    />
  );
}
