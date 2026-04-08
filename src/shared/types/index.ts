import type { BlockStats, UserSettings } from "./storage";

export type {
  BlockStats,
  StreakData,
  UserSettings,
  SyncStorage,
  LocalStorage,
} from "./storage";
export {
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
  DEFAULT_STATS,
} from "./storage";
export type { BlockRule } from "./rules";
export type { AnalyzerResult, DetectionResult } from "./detection";
export { SUSPICION_THRESHOLD, HIGH_CONFIDENCE_THRESHOLD } from "./detection";

export type MessageMap = {
  GET_PROTECTION_STATUS: {
    request: undefined;
    response: { active: boolean; level: string };
  };
  TOGGLE_PROTECTION: {
    request: { password?: string };
    response: { success: boolean; error?: string };
  };
  GET_STATS: {
    request: { period: "day" | "week" | "month" };
    response: BlockStats;
  };
  REPORT_GAMBLING_CONTENT: {
    request: {
      url: string;
      score: number;
      matches: string[];
      confidence: "low" | "medium" | "high";
      detectionMethods: string[];
    };
    response: void;
  };
  ADD_TO_BLACKLIST: {
    request: { domain: string };
    response: { success: boolean };
  };
  REMOVE_FROM_BLACKLIST: {
    request: { domain: string };
    response: { success: boolean };
  };
  BYPASS_ATTEMPT: {
    request: { url: string };
    response: void;
  };
  GET_SETTINGS: {
    request: undefined;
    response: UserSettings;
  };
  UPDATE_SETTINGS: {
    request: Partial<UserSettings>;
    response: { success: boolean };
  };
};

export type MessageType = keyof MessageMap;
