import { useState } from "react";
import { sendMessage } from "@/shared/utils/messaging";
import type { UserSettings } from "@/shared/types";

interface Props {
  settings: UserSettings;
}

export function BlacklistManager({ settings }: Props) {
  const [domain, setDomain] = useState("");
  const [customList, setCustomList] = useState(settings.customBlacklist);
  const [whiteList, setWhiteList] = useState(settings.customWhitelist);
  const [whitelistInput, setWhitelistInput] = useState("");
  const [activeTab, setActiveTab] = useState<"blacklist" | "whitelist">("blacklist");

  const addToBlacklist = async () => {
    const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!trimmed) return;

    const result = await sendMessage("ADD_TO_BLACKLIST", { domain: trimmed });
    if (result.success) {
      setCustomList((prev) => [...prev, trimmed]);
      setDomain("");
    }
  };

  const removeFromBlacklist = async (d: string) => {
    await sendMessage("REMOVE_FROM_BLACKLIST", { domain: d });
    setCustomList((prev) => prev.filter((item) => item !== d));
  };

  const addToWhitelist = async () => {
    const trimmed = whitelistInput.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!trimmed) return;

    const newList = [...whiteList, trimmed];
    setWhiteList(newList);
    setWhitelistInput("");
    await sendMessage("UPDATE_SETTINGS", { customWhitelist: newList });
  };

  const removeFromWhitelist = async (d: string) => {
    const newList = whiteList.filter((item) => item !== d);
    setWhiteList(newList);
    await sendMessage("UPDATE_SETTINGS", { customWhitelist: newList });
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("blacklist")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "blacklist"
              ? "bg-red-500/20 text-red-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Daftar Blokir ({customList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("whitelist")}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "whitelist"
              ? "bg-green-500/20 text-green-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Daftar Putih ({whiteList.length})
        </button>
      </div>

      {activeTab === "blacklist" && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToBlacklist()}
              placeholder="contoh: situsJudi.com"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={addToBlacklist}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
            >
              Blokir
            </button>
          </div>
          <DomainList
            domains={customList}
            onRemove={removeFromBlacklist}
            emptyText="Belum ada domain dalam daftar blokir kustom"
            removeLabel="Hapus"
          />
        </>
      )}

      {activeTab === "whitelist" && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={whitelistInput}
              onChange={(e) => setWhitelistInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToWhitelist()}
              placeholder="contoh: news.detik.com"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
            <button
              type="button"
              onClick={addToWhitelist}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
            >
              Izinkan
            </button>
          </div>
          <DomainList
            domains={whiteList}
            onRemove={removeFromWhitelist}
            emptyText="Belum ada domain dalam daftar putih"
            removeLabel="Hapus"
          />
        </>
      )}
    </div>
  );
}

function DomainList({
  domains,
  onRemove,
  emptyText,
  removeLabel,
}: {
  domains: string[];
  onRemove: (d: string) => void;
  emptyText: string;
  removeLabel: string;
}) {
  if (domains.length === 0) {
    return <p className="text-gray-500 text-sm">{emptyText}</p>;
  }

  return (
    <div className="space-y-1 max-h-60 overflow-y-auto">
      {domains.map((d) => (
        <div
          key={d}
          className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg"
        >
          <span className="text-sm text-gray-300 font-mono">{d}</span>
          <button
            type="button"
            onClick={() => onRemove(d)}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            {removeLabel}
          </button>
        </div>
      ))}
    </div>
  );
}
