import type { AnalyzerResult } from "@/shared/types/detection";

const TEXT_GAMBLING_TERMS = [
  "slot", "judi", "togel", "casino", "gacor", "maxwin", "poker",
  "bandar", "toto", "betting", "gambling", "deposit", "freebet",
  "scatter", "pragmatic", "sbobet", "roulette", "jackpot", "rtp",
  "1xbet", "bet365", "daftar", "withdraw",
];

// Terms that tend to cluster together on gambling pages
const JARGON_CLUSTERS = [
  ["deposit", "dana", "slot"],
  ["deposit", "pulsa", "slot"],
  ["rtp", "live", "slot"],
  ["link", "alternatif", "slot"],
  ["bonus", "new", "member"],
  ["slot", "gacor", "hari"],
  ["bandar", "togel", "online"],
  ["daftar", "slot", "gacor"],
  ["scatter", "hitam", "slot"],
  ["server", "luar", "slot"],
  ["prediksi", "togel", "jitu"],
  ["mix", "parlay", "bola"],
  ["live", "casino", "online"],
  ["deposit", "withdraw", "slot"],
  ["bet", "casino", "bonus"],
  ["free", "spin", "slot"],
  ["sports", "betting", "online"],
];

export function analyzeText(pageText: string): AnalyzerResult {
  const result: AnalyzerResult = { name: "text", score: 0, signals: [] };

  if (!pageText || pageText.length < 50) return result;

  const lower = pageText.toLowerCase();
  const words = lower.split(/\s+/);
  const totalWords = words.length;

  if (totalWords < 10) return result;

  // Keyword density
  let gamblingWordCount = 0;
  for (const word of words) {
    if (TEXT_GAMBLING_TERMS.some((t) => word.includes(t))) {
      gamblingWordCount++;
    }
  }
  const density = gamblingWordCount / totalWords;
  if (density > 0.02) {
    result.score += 8;
    result.signals.push(
      `Kepadatan kata kunci judi: ${(density * 100).toFixed(1)}% (${gamblingWordCount}/${totalWords} kata)`,
    );
  }

  // Repetitive phrases
  for (const term of TEXT_GAMBLING_TERMS) {
    const regex = new RegExp(term, "gi");
    const matches = lower.match(regex);
    if (matches && matches.length >= 5) {
      result.score += 6;
      result.signals.push(`Kata "${term}" diulang ${matches.length} kali`);
      break; // Only count once
    }
  }

  // Jargon clustering (3+ gambling terms within 100 chars)
  let clusterFound = false;
  for (const cluster of JARGON_CLUSTERS) {
    // Find first term position
    const firstIdx = lower.indexOf(cluster[0]!);
    if (firstIdx === -1) continue;

    // Check if all terms appear within 100 chars of each other
    const window = lower.substring(firstIdx, firstIdx + 150);
    if (cluster.every((term) => window.includes(term))) {
      if (!clusterFound) {
        result.score += 8;
        clusterFound = true;
      }
      result.signals.push(`Kluster jargon ditemukan: "${cluster.join(" + ")}"`);
      if (result.signals.length >= 5) break; // Limit signal noise
    }
  }

  return result;
}
