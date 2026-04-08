import { useState } from "react";
import { sendMessage } from "@/shared/utils/messaging";
import { hashPassword } from "@/shared/utils/hash";

type Step = "welcome" | "goals" | "strict" | "done";

export function Onboarding() {
  const [step, setStep] = useState<Step>("welcome");
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [enableStrict, setEnableStrict] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const addGoal = () => {
    if (!goalInput.trim()) return;
    setGoals((prev) => [...prev, goalInput.trim()]);
    setGoalInput("");
  };

  const removeGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const finish = async () => {
    setError("");

    const updates: Record<string, unknown> = {
      personalGoals: goals,
      onboardingCompleted: true,
      protectionEnabled: true,
    };

    if (enableStrict) {
      if (!password || password.length < 6) {
        setError("Password minimal 6 karakter");
        return;
      }
      if (password !== confirmPassword) {
        setError("Password tidak cocok");
        return;
      }
      const { hash, salt } = await hashPassword(password);
      updates.strictMode = true;
      updates.passwordHash = hash;
      updates.passwordSalt = salt;
    }

    if (email.trim()) {
      updates.accountabilityEmail = email.trim();
    }

    await sendMessage("UPDATE_SETTINGS", updates);
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {step === "welcome" && (
          <div className="text-center">
            <div className="text-8xl mb-6">🛡️</div>
            <h1 className="text-3xl font-bold mb-3">Anti-Judi Shield</h1>
            <p className="text-gray-400 mb-2">
              Perlindungan Digital dari Judi Online
            </p>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Extension ini akan memblokirmu dari situs judi online, mendeteksi
              konten judi di halaman web, dan membantumu membangun kebiasaan
              yang lebih baik.
            </p>
            <button
              type="button"
              onClick={() => setStep("goals")}
              className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-2xl text-lg font-bold transition-colors"
            >
              Mulai Setup
            </button>
          </div>
        )}

        {step === "goals" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Tujuanmu</h2>
            <p className="text-sm text-gray-400 mb-6">
              Apa alasanmu ingin berhenti dari judi? Tuliskan tujuanmu sebagai
              pengingat.
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                placeholder="contoh: Menabung untuk masa depan"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={addGoal}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-sm font-medium transition-colors"
              >
                +
              </button>
            </div>

            {goals.length > 0 && (
              <ul className="space-y-2 mb-6">
                {goals.map((goal, i) => (
                  <li
                    key={`${goal}-${i}`}
                    className="flex items-center justify-between py-2.5 px-4 bg-white/5 rounded-xl"
                  >
                    <span className="text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✦</span>
                      {goal}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGoal(i)}
                      className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-xs text-gray-600 mb-6">
              Tujuanmu akan ditampilkan setiap kali situs judi diblokir.
            </div>

            <button
              type="button"
              onClick={() => setStep("strict")}
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 rounded-xl text-base font-bold transition-colors"
            >
              Lanjut
            </button>
          </div>
        )}

        {step === "strict" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Perlindungan Ekstra</h2>
            <p className="text-sm text-gray-400 mb-6">
              Opsional: Aktifkan fitur tambahan untuk perlindungan yang lebih
              kuat.
            </p>

            {/* Strict mode */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium">Mode Ketat</h3>
                  <p className="text-xs text-gray-500">
                    Butuh password untuk menonaktifkan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableStrict(!enableStrict)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enableStrict ? "bg-red-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      enableStrict ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {enableStrict && (
                <div className="space-y-2 mt-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat password (min 6 karakter)..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>

            {/* Accountability partner */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-medium mb-1">
                Accountability Partner
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Opsional: Seseorang yang diberitahu jika kamu coba
                menonaktifkan.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email partner (opsional)"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              type="button"
              onClick={finish}
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 rounded-xl text-base font-bold transition-colors"
            >
              Aktifkan Perlindungan
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="text-2xl font-bold mb-3">Perlindungan Aktif!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Anti-Judi Shield sekarang melindungimu. Situs judi akan diblokir
              secara otomatis dan konten judi di halaman web akan disamarkan.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => chrome.runtime.openOptionsPage()}
                className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-medium transition-colors"
              >
                Buka Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.close()}
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Step indicator */}
        {step !== "done" && (
          <div className="flex justify-center gap-2 mt-8">
            {(["welcome", "goals", "strict"] as Step[]).map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s === step ? "bg-green-500" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
