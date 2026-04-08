export interface BlockStats {
  daily: Record<string, number>;
  weekly: Record<string, number>;
  domains: Record<string, number>;
  lastBlocked: string | null;
  totalBlocked: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  startDate: string;
  milestones: number[];
  achievedMilestones: number[];
}

export interface UserSettings {
  protectionEnabled: boolean;
  strictMode: boolean;
  passwordHash: string | null;
  passwordSalt: string | null;
  accountabilityEmail: string | null;
  protectionLevel: "standard" | "strict" | "maximum";
  customBlacklist: string[];
  customWhitelist: string[];
  language: "id" | "en";
  personalGoals: string[];
  countdownDuration: number;
  onboardingCompleted: boolean;
}

export interface SyncStorage {
  settings: UserSettings;
  streak: StreakData;
}

export interface LocalStorage {
  stats: BlockStats;
}

export const DEFAULT_SETTINGS: UserSettings = {
  protectionEnabled: true,
  strictMode: false,
  passwordHash: null,
  passwordSalt: null,
  accountabilityEmail: null,
  protectionLevel: "standard",
  customBlacklist: [],
  customWhitelist: [],
  language: "id",
  personalGoals: [],
  countdownDuration: 7,
  onboardingCompleted: false,
};

export const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  startDate: new Date().toISOString().split("T")[0]!,
  milestones: [7, 30, 90, 180, 365],
  achievedMilestones: [],
};

export const DEFAULT_STATS: BlockStats = {
  daily: {},
  weekly: {},
  domains: {},
  lastBlocked: null,
  totalBlocked: 0,
};
