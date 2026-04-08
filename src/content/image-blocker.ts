import { GAMBLING_IMAGE_KEYWORDS } from "@/shared/constants/blacklist";
import { STATIC_DOMAINS } from "@/shared/constants/blacklist";

const BLOCKED_STYLE = "anti-judi-img-blocked";
const STYLE_ID = "anti-judi-img-block-styles";

function injectBlockStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .${BLOCKED_STYLE} {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

export function blockGamblingImages(): number {
  let blocked = 0;

  // Block <img> tags with gambling-related src or alt
  const images = document.querySelectorAll<HTMLImageElement>("img");
  for (const img of images) {
    if (img.classList.contains(BLOCKED_STYLE)) continue;

    const src = (img.src || img.getAttribute("data-src") || "").toLowerCase();
    const alt = (img.alt || "").toLowerCase();
    const title = (img.title || "").toLowerCase();
    const combined = `${src} ${alt} ${title}`;

    if (isGamblingImage(combined, src)) {
      hideElement(img);
      blocked++;
    }
  }

  // Block <picture> and <source> with gambling content
  const pictures = document.querySelectorAll("picture");
  for (const pic of pictures) {
    const sources = pic.querySelectorAll("source");
    for (const source of sources) {
      const srcset = (source.srcset || "").toLowerCase();
      if (isGamblingImage(srcset, srcset)) {
        hideElement(pic);
        blocked++;
        break;
      }
    }
  }

  // Block background images via inline styles
  const elementsWithBg = document.querySelectorAll<HTMLElement>(
    '[style*="background"]',
  );
  for (const el of elementsWithBg) {
    const bgStyle = el.style.backgroundImage?.toLowerCase() ?? "";
    if (bgStyle && isGamblingImage(bgStyle, bgStyle)) {
      el.style.backgroundImage = "none";
      blocked++;
    }
  }

  // Block SVG/canvas containers wrapping gambling ads
  const svgContainers = document.querySelectorAll("svg, canvas");
  for (const svg of svgContainers) {
    const parent = svg.parentElement;
    if (!parent) continue;
    const parentText = (parent.textContent ?? "").toLowerCase();
    const parentHref = parent.closest("a")?.href?.toLowerCase() ?? "";
    if (isGamblingImage(`${parentText} ${parentHref}`, parentHref)) {
      hideElement(parent);
      blocked++;
    }
  }

  // Block video/embed ads
  const media = document.querySelectorAll("video, embed, object");
  for (const m of media) {
    const src = (
      m.getAttribute("src") ||
      m.getAttribute("data") ||
      ""
    ).toLowerCase();
    if (isGamblingImage(src, src)) {
      hideElement(m as HTMLElement);
      blocked++;
    }
  }

  return blocked;
}

function isGamblingImage(text: string, url: string): boolean {
  // Check URL against known gambling domains
  if (url) {
    try {
      const urlObj = new URL(url, location.href);
      const hostname = urlObj.hostname.toLowerCase();
      if (STATIC_DOMAINS.includes(hostname)) return true;
    } catch {
      // Not a valid URL
    }
  }

  // Check against gambling image keywords
  const keywordMatches = GAMBLING_IMAGE_KEYWORDS.filter((kw) =>
    text.includes(kw),
  );

  // Need 2+ keyword matches to avoid false positives
  // (a single "bonus" or "jackpot" could appear on legitimate sites)
  return keywordMatches.length >= 2;
}

function hideElement(el: Element): void {
  injectBlockStyles();
  el.classList.add(BLOCKED_STYLE);
}
