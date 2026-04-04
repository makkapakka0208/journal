"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Feather } from "lucide-react";
import { formatDate, getGreeting, getStreak } from "@/lib/storage";
import FlipBook from "@/components/FlipBook";
import TabBar from "@/components/TabBar";

export default function HomePage() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStreak(getStreak());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="max-w-lg mx-auto px-5 pb-24 pt-12 page-enter">
      {/* Header greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Feather size={18} className="text-accent" />
          <h1 className="text-2xl font-semibold text-ink tracking-wide">
            记 · Journal
          </h1>
        </div>
        <p className="text-sm text-ink-light/70 mt-2">
          {formatDate()} · {getGreeting()}
        </p>
      </div>

      {/* Record button */}
      <button
        onClick={() => router.push("/record")}
        className="w-full py-4 px-6 rounded-2xl bg-paper shadow-neumorphic flex items-center justify-center gap-3 active:shadow-neumorphic-inset transition-all duration-200 mb-4"
      >
        <PenLine size={20} className="text-accent" />
        <span className="text-accent font-medium text-base">今日记录</span>
      </button>

      {/* Streak */}
      <p className="text-center text-xs text-ink-light/50 mb-10">
        {streak > 0
          ? `✦ 已连续记录 ${streak} 天，继续保持`
          : "✦ 开始你的第一篇日记吧"}
      </p>

      {/* Flip book */}
      <div className="mb-6">
        <h2 className="text-sm text-ink-light/60 mb-4 flex items-center gap-2 justify-center">
          <span className="w-8 h-[1px] bg-accent/20 inline-block" />
          往日手帐
          <span className="w-8 h-[1px] bg-accent/20 inline-block" />
        </h2>
        <FlipBook />
      </div>

      <TabBar />
    </main>
  );
}
