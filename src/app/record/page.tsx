"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, Check } from "lucide-react";
import { formatDate, saveEntry } from "@/lib/storage";
import { JournalEntry } from "@/lib/types";
import TabBar from "@/components/TabBar";

function parseAIResponse(text: string): Partial<JournalEntry> {
  const result: Partial<JournalEntry> = {};

  // Extract mood score
  const moodMatch = text.match(/心情分[：:]\s*(\d+)/);
  if (moodMatch) result.mood_score = parseInt(moodMatch[1]);

  // Extract keywords/tags
  const tagsMatch = text.match(/关键词[：:]\s*(.+)/);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(/[,，、]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Extract journal section
  const journalMatch = text.match(/【日记】\s*([\s\S]*?)(?=【洞察】|$)/);
  if (journalMatch) result.journal = journalMatch[1].trim();

  // Extract insights
  const insightsMatch = text.match(/【洞察】\s*([\s\S]*?)(?=【未来视角】|$)/);
  if (insightsMatch) {
    result.insights = insightsMatch[1]
      .trim()
      .split("\n")
      .map((l) => l.replace(/^[-·•]\s*/, "").trim())
      .filter(Boolean);
  }

  // Extract future note
  const futureMatch = text.match(/【未来视角】\s*([\s\S]*?)(?=【原始感悟】|$)/);
  if (futureMatch) result.future_note = futureMatch[1].trim();

  return result;
}

export default function RecordPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [phase, setPhase] = useState<"input" | "streaming" | "done">("input");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [aiOutput]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setPhase("streaming");
    setAiOutput("");

    const today = formatDate();

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, date: today }),
      });

      if (!res.ok) {
        setAiOutput("抱歉，AI 服务暂时不可用，请稍后再试。");
        setPhase("done");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                fullText += parsed.text;
                setAiOutput(fullText);
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      }

      // Parse and save
      const parsed = parseAIResponse(fullText);
      const dateStr = new Date().toISOString().split("T")[0];
      const entry: JournalEntry = {
        id: `journal_${Date.now()}`,
        date: dateStr,
        mood_score: parsed.mood_score || 5,
        tags: parsed.tags || [],
        journal: parsed.journal || fullText,
        insights: parsed.insights || [],
        future_note: parsed.future_note || "",
        raw_input: input,
      };
      saveEntry(entry);
      setPhase("done");
    } catch {
      setAiOutput("网络错误，请检查连接后重试。");
      setPhase("done");
    }
  };

  return (
    <main className="max-w-lg mx-auto px-5 pb-24 pt-8 min-h-screen page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="w-9 h-9 rounded-xl bg-paper shadow-neumorphic-sm flex items-center justify-center active:shadow-neumorphic-inset transition-all"
        >
          <ArrowLeft size={16} className="text-accent" />
        </button>
        <h1 className="text-lg font-medium text-ink">今日记录</h1>
        <div className="w-9" />
      </div>

      <p className="text-xs text-ink-light/50 text-center mb-6">
        {formatDate()}
      </p>

      {phase === "input" && (
        <div className="space-y-4">
          {/* Input area */}
          <div className="rounded-2xl bg-paper shadow-neumorphic-inset p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="今天发生了什么？写下你的感受、见闻或想法……"
              className="w-full min-h-[320px] bg-transparent text-ink text-sm leading-relaxed resize-none placeholder:text-ink-light/30"
              autoFocus
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 ${
              input.trim()
                ? "bg-paper shadow-neumorphic text-accent active:shadow-neumorphic-inset"
                : "bg-paper-dark/30 text-ink-light/30 cursor-not-allowed"
            }`}
          >
            <Send size={16} />
            <span className="font-medium text-sm">交给 AI 排版</span>
          </button>
        </div>
      )}

      {(phase === "streaming" || phase === "done") && (
        <div className="space-y-4">
          {/* AI output area */}
          <div
            ref={outputRef}
            className="rounded-2xl bg-paper-light shadow-neumorphic p-5 min-h-[380px] max-h-[60vh] overflow-y-auto"
          >
            {phase === "streaming" && !aiOutput && (
              <div className="flex items-center gap-2 text-ink-light/50 text-sm">
                <Loader2 size={14} className="animate-spin" />
                AI 正在为你排版…
              </div>
            )}
            <div className="text-sm leading-relaxed text-ink whitespace-pre-wrap">
              {aiOutput.split("\n").map((line, i) => {
                if (line.startsWith("【") && line.endsWith("】")) {
                  return (
                    <h3
                      key={i}
                      className="text-accent font-semibold mt-4 mb-2 first:mt-0"
                    >
                      {line}
                    </h3>
                  );
                }
                if (
                  line.includes("心情分") ||
                  line.includes("关键词") ||
                  line.includes("日期")
                ) {
                  return (
                    <p key={i} className="text-xs text-ink-light/60 mb-1">
                      {line}
                    </p>
                  );
                }
                return (
                  <p key={i} className="mb-1">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {phase === "done" && (
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 rounded-2xl bg-paper shadow-neumorphic text-accent flex items-center justify-center gap-2 active:shadow-neumorphic-inset transition-all"
            >
              <Check size={16} />
              <span className="font-medium text-sm">完成，回到首页</span>
            </button>
          )}
        </div>
      )}

      <TabBar />
    </main>
  );
}
