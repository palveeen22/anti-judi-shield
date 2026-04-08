import { useEffect, useState } from "react";
import type { BlockStats } from "@/shared/types";
import { getStats } from "@/shared/utils/storage";
import { getLastNDays, getToday } from "@/shared/utils/date";

export interface StatsView {
  todayBlocked: number;
  weekBlocked: number;
  totalBlocked: number;
  dailyData: { date: string; count: number }[];
  topDomains: { domain: string; count: number }[];
  loading: boolean;
}

export function useBlockStats(days: number = 7): StatsView {
  const [stats, setStats] = useState<BlockStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((s) => {
      setStats(s);
      setLoading(false);
    });

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string,
    ) => {
      if (area === "local" && changes.stats) {
        setStats(changes.stats.newValue as BlockStats);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  if (!stats || loading) {
    return {
      todayBlocked: 0,
      weekBlocked: 0,
      totalBlocked: 0,
      dailyData: [],
      topDomains: [],
      loading: true,
    };
  }

  const today = getToday();
  const lastNDays = getLastNDays(days);

  const dailyData = lastNDays.map((date) => ({
    date,
    count: stats.daily[date] ?? 0,
  }));

  const weekBlocked = dailyData.reduce((sum, d) => sum + d.count, 0);

  const topDomains = Object.entries(stats.domains)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    todayBlocked: stats.daily[today] ?? 0,
    weekBlocked,
    totalBlocked: stats.totalBlocked,
    dailyData,
    topDomains,
    loading: false,
  };
}
