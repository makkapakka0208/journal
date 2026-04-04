"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { getEntries } from "@/lib/storage";
import { JournalEntry } from "@/lib/types";

export default function FlipBook() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-ink-light/40">
        <BookOpen size={48} strokeWidth={1} />
        <p className="mt-4 text-sm">还没有日记，开始记录吧</p>
      </div>
    );
  }

  const entry = entries[currentIndex];

  const handleFlip = (direction: "left" | "right") => {
    if (isFlipping) return;
    const nextIndex =
      direction === "right"
        ? Math.min(currentIndex + 1, entries.length - 1)
        : Math.max(currentIndex - 1, 0);
    if (nextIndex === currentIndex) return;

    setFlipDirection(direction);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsFlipping(false);
    }, 600);
  };

  const moodEmoji = (score: number) => {
    if (score >= 8) return "🌟";
    if (score >= 6) return "☀️";
    if (score >= 4) return "🌤️";
    if (score >= 2) return "🌧️";
    return "🌑";
  };

  return (
    <div className="relative">
      {/* Page counter */}
      <div className="text-center text-xs text-ink-light/40 mb-3 font-ui">
        {currentIndex + 1} / {entries.length}
      </div>

      {/* Book container */}
      <div className="flip-container relative mx-auto">
        <div
          className={`relative bg-paper-light rounded-2xl shadow-neumorphic p-5 min-h-[280px] transition-all duration-500 ${
            isFlipping
              ? flipDirection === "right"
                ? "animate-[flipRight_0.6s_ease-in-out]"
                : "animate-[flipLeft_0.6s_ease-in-out]"
              : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Date & mood header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-accent font-medium">{entry.date}</span>
            <span className="text-sm">
              {moodEmoji(entry.mood_score)} {entry.mood_score}/10
            </span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {entry.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent shadow-neumorphic-inset"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Journal excerpt */}
          <div className="text-sm leading-relaxed text-ink-light line-clamp-6 mb-3">
            {entry.journal}
          </div>

          {/* Insights */}
          {entry.insights.length > 0 && (
            <div className="border-t border-accent/10 pt-3 mt-auto">
              <p className="text-xs text-accent/60 mb-1">💡 洞察</p>
              {entry.insights.map((insight, i) => (
                <p key={i} className="text-xs text-ink-light/70 leading-relaxed">
                  {insight}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => handleFlip("left")}
          disabled={currentIndex === 0}
          className={`absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentIndex === 0
              ? "opacity-0"
              : "bg-paper shadow-neumorphic-sm text-accent active:shadow-neumorphic-inset"
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => handleFlip("right")}
          disabled={currentIndex === entries.length - 1}
          className={`absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentIndex === entries.length - 1
              ? "opacity-0"
              : "bg-paper shadow-neumorphic-sm text-accent active:shadow-neumorphic-inset"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
