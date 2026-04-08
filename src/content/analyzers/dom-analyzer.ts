import type { AnalyzerResult } from "@/shared/types/detection";

const DOM_GAMBLING_TERMS = [
  "slot", "judi", "togel", "casino", "gacor", "maxwin", "poker",
  "bandar", "toto", "betting", "gambling", "deposit", "freebet",
  "scatter", "pragmatic", "sbobet", "1xbet", "roulette", "jackpot",
  "daftar", "bonus", "rtp",
];

const FORM_GAMBLING_LABELS = [
  "deposit", "withdraw", "bank", "rekening", "username", "user id",
  "nominal", "jumlah", "transfer", "e-wallet", "dana", "ovo", "gopay",
];

export function analyzeDOM(): AnalyzerResult {
  const result: AnalyzerResult = { name: "dom", score: 0, signals: [] };

  // Heading tags with gambling content
  let gamblingHeadings = 0;
  const headings = document.querySelectorAll("h1, h2, h3");
  for (const h of headings) {
    const text = (h.textContent ?? "").toLowerCase();
    const matches = DOM_GAMBLING_TERMS.filter((t) => text.includes(t));
    if (matches.length >= 1) {
      gamblingHeadings++;
    }
  }
  if (gamblingHeadings >= 3) {
    result.score += 8;
    result.signals.push(`${gamblingHeadings} heading (H1-H3) mengandung kata kunci judi`);
  }

  // Hidden elements with gambling text (SEO cloaking)
  let hiddenGambling = 0;
  const allElements = document.querySelectorAll("div, span, p, section");
  for (const el of allElements) {
    const style = (el as HTMLElement).style;
    const computedDisplay = style?.display;
    const computedVisibility = style?.visibility;
    const hasHidden =
      computedDisplay === "none" ||
      computedVisibility === "hidden" ||
      el.hasAttribute("hidden") ||
      (el as HTMLElement).offsetHeight === 0;

    if (hasHidden) {
      const text = (el.textContent ?? "").toLowerCase();
      const matches = DOM_GAMBLING_TERMS.filter((t) => text.includes(t));
      if (matches.length >= 3) {
        hiddenGambling++;
      }
    }

    // Limit iterations for performance
    if (hiddenGambling >= 3) break;
  }
  if (hiddenGambling >= 1) {
    result.score += 10;
    result.signals.push(`${hiddenGambling} elemen tersembunyi mengandung konten judi (cloaking)`);
  }

  // Iframes pointing to gambling domains
  const iframes = document.querySelectorAll("iframe");
  let gamblingIframes = 0;
  for (const iframe of iframes) {
    const src = (iframe.src || iframe.getAttribute("data-src") || "").toLowerCase();
    if (DOM_GAMBLING_TERMS.some((t) => src.includes(t))) {
      gamblingIframes++;
    }
  }
  if (gamblingIframes >= 1) {
    result.score += 10;
    result.signals.push(`${gamblingIframes} iframe mengarah ke domain judi`);
  }

  // Marquee tags (classic Indonesian gambling site pattern)
  const marquees = document.querySelectorAll("marquee");
  for (const m of marquees) {
    const text = (m.textContent ?? "").toLowerCase();
    if (DOM_GAMBLING_TERMS.some((t) => text.includes(t))) {
      result.score += 6;
      result.signals.push("Tag <marquee> dengan konten judi ditemukan");
      break;
    }
  }

  // Forms with gambling-related labels
  const forms = document.querySelectorAll("form");
  for (const form of forms) {
    const formText = (form.textContent ?? "").toLowerCase();
    const inputs = form.querySelectorAll("input, select, textarea");
    let gamblingInputs = 0;

    for (const input of inputs) {
      const placeholder = (input.getAttribute("placeholder") ?? "").toLowerCase();
      const label = (input.getAttribute("aria-label") ?? "").toLowerCase();
      const name = (input.getAttribute("name") ?? "").toLowerCase();
      const combined = `${placeholder} ${label} ${name}`;
      if (FORM_GAMBLING_LABELS.some((t) => combined.includes(t))) {
        gamblingInputs++;
      }
    }

    if (gamblingInputs >= 2 && DOM_GAMBLING_TERMS.some((t) => formText.includes(t))) {
      result.score += 5;
      result.signals.push("Form dengan input terkait judi ditemukan");
      break;
    }
  }

  return result;
}
