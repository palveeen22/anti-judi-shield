import { STATIC_DOMAINS, SUSPICIOUS_PATTERNS, URL_KEYWORD_PATTERNS } from "@/shared/constants/blacklist";

export function isDomainBlocked(
  hostname: string,
  customBlacklist: string[] = [],
  customWhitelist: string[] = [],
): boolean {
  const domain = hostname.toLowerCase().replace(/^www\./, "");

  // Check whitelist first
  if (customWhitelist.some((w) => domain === w || domain.endsWith(`.${w}`))) {
    return false;
  }

  // Check static blacklist
  if (STATIC_DOMAINS.includes(domain)) {
    return true;
  }

  // Check custom blacklist
  if (customBlacklist.includes(domain)) {
    return true;
  }

  // Check suspicious patterns
  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(domain))) {
    return true;
  }

  return false;
}

export function hasGamblingUrlKeywords(url: string): boolean {
  return URL_KEYWORD_PATTERNS.some((pattern) => pattern.test(url));
}

export function getBlockReason(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase().replace(/^www\./, "");

    if (STATIC_DOMAINS.includes(domain)) {
      return "domain_blacklist";
    }

    if (SUSPICIOUS_PATTERNS.some((p) => p.test(domain))) {
      return "suspicious_domain";
    }

    if (URL_KEYWORD_PATTERNS.some((p) => p.test(url))) {
      return "url_keywords";
    }

    return null;
  } catch {
    return null;
  }
}
