"use client";

import { Home, PenLine, BarChart3, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { key: "/", label: "首页", icon: Home },
  { key: "/record", label: "记录", icon: PenLine },
  { key: "/review", label: "复盘", icon: BarChart3 },
  { key: "/profile", label: "我的", icon: User },
];

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-accent/10">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => router.push(tab.key)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-accent shadow-neumorphic-inset bg-paper-dark/30"
                  : "text-ink-light/50 active:scale-95"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="text-[10px] font-ui">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
