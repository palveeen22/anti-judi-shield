import type { AnalyzerResult } from "@/shared/types/detection";
import { STATIC_DOMAINS } from "@/shared/constants/blacklist";

const GAMBLING_ANCHOR_TERMS = [
  "slot", "judi", "togel", "casino", "gacor", "maxwin", "poker",
  "bandar", "toto", "betting", "gambling", "daftar", "deposit",
  "freebet", "sbobet", "1xbet", "bet365", "roulette", "blackjack",
  "jackpot", "scatter", "pragmatic", "bonus", "rtp",
];

const GAMBLING_DOMAIN_TERMS = [
  "slot", "judi", "togel", "casino", "gacor", "maxwin", "poker",
  "bandar", "toto", "bet", "gambling", "sbobet", "1xbet",
];

export function analyzeLinks(): AnalyzerResult {
  const result: AnalyzerResult = { name: "links", score: 0, signals: [] };

  const links = document.querySelectorAll<HTMLAnchorElement>("a[href]");
  const currentHost = location.hostname;

  let gamblingAnchorLinks = 0;
  let gamblingDomainLinks = 0;
  let hasWhatsappTelegram = false;
  const externalGamblingDomains = new Set<string>();

  for (const link of links) {
    const href = link.href?.toLowerCase() ?? "";
    const anchor = link.textContent?.toLowerCase() ?? "";

    // Skip internal links
    try {
      const url = new URL(href);
      if (url.hostname === currentHost) continue;

      // Check if external domain is gambling-related
      const domain = url.hostname;
      if (
        STATIC_DOMAINS.includes(domain) ||
        GAMBLING_DOMAIN_TERMS.some((t) => domain.includes(t))
      ) {
        gamblingDomainLinks++;
        externalGamblingDomains.add(domain);
      }

      // WhatsApp / Telegram links
      if (
        domain.includes("wa.me") ||
        domain.includes("whatsapp.com") ||
        domain.includes("t.me") ||
        domain.includes("telegram") ||
        href.includes("api.whatsapp.com")
      ) {
        hasWhatsappTelegram = true;
      }
    } catch {
      // Invalid URL
    }

    // Check anchor text
    const anchorMatches = GAMBLING_ANCHOR_TERMS.filter((t) => anchor.includes(t));
    if (anchorMatches.length >= 1) {
      gamblingAnchorLinks++;
    }
  }

  // Score: external links with gambling anchors
  if (gamblingAnchorLinks >= 5) {
    result.score += 10;
    result.signals.push(`${gamblingAnchorLinks} link dengan anchor text judi`);
  } else if (gamblingAnchorLinks >= 3) {
    result.score += 5;
    result.signals.push(`${gamblingAnchorLinks} link dengan anchor text judi`);
  }

  // Score: distinct gambling domains
  if (externalGamblingDomains.size >= 10) {
    result.score += 12;
    result.signals.push(`${externalGamblingDomains.size} domain judi berbeda ditemukan`);
  } else if (externalGamblingDomains.size >= 5) {
    result.score += 8;
    result.signals.push(`${externalGamblingDomains.size} domain judi berbeda ditemukan`);
  }

  // Score: WhatsApp/Telegram + gambling content
  if (hasWhatsappTelegram && gamblingAnchorLinks >= 2) {
    result.score += 6;
    result.signals.push("Link WhatsApp/Telegram ditemukan bersamaan dengan konten judi");
  }

  // Score: footer/sidebar gambling link density
  const footer = document.querySelector("footer") ?? document.querySelector('[class*="footer"]');
  if (footer) {
    const footerLinks = footer.querySelectorAll<HTMLAnchorElement>("a[href]");
    let footerGambling = 0;
    for (const fl of footerLinks) {
      const text = (fl.textContent ?? "").toLowerCase();
      if (GAMBLING_ANCHOR_TERMS.some((t) => text.includes(t))) {
        footerGambling++;
      }
    }
    if (footerGambling >= 20) {
      result.score += 8;
      result.signals.push(`Footer mengandung ${footerGambling} link judi`);
    }
  }

  return result;
}
