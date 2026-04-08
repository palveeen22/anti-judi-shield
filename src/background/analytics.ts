import { recordBlock } from "@/shared/utils/storage";
import { addDomainToBlacklist } from "./blocker";

export function setupAnalytics(): void {
  if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
      const url = info.request.url;
      try {
        const domain = new URL(url).hostname;
        recordBlock(domain);
      } catch {
        recordBlock("unknown");
      }
    });
  }
}

export async function recordContentBlock(
  url: string,
  score: number,
  matches: string[],
  confidence?: "low" | "medium" | "high",
  detectionMethods?: string[],
): Promise<void> {
  try {
    const domain = new URL(url).hostname;
    await recordBlock(domain);

    // Auto-blacklist domains detected with high confidence
    if (confidence === "high" && score >= 30) {
      await addDomainToBlacklist(domain);
      console.log(
        `[Anti-Judi Shield] Auto-blacklisted: ${domain} (confidence: ${confidence}, score: ${score})`,
      );
    }

    const methods = detectionMethods?.join(", ") ?? "keywords";
    console.log(
      `[Anti-Judi Shield] Content blocked on ${domain} ` +
      `(score: ${score}, confidence: ${confidence ?? "unknown"}, ` +
      `methods: ${methods}, matches: ${matches.join(", ")})`,
    );
  } catch {
    // Ignore URL parse errors
  }
}
