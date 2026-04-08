import { useState } from "react";
import type { UserSettings } from "@/shared/types";

interface Props {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
}

export function AccountabilitySettings({ settings, onUpdate }: Props) {
  const [email, setEmail] = useState(settings.accountabilityEmail ?? "");

  const saveEmail = () => {
    const trimmed = email.trim();
    onUpdate({
      accountabilityEmail: trimmed || null,
    });
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-2">Accountability Partner</h3>
      <p className="text-sm text-gray-400 mb-4">
        Pilih seseorang yang kamu percaya. Mereka akan diberi tahu jika kamu
        mencoba menonaktifkan perlindungan.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-1">
            Email Partner
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
            <button
              type="button"
              onClick={saveEmail}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>

        {settings.accountabilityEmail && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
            <span className="text-green-400">✓</span>
            <span className="text-sm text-green-300">
              Partner aktif: {settings.accountabilityEmail}
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail("");
                onUpdate({ accountabilityEmail: null });
              }}
              className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Hapus
            </button>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-2">
          Notifikasi saat ini bersifat lokal. Integrasi email/WhatsApp akan
          tersedia di versi mendatang.
        </div>
      </div>
    </div>
  );
}
