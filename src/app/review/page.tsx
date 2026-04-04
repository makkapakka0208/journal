"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { getEntries } from "@/lib/storage";
import { JournalEntry } from "@/lib/types";
import TabBar from "@/components/TabBar";

export default function ReviewPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getEntries());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const avgMood =
    entries.length > 0
      ? (entries.reduce((s, e) => s + e.mood_score, 0) / entries.length).toFixed(1)
      : "—";

  const allTags = entries.flatMap((e) => e.tags);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <main className="max-w-lg mx-auto px-5 pb-24 pt-12 page-enter">
      <h1 className="text-xl font-semibold text-ink mb-6 flex items-center gap-2">
        <TrendingUp size={20} className="text-accent" />
        复盘
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl bg-paper shadow-neumorphic p-4 text-center">
          <p className="text-2xl font-semibold text-accent">{entries.length}</p>
          <p className="text-xs text-ink-light/50 mt-1">总记录数</p>
        </div>
        <div className="rounded-2xl bg-paper shadow-neumorphic p-4 text-center">
          <p className="text-2xl font-semibold text-accent">{avgMood}</p>
          <p className="text-xs text-ink-light/50 mt-1">平均心情</p>
        </div>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm text-ink-light/60 mb-3">高频关键词</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full bg-paper shadow-neumorphic-sm text-accent"
              >
                {tag}
                <span className="text-ink-light/30 ml-1">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent mood trend */}
      {entries.length > 0 && (
        <div>
          <h2 className="text-sm text-ink-light/60 mb-3 flex items-center gap-2">
            <Calendar size={14} />
            近期心情
          </h2>
          <div className="rounded-2xl bg-paper shadow-neumorphic-inset p-4">
            <div className="flex items-end gap-1.5 h-24">
              {entries.slice(0, 14).reverse().map((entry, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-accent/60 transition-all"
                    style={{ height: `${(entry.mood_score / 10) * 100}%` }}
                  />
                  <span className="text-[8px] text-ink-light/30">
                    {entry.date.slice(8)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center text-ink-light/40 mt-16">
          <p className="text-sm">还没有数据，开始记录后这里会展示你的复盘</p>
        </div>
      )}

      <TabBar />
    </main>
  );
}
