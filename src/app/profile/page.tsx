"use client";

import { useEffect, useState } from "react";
import { User, BookOpen, Trash2 } from "lucide-react";
import { getEntries, getStreak } from "@/lib/storage";
import TabBar from "@/components/TabBar";

export default function ProfilePage() {
  const [entryCount, setEntryCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setEntryCount(getEntries().length);
    setStreak(getStreak());
    setMounted(true);
  }, []);

  const handleClear = () => {
    localStorage.removeItem("journal_entries");
    setEntryCount(0);
    setStreak(0);
    setShowConfirm(false);
  };

  if (!mounted) return null;

  return (
    <main className="max-w-lg mx-auto px-5 pb-24 pt-12 page-enter">
      <h1 className="text-xl font-semibold text-ink mb-8 flex items-center gap-2">
        <User size={20} className="text-accent" />
        我的
      </h1>

      {/* Avatar area */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-paper shadow-neumorphic flex items-center justify-center mb-3">
          <BookOpen size={32} className="text-accent/60" />
        </div>
        <p className="text-sm text-ink-light/70">记 · Journal 使用者</p>
      </div>

      {/* Stats */}
      <div className="rounded-2xl bg-paper shadow-neumorphic p-5 mb-6">
        <div className="flex justify-between items-center py-3 border-b border-accent/10">
          <span className="text-sm text-ink-light/70">日记总数</span>
          <span className="text-sm font-medium text-accent">{entryCount} 篇</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-accent/10">
          <span className="text-sm text-ink-light/70">连续记录</span>
          <span className="text-sm font-medium text-accent">{streak} 天</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-ink-light/70">数据存储</span>
          <span className="text-sm text-ink-light/50">本地 localStorage</span>
        </div>
      </div>

      {/* Clear data */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full py-3 rounded-2xl bg-paper shadow-neumorphic-sm text-red-400/70 flex items-center justify-center gap-2 text-sm active:shadow-neumorphic-inset transition-all"
        >
          <Trash2 size={14} />
          清除所有数据
        </button>
      ) : (
        <div className="rounded-2xl bg-paper shadow-neumorphic-inset p-4 text-center space-y-3">
          <p className="text-sm text-ink-light/70">确定要清除所有日记数据吗？此操作不可恢复。</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2 rounded-xl bg-paper shadow-neumorphic-sm text-sm text-ink-light active:shadow-neumorphic-inset transition-all"
            >
              取消
            </button>
            <button
              onClick={handleClear}
              className="flex-1 py-2 rounded-xl bg-red-50 shadow-neumorphic-sm text-sm text-red-500 active:shadow-neumorphic-inset transition-all"
            >
              确认清除
            </button>
          </div>
        </div>
      )}

      <TabBar />
    </main>
  );
}
