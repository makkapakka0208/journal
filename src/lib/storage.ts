import { JournalEntry } from "./types";

const STORAGE_KEY = "journal_entries";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveEntry(entry: JournalEntry): void {
  const entries = getEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntryByDate(date: string): JournalEntry | undefined {
  return getEntries().find((e) => e.date === date);
}

export function getStreak(): number {
  const entries = getEntries();
  if (entries.length === 0) return 0;

  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (dates.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function formatDate(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekDay = weekDays[d.getDay()];
  return `${year}年${month}月${day}日 星期${weekDay}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早安";
  if (hour < 12) return "上午好";
  if (hour < 14) return "午安";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}
