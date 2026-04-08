import { GAMBLING_PHRASES, DETECTION_THRESHOLD, MIN_PHRASE_MATCHES } from "@/shared/constants/keywords";

export interface ScanResult {
  isGambling: boolean;
  score: number;
  matches: string[];
  elements: Element[];
}

export function scanPage(): ScanResult {
  const bodyText = document.body?.innerText?.toLowerCase() ?? "";
  return scanText(bodyText);
}

export function scanText(text: string): ScanResult {
  const normalizedText = text.toLowerCase();
  let totalScore = 0;
  const matches: string[] = [];

  for (const { phrase, weight } of GAMBLING_PHRASES) {
    if (normalizedText.includes(phrase.toLowerCase())) {
      totalScore += weight;
      matches.push(phrase);
    }
  }

  return {
    isGambling: totalScore >= DETECTION_THRESHOLD && matches.length >= MIN_PHRASE_MATCHES,
    score: totalScore,
    matches,
    elements: [],
  };
}

export function scanElement(element: Element): ScanResult {
  const text = (element.textContent ?? "").toLowerCase();
  const result = scanText(text);

  if (result.isGambling) {
    result.elements = [element];
  }

  return result;
}

export function findGamblingElements(): Element[] {
  const suspiciousSelectors = [
    "iframe",
    'a[href*="slot"]',
    'a[href*="judi"]',
    'a[href*="togel"]',
    'a[href*="casino"]',
    'a[href*="gacor"]',
    'a[href*="maxwin"]',
    'div[class*="banner"]',
    'div[class*="popup"]',
    'div[class*="modal"]',
    'ins.adsbygoogle',
    'div[id*="ad"]',
    'div[class*="ad-"]',
    'div[class*="ads"]',
  ];

  const elements: Element[] = [];

  for (const selector of suspiciousSelectors) {
    try {
      const found = document.querySelectorAll(selector);
      for (const el of found) {
        const text = (el.textContent ?? "").toLowerCase();
        const href = el.getAttribute("href") ?? "";
        const src = el.getAttribute("src") ?? "";

        const combined = `${text} ${href} ${src}`;
        const result = scanText(combined);

        if (result.isGambling || hasGamblingLink(href) || hasGamblingLink(src)) {
          elements.push(el);
        }
      }
    } catch {
      // Ignore invalid selectors
    }
  }

  return elements;
}

function hasGamblingLink(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  const keywords = [
    "slot", "judi", "togel", "casino", "gacor", "maxwin",
    "pragmatic", "sbobet", "poker", "bandar", "toto",
  ];
  return keywords.some((k) => lower.includes(k));
}
