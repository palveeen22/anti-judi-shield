import { useEffect, useState } from "react";
import { BlockChart } from "./components/BlockChart";
import { StreakCalendar } from "./components/StreakCalendar";
import { SettingsPanel } from "./components/SettingsPanel";
import { BlacklistManager } from "./components/BlacklistManager";
import { AccountabilitySettings } from "./components/AccountabilitySettings";
import { sendMessage } from "@/shared/utils/messaging";
import type { BlockStats, StreakData, UserSettings } from "@/shared/types";
import { DEFAULT_SETTINGS, DEFAULT_STATS, DEFAULT_STREAK } from "@/shared/types";

type Tab = "overview" | "settings" | "blacklist";

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<BlockStats>(DEFAULT_STATS);
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sendMessage("GET_SETTINGS", undefined),
      sendMessage("GET_STATS", { period: "week" }),
      chrome.storage.sync.get("streak"),
    ]).then(([s, st, strk]) => {
      setSettings(s);
      setStats(st);
      if (strk.streak) setStreak(strk.streak as StreakData);
      setLoading(false);
    });
  }, []);

  const handleSettingsUpdate = async (updates: Partial<UserSettings>) => {
    await sendMessage("UPDATE_SETTINGS", updates);
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Memuat dashboard...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0]!;
  const todayBlocked = stats.daily[today] ?? 0;

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold">Anti-Judi Shield</h1>
              <p className="text-sm text-gray-400">Dashboard Perlindungan</p>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              settings.protectionEnabled
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {settings.protectionEnabled ? "Aktif" : "Nonaktif"}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard label="Hari Ini" value={todayBlocked} color="red" />
          <StatCard label="Total Blokir" value={stats.totalBlocked} color="orange" />
          <StatCard label="Streak" value={`${streak.currentStreak} hari`} color="green" />
          <StatCard label="Rekor Streak" value={`${streak.longestStreak} hari`} color="blue" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8">
          {([
            ["overview", "Ringkasan"],
            ["settings", "Pengaturan"],
            ["blacklist", "Daftar Blokir"],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <div className="space-y-6">
            <BlockChart stats={stats} />
            <StreakCalendar streak={streak} />

            {/* Top blocked domains */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Domain Paling Sering Diblokir</h3>
              {Object.keys(stats.domains).length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada data</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.domains)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([domain, count]) => (
                      <div
                        key={domain}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm text-gray-300 font-mono">{domain}</span>
                        <span className="text-sm font-bold text-red-400">{count}x</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-6">
            <SettingsPanel
              settings={settings}
              onUpdate={handleSettingsUpdate}
            />
            <AccountabilitySettings
              settings={settings}
              onUpdate={handleSettingsUpdate}
            />
          </div>
        )}

        {tab === "blacklist" && <BlacklistManager settings={settings} />}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "red" | "orange" | "green" | "blue";
}) {
  const colorMap = {
    red: "text-red-400",
    orange: "text-orange-400",
    green: "text-green-400",
    blue: "text-blue-400",
  };

  return (
    <div className="bg-white/5 rounded-2xl p-5">
      <div className={`text-2xl font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
