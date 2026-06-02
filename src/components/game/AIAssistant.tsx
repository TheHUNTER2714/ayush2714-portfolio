import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RobotAI } from "./RobotAI";

const SUGGEST = [
  "Who is Ayush?",
  "List his hackathon wins",
  "What's his strongest skill?",
  "Recommend a project to check out",
];

export function AIAssistant() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const [fire, setFire] = useState(0);
  const send = (text: string) => {
    if (!text.trim() || isBusy) return;
    setFire((n) => n + 1);
    sendMessage({ text });
    setInput("");
  };

  return (
    <section className="min-h-screen px-6 md:px-16 pt-32 pb-32">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="font-mono text-xs text-primary mb-2">▸ FALCON_AI.exe — ONLINE</div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-glow">AI <span className="text-accent text-glow-accent">CO-PILOT</span></h2>
          <p className="font-mono text-xs text-muted-foreground mt-2">Ask anything about Ayush. Powered by Lovable AI.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[180px_1fr] gap-6">
          <div className="hidden lg:flex flex-col items-center pt-6 relative">
            <motion.div
              data-falcon-target
              animate={isBusy ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 0.6, repeat: isBusy ? Infinity : 0 }}
              className="relative"
            >
              <RobotAI size={180} busy={isBusy} fire={fire} />
            </motion.div>
            {isBusy && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-[10px] text-primary mt-4 tracking-widest"
              >
                ▸ TRANSMITTING<motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >...</motion.span>
              </motion.div>
            )}
          </div>

          <div className="corner-frame box-glow bg-card backdrop-blur-md p-4">
            <span className="c-bl" /><span className="c-br" />
            <div
              ref={scrollRef}
              className="h-[360px] overflow-y-auto pr-2 space-y-3 font-mono text-sm"
            >
              {messages.length === 0 && (
                <div className="text-muted-foreground text-[12px]">
                  <span className="text-primary">FALCON&gt;</span> Standing by. Pick a prompt below or type a question.
                </div>
              )}
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-accent/15 text-accent border border-accent/40"
                          : "bg-primary/10 text-foreground/90 border border-primary/30"
                      }`}
                      style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}
                    >
                      <span className={isUser ? "text-accent" : "text-primary"}>
                        {isUser ? "YOU> " : "FALCON> "}
                      </span>
                      {text}
                      {!isUser && isBusy && m.id === messages[messages.length - 1]?.id && (
                        <span className="inline-block w-1.5 h-3 align-middle ml-0.5 bg-primary animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGEST.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={isBusy}
                  className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary/90 hover:bg-primary/10 transition disabled:opacity-40"
                >
                  ▸ {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="mt-3 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask falcon..."
                className="flex-1 bg-background/60 border border-primary/40 px-3 py-2 font-mono text-sm focus:outline-none focus:border-primary"
                disabled={isBusy}
              />
              <button
                type="submit" disabled={isBusy || !input.trim()}
                className="font-display text-xs tracking-widest px-4 py-2 bg-primary/20 text-primary border border-primary/60 hover:bg-primary/30 transition disabled:opacity-40"
              >
                {isBusy ? "..." : "SEND"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
