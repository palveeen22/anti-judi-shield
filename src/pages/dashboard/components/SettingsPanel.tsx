import { useState } from "react";
import type { UserSettings } from "@/shared/types";
import { hashPassword } from "@/shared/utils/hash";

interface Props {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

export function SettingsPanel({ settings, onUpdate }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [goalInput, setGoalInput] = useState("");

  const handleStrictModeToggle = async () => {
    if (!settings.strictMode) {
      // Enabling strict mode - need to set password first
      if (!password || password.length < 6) {
        setPasswordError("Password minimal 6 karakter");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Password tidak cocok");
        return;
      }

      const { hash, salt } = await hashPassword(password);
      onUpdate({
        strictMode: true,
        passwordHash: hash,
        passwordSalt: salt,
      });
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } else {
      onUpdate({
        strictMode: false,
        passwordHash: null,
        passwordSalt: null,
      });
    }
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    onUpdate({
      personalGoals: [...settings.personalGoals, goalInput.trim()],
    });
    setGoalInput("");
  };

  const removeGoal = (index: number) => {
    onUpdate({
      personalGoals: settings.personalGoals.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-semibold">Pengaturan</h3>

      {/* Protection level */}
      <div>
        <label className="text-sm font-medium text-gray-300 block mb-2">
          Level Perlindungan
        </label>
        <div className="flex gap-2">
          {(["standard", "strict", "maximum"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onUpdate({ protectionLevel: level })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.protectionLevel === level
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {level === "standard" ? "Standar" : level === "strict" ? "Ketat" : "Maksimal"}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown duration */}
      <div>
        <label className="text-sm font-medium text-gray-300 block mb-2">
          Durasi Countdown (detik)
        </label>
        <input
          type="range"
          min={3}
          max={30}
          value={settings.countdownDuration}
          onChange={(e) =>
            onUpdate({ countdownDuration: Number(e.target.value) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3 detik</span>
          <span className="font-bold text-white">
            {settings.countdownDuration} detik
          </span>
          <span>30 detik</span>
        </div>
      </div>

      {/* Strict Mode */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-medium text-gray-300">Mode Ketat</h4>
            <p className="text-xs text-gray-500">
              Membutuhkan password untuk menonaktifkan perlindungan
            </p>
          </div>
          <button
            type="button"
            onClick={handleStrictModeToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.strictMode ? "bg-red-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                settings.strictMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {!settings.strictMode && (
          <div className="space-y-2 mt-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buat password..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
            />
            {passwordError && (
              <p className="text-red-400 text-xs">{passwordError}</p>
            )}
          </div>
        )}
      </div>

      {/* Personal Goals */}
      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">
          Tujuan Pribadi
        </h4>
        <p className="text-xs text-gray-500 mb-3">
          Ditampilkan di halaman blokir sebagai pengingat
        </p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="Tambah tujuan..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addGoal}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
          >
            Tambah
          </button>
        </div>
        <ul className="space-y-2">
          {settings.personalGoals.map((goal, i) => (
            <li
              key={`${goal}-${i}`}
              className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg"
            >
              <span className="text-sm text-gray-300">{goal}</span>
              <button
                type="button"
                onClick={() => removeGoal(i)}
                className="text-gray-600 hover:text-red-400 text-sm transition-colors"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
