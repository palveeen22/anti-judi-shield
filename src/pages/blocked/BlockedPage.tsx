import { useCallback, useEffect, useState } from "react";
import { CountdownTimer } from "./components/CountdownTimer";
import { MotivationalQuote } from "./components/MotivationalQuote";
import { RiskFact } from "./components/RiskFact";
import { sendMessage } from "@/shared/utils/messaging";

const REASON_LABELS: Record<string, string> = {
  domain_blacklist: "Domain ini terdaftar dalam daftar hitam situs judi",
  suspicious_domain: "Domain ini memiliki pola yang mencurigakan",
  url_keywords: "URL mengandung kata kunci terkait judi",
  custom_blacklist: "Domain ini ada di daftar blokir kamu",
  content_detection: "Konten halaman terdeteksi mengandung judi",
};

export function BlockedPage() {
  const [countdown, setCountdown] = useState(7);
  const [canProceed, setCanProceed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);

  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason") ?? "domain_blacklist";
  const blockedUrl = params.get("url") ?? "";

  useEffect(() => {
    // Load user goals
    sendMessage("GET_SETTINGS", undefined)
      .then((settings) => {
        setGoals(settings.personalGoals);
        setCountdown(settings.countdownDuration);
      })
      .catch(() => {});
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "about:blank";
    }
  }, []);

  const handleProceed = useCallback(async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    // Log bypass attempt
    try {
      await sendMessage("BYPASS_ATTEMPT", { url: blockedUrl });
    } catch {
      // Background might not be ready
    }

    // Redirect to original URL (bypasses DNR for this navigation)
    window.location.href = blockedUrl;
  }, [showConfirm, blockedUrl]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Shield icon and warning */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🛡️</div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">
            Situs Diblokir
          </h1>
          <p className="text-gray-400 text-sm">
            Anti-Judi Shield melindungimu
          </p>
        </div>

        {/* Reason card */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <h2 className="font-semibold text-red-300 mb-1">
                Situs Terindikasi Judi Online
              </h2>
              <p className="text-sm text-gray-400">
                {REASON_LABELS[reason] ?? "Situs ini diblokir oleh Anti-Judi Shield"}
              </p>
              {blockedUrl && (
                <p className="text-xs text-gray-600 mt-2 break-all font-mono">
                  {blockedUrl}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <MotivationalQuote />

        {/* Risk fact */}
        <RiskFact />

        {/* Personal goals */}
        {goals.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-blue-300 mb-3">
              Ingat Tujuanmu:
            </h3>
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <span className="text-blue-400">✦</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-2xl text-lg font-bold transition-colors"
          >
            ← Kembali ke Halaman Aman
          </button>

          {/* Countdown / proceed */}
          <CountdownTimer
            duration={countdown}
            onComplete={() => setCanProceed(true)}
          />

          {canProceed && !showConfirm && (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-2.5 bg-transparent border border-gray-700 hover:border-gray-500 rounded-xl text-xs text-gray-500 transition-colors"
            >
              Saya memahami risikonya, lanjutkan
            </button>
          )}

          {showConfirm && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
              <p className="text-sm text-red-300 mb-3">
                Apakah kamu yakin? Tindakan ini akan dicatat.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleProceed}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Ya, Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
                >
                  Tidak, Kembali
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          Anti-Judi Shield — Perlindungan Digital dari Judi Online
        </p>
      </div>
    </div>
  );
}
