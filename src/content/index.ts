import { runDetection } from "./scoring";
import { blurElements } from "./blur";
import { showWarningOverlay } from "./overlay";
import { removeGamblingAds } from "./ad-filter";
import { blockGamblingImages } from "./image-blocker";

let hasScanned = false;

async function sendMessageSafe<T>(
  message: { type: string; data: unknown },
): Promise<T | null> {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch {
    return null;
  }
}

async function init(): Promise<void> {
  if (hasScanned) return;
  hasScanned = true;

  if (location.protocol === "chrome-extension:") return;

  const status = await sendMessageSafe<{ active: boolean }>(
    { type: "GET_PROTECTION_STATUS", data: undefined },
  );
  if (status && !status.active) return;

  // 1. Remove gambling ads
  const adsRemoved = removeGamblingAds();
  if (adsRemoved > 0) {
    console.log(`[Anti-Judi Shield] Removed ${adsRemoved} gambling ads`);
  }

  // 2. Block gambling images
  const imagesBlocked = blockGamblingImages();
  if (imagesBlocked > 0) {
    console.log(`[Anti-Judi Shield] Blocked ${imagesBlocked} gambling images`);
  }

  // 3. Run AI-powered detection (keywords + structural analysis)
  const result = runDetection();

  if (result.isGambling) {
    blurElements(result.elements);
    showWarningOverlay(result.matches.length, result.finalScore);

    sendMessageSafe({
      type: "REPORT_GAMBLING_CONTENT",
      data: {
        url: window.location.href,
        score: result.finalScore,
        matches: result.matches,
        confidence: result.confidence,
        detectionMethods: result.analyzers
          .filter((a) => a.score > 0)
          .map((a) => a.name),
      },
    });

    const methods = result.analyzers
      .filter((a) => a.score > 0)
      .map((a) => `${a.name}(+${a.score})`)
      .join(", ");

    console.log(
      `[Anti-Judi Shield] GAMBLING DETECTED [${result.confidence}] ` +
      `score=${result.finalScore} (kw=${result.keywordScore} struct=${result.structuralScore}) ` +
      `analyzers: ${methods}`,
    );
  }

  // 4. Watch for dynamic content
  setupMutationObserver();
}

function setupMutationObserver(): void {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      removeGamblingAds();
      blockGamblingImages();

      // Re-run full detection on significant DOM changes
      const result = runDetection();
      if (result.isGambling && result.elements.length > 0) {
        blurElements(result.elements);
      }
    }, 300);
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

init();
