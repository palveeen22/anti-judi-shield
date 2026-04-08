const GAMBLING_AD_KEYWORDS = [
  // Indonesian
  "slot", "judi", "togel", "casino", "gacor", "maxwin",
  "pragmatic", "sbobet", "poker", "bandar", "toto",
  "deposit", "freebet", "freechip", "scatter",
  // International
  "1xbet", "bet365", "betway", "888casino", "pokerstars",
  "draftkings", "fanduel", "gambling", "betting", "roulette",
  "blackjack", "baccarat", "sportsbook", "stake.com", "roobet",
  "bovada", "betonline", "livecasino", "sportbet",
];

export function removeGamblingAds(): number {
  let removed = 0;

  // Check iframes
  const iframes = document.querySelectorAll("iframe");
  for (const iframe of iframes) {
    const src = (iframe.src || iframe.getAttribute("data-src") || "").toLowerCase();
    if (GAMBLING_AD_KEYWORDS.some((k) => src.includes(k))) {
      iframe.remove();
      removed++;
    }
  }

  // Check ad containers
  const adSelectors = [
    'ins.adsbygoogle',
    'div[id*="google_ads"]',
    'div[class*="ad-container"]',
    'div[class*="ad-wrapper"]',
    'div[class*="advertisement"]',
    'div[data-ad]',
    'aside[class*="ad"]',
  ];

  for (const selector of adSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        const text = (el.textContent ?? "").toLowerCase();
        if (GAMBLING_AD_KEYWORDS.some((k) => text.includes(k))) {
          el.remove();
          removed++;
        }
      }
    } catch {
      // Ignore
    }
  }

  // Check links with gambling URLs
  const links = document.querySelectorAll("a[href]");
  for (const link of links) {
    const href = (link.getAttribute("href") ?? "").toLowerCase();
    const text = (link.textContent ?? "").toLowerCase();
    const combined = `${href} ${text}`;

    // Count keyword matches - need at least 2 for links
    const matchCount = GAMBLING_AD_KEYWORDS.filter((k) => combined.includes(k)).length;
    if (matchCount >= 2) {
      // Check if it's an ad-like element (banner, float, etc.)
      const parent = link.parentElement;
      const style = parent ? getComputedStyle(parent) : null;
      const isFloating = style && (style.position === "fixed" || style.position === "absolute");
      const isBanner = parent?.classList.toString().toLowerCase().match(/banner|popup|float|overlay|modal/);

      if (isFloating || isBanner) {
        (parent ?? link).remove();
        removed++;
      }
    }
  }

  // YouTube-specific: gambling ads
  if (window.location.hostname.includes("youtube.com")) {
    removed += filterYouTubeGamblingAds();
  }

  return removed;
}

function filterYouTubeGamblingAds(): number {
  let removed = 0;

  const adSelectors = [
    "#player-ads",
    ".ytp-ad-overlay-container",
    ".ytp-ad-text-overlay",
    'div[id^="masthead-ad"]',
    ".ytd-promoted-sparkles-web-renderer",
    ".ytd-display-ad-renderer",
    "ytd-promoted-video-renderer",
  ];

  for (const selector of adSelectors) {
    try {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        const text = (el.textContent ?? "").toLowerCase();
        if (GAMBLING_AD_KEYWORDS.some((k) => text.includes(k))) {
          el.remove();
          removed++;
        }
      }
    } catch {
      // Ignore
    }
  }

  return removed;
}
