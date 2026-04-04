export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood_score: number; // 1-10
  tags: string[];
  journal: string;
  insights: string[];
  future_note: string;
  raw_input: string;
}
