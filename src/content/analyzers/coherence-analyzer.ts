import type { AnalyzerResult } from "@/shared/types/detection";

// TLDs and domain patterns that indicate institutional/legitimate sites
const INSTITUTIONAL_TLDS = [
  ".ac.id", ".edu", ".edu.au", ".edu.br", ".edu.cn", ".edu.mx",
  ".go.id", ".gov", ".gov.au", ".gov.br", ".gov.uk", ".gov.cn",
  ".mil", ".mil.id",
  ".or.id", ".org",
  ".sch.id",
  ".ac.uk", ".ac.jp",
  ".university", ".school", ".college",
];

// Domain name patterns that suggest non-gambling sites
const LEGITIMATE_DOMAIN_PATTERNS = [
  /university|universitas|univ/i,
  /school|sekolah|akademi/i,
  /hospital|rumahsakit|klinik|clinic/i,
  /church|gereja|mosque|masjid/i,
  /museum|library|perpustakaan/i,
  /restaurant|cafe|bakery|pizza|food|cuisine/i,
  /hotel|resort|travel/i,
  /dental|medical|health|kesehatan/i,
  /law|hukum|attorney|lawyer/i,
  /auto|tire|mechanic|repair/i,
  /plumbing|electric|construction/i,
  /news|berita|media|press/i,
  /foundation|yayasan/i,
  /association|asosiasi|perkumpulan/i,
  /institute|institut|lembaga/i,
  /government|pemerintah|kementerian/i,
  /council|dewan|komisi/i,
];

export function analyzeCoherence(keywordScore: number): AnalyzerResult {
  const result: AnalyzerResult = { name: "coherence", score: 0, signals: [] };

  // Only run if there's some gambling signal from keywords
  if (keywordScore < 3) return result;

  const hostname = location.hostname.toLowerCase();
  const domainCategory = classifyDomain(hostname);

  if (!domainCategory) return result;

  // Institutional domain + gambling content = very strong hijack signal
  if (domainCategory === "institutional") {
    if (keywordScore >= 10) {
      result.score += 20;
      result.signals.push(
        `Domain institusi (${hostname}) mengandung konten judi — kemungkinan situs diretas`,
      );
    } else if (keywordScore >= 5) {
      result.score += 15;
      result.signals.push(
        `Domain institusi (${hostname}) memiliki indikasi konten judi`,
      );
    }
  } else if (domainCategory === "organization") {
    if (keywordScore >= 10) {
      result.score += 15;
      result.signals.push(
        `Domain organisasi (${hostname}) mengandung konten judi — kemungkinan situs diretas`,
      );
    } else if (keywordScore >= 5) {
      result.score += 10;
      result.signals.push(
        `Domain organisasi (${hostname}) memiliki indikasi konten judi`,
      );
    }
  } else if (domainCategory === "legitimate-business") {
    if (keywordScore >= 10) {
      result.score += 10;
      result.signals.push(
        `Domain bisnis non-judi (${hostname}) mengandung konten judi — kemungkinan situs diretas`,
      );
    }
  }

  return result;
}

function classifyDomain(hostname: string): string | null {
  // Check TLD-based classification
  for (const tld of INSTITUTIONAL_TLDS) {
    if (hostname.endsWith(tld)) {
      if (tld.includes("gov") || tld.includes("mil")) return "institutional";
      if (tld.includes("edu") || tld.includes("ac.")) return "institutional";
      if (tld.includes("or.") || tld === ".org") return "organization";
      if (tld.includes("sch.")) return "institutional";
      return "institutional";
    }
  }

  // Check domain name patterns
  const domainWithoutTld = hostname.replace(/\.[^.]+$/, "").replace(/\./g, " ");
  for (const pattern of LEGITIMATE_DOMAIN_PATTERNS) {
    if (pattern.test(domainWithoutTld) || pattern.test(hostname)) {
      return "legitimate-business";
    }
  }

  return null;
}
