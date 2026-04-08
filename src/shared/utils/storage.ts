import {
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_STREAK,
  type BlockStats,
  type StreakData,
  type UserSettings,
} from "@/shared/types";

// Sync storage (small, syncs across devices)
export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.sync.get("settings");
  return { ...DEFAULT_SETTINGS, ...(result.settings as Partial<UserSettings>) };
}

export async function updateSettings(
  updates: Partial<UserSettings>,
): Promise<void> {
  const current = await getSettings();
  await chrome.storage.sync.set({ settings: { ...current, ...updates } });
}

export async function getStreak(): Promise<StreakData> {
  const result = await chrome.storage.sync.get("streak");
  return { ...DEFAULT_STREAK, ...(result.streak as Partial<StreakData>) };
}

export async function updateStreak(
  updates: Partial<StreakData>,
): Promise<void> {
  const current = await getStreak();
  await chrome.storage.sync.set({ streak: { ...current, ...updates } });
}

// Local storage (larger, device-specific)
export async function getStats(): Promise<BlockStats> {
  const result = await chrome.storage.local.get("stats");
  return { ...DEFAULT_STATS, ...(result.stats as Partial<BlockStats>) };
}

export async function updateStats(
  updates: Partial<BlockStats>,
): Promise<void> {
  const current = await getStats();
  await chrome.storage.local.set({ stats: { ...current, ...updates } });
}

export async function recordBlock(domain: string): Promise<void> {
  const stats = await getStats();
  const today = new Date().toISOString().split("T")[0]!;
  const weekNum = getWeekKey(new Date());

  stats.daily[today] = (stats.daily[today] ?? 0) + 1;
  stats.weekly[weekNum] = (stats.weekly[weekNum] ?? 0) + 1;
  stats.domains[domain] = (stats.domains[domain] ?? 0) + 1;
  stats.lastBlocked = new Date().toISOString();
  stats.totalBlocked += 1;

  await chrome.storage.local.set({ stats });
}

function getWeekKey(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / 86400000,
  );
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}
