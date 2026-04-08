import type { AnalyzerResult } from "@/shared/types/detection";

const GAMBLING_META_TERMS = [
  "slot", "judi", "togel", "casino", "gacor", "maxwin", "pragmatic",
  "sbobet", "poker", "bandar", "toto", "deposit", "freebet", "scatter",
  "betting", "gambling", "roulette", "blackjack", "baccarat", "1xbet",
  "bet365", "betway", "jackpot", "rtp live", "slot gacor", "link alternatif",
  "bonus new member", "daftar slot", "situs judi",
];

export function analyzeMeta(): AnalyzerResult {
  const result: AnalyzerResult = { name: "meta", score: 0, signals: [] };

  const title = document.title?.toLowerCase() ?? "";
  const metaDesc = getMetaContent("description");
  const metaKeywords = getMetaContent("keywords");
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "";
  const ogTitle = getMetaProperty("og:title");
  const ogDesc = getMetaProperty("og:description");
  const ogImage = getMetaProperty("og:image");

  // Title contains gambling keywords
  const titleMatches = countGamblingTerms(title);
  if (titleMatches >= 2) {
    result.score += 8;
    result.signals.push(`Title mengandung ${titleMatches} kata kunci judi`);
  }

  // Meta description
  const descMatches = countGamblingTerms(metaDesc);
  if (descMatches >= 2) {
    result.score += 6;
    result.signals.push(`Meta description mengandung ${descMatches} kata kunci judi`);
  }

  // Meta keywords stuffed
  const kwMatches = countGamblingTerms(metaKeywords);
  if (kwMatches >= 3) {
    result.score += 10;
    result.signals.push(`Meta keywords berisi ${kwMatches} kata kunci judi (keyword stuffing)`);
  }

  // Canonical URL points to gambling domain
  if (canonical && isGamblingUrl(canonical)) {
    result.score += 12;
    result.signals.push(`Canonical URL mengarah ke domain judi: ${canonical}`);
  }

  // OG tags
  const ogMatches = countGamblingTerms(`${ogTitle} ${ogDesc}`);
  if (ogMatches >= 2) {
    result.score += 5;
    result.signals.push(`OG tags mengandung konten judi`);
  }

  // OG image URL
  if (ogImage && isGamblingUrl(ogImage)) {
    result.score += 5;
    result.signals.push(`OG image mengarah ke konten judi`);
  }

  return result;
}

function getMetaContent(name: string): string {
  return (
    document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content?.toLowerCase() ?? ""
  );
}

function getMetaProperty(property: string): string {
  return (
    document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)?.content?.toLowerCase() ?? ""
  );
}

function countGamblingTerms(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return GAMBLING_META_TERMS.filter((term) => lower.includes(term)).length;
}

function isGamblingUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return GAMBLING_META_TERMS.some((term) => lower.includes(term));
}
