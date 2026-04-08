import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "@/shared/utils/messaging";
import type { BlockStats, StreakData, UserSettings } from "@/shared/types";
import { DEFAULT_SETTINGS, DEFAULT_STATS, DEFAULT_STREAK } from "@/shared/types";

export function Popup() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<BlockStats>(DEFAULT_STATS);
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      sendMessage("GET_SETTINGS", undefined),
      sendMessage("GET_STATS", { period: "day" }),
      chrome.storage.sync.get("streak"),
    ]).then(([s, st, strk]) => {
      setSettings(s);
      setStats(st);
      if (strk.streak) setStreak(strk.streak as StreakData);
      setLoading(false);
    });
  }, []);

  const toggleProtection = useCallback(async () => {
    setError("");

    // If strict mode is on and trying to disable
    if (settings.strictMode && settings.protectionEnabled) {
      if (!showPasswordField) {
        setShowPasswordField(true);
        return;
      }
      if (!passwordInput) {
        setError("Masukkan password");
        return;
      }
    }

    const result = await sendMessage("TOGGLE_PROTECTION", {
      password: passwordInput || undefined,
    });

    if (result.success) {
      setSettings((prev) => ({
        ...prev,
        protectionEnabled: !prev.protectionEnabled,
      }));
      setShowPasswordField(false);
      setPasswordInput("");
    } else {
      setError(result.error ?? "Gagal mengubah status perlindungan");
    }
  }, [settings, passwordInput, showPasswordField]);

  const openDashboard = () => {
    chrome.runtime.openOptionsPage();
  };

  const today = new Date().toISOString().split("T")[0]!;
  const todayBlocked = stats.daily[today] ?? 0;

  if (loading) {
    return (
      <div className="w-85 min-h-50 bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="w-85 bg-[#1a1a2e] text-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="text-2xl">🛡️</div>
            <div>
              <h1 className="text-base font-bold">Anti-Judi Shield</h1>
              <p className="text-xs text-gray-400">Perlindungan Digital</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleProtection}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              settings.protectionEnabled ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                settings.protectionEnabled ? "translate-x-7.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Status */}
        <div
          className={`mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-center ${
            settings.protectionEnabled
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {settings.protectionEnabled
            ? "Perlindungan Aktif"
            : "Perlindungan Nonaktif"}
        </div>
      </div>

      {/* Password field for strict mode */}
      {showPasswordField && (
        <div className="px-5 py-3 border-b border-white/10">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Masukkan password..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          {error && (
            <p className="text-red-400 text-xs mt-1">{error}</p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={toggleProtection}
              className="flex-1 py-1.5 bg-red-500 rounded-lg text-xs font-medium hover:bg-red-600"
            >
              Nonaktifkan
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPasswordField(false);
                setPasswordInput("");
                setError("");
              }}
              className="flex-1 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-5 py-4 grid grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-400">{todayBlocked}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Hari Ini</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-orange-400">
            {stats.totalBlocked}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Total Blokir</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-green-400">
            {streak.currentStreak}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Hari Streak</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={openDashboard}
          className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium transition-colors"
        >
          Buka Dashboard
        </button>
      </div>
    </div>
  );
}
