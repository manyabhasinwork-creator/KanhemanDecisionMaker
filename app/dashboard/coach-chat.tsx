"use client";

import { useState, useRef, useEffect } from "react";

type Role = "user" | "model";
type ChatMessage = { role: Role; text: string; tier?: Tier };
type Tier = "Supported" | "Plausible" | "Insufficient evidence";

const TIER_LABELS: Tier[] = ["Supported", "Plausible", "Insufficient evidence"];

function extractTier(text: string): { body: string; tier?: Tier } {
  const lines = text.trimEnd().split("\n");
  const lastLine = lines[lines.length - 1]?.trim() ?? "";
  const match = lastLine.match(/^TIER:\s*(.+)$/i);
  if (match) {
    const raw = match[1].trim();
    const tier = TIER_LABELS.find(
      (t) => t.toLowerCase() === raw.toLowerCase()
    );
    if (tier) {
      return { body: lines.slice(0, -1).join("\n").trimEnd(), tier };
    }
  }
  return { body: text };
}

export default function CoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      const { body, tier } = extractTier(data.text ?? "");
      setMessages((prev) => [...prev, { role: "model", text: body, tier }]);
    } catch {
      setError("Couldn't reach the coach. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="coach-chat">
      <div className="coach-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="coach-empty">
            Describe a real decision you&apos;re facing. Be as specific as
            you&apos;d be with a colleague &mdash; the more context, the
            better the questions.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`coach-msg ${m.role}`}>
            <div className="coach-bubble">
              {m.text}
              {m.tier && (
                <div className={`coach-tier tier-${m.tier.replace(/\s+/g, "-").toLowerCase()}`}>
                  {m.tier}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="coach-msg model">
            <div className="coach-bubble coach-typing">Thinking&hellip;</div>
          </div>
        )}
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="coach-input-row">
        <textarea
          className="coach-input"
          placeholder="Type your decision, or answer the last question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          className="btn primary"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
