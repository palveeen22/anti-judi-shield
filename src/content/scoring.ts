import type { AnalyzerResult, DetectionResult } from "@/shared/types/detection";
import {
  SUSPICION_THRESHOLD,
  HIGH_CONFIDENCE_THRESHOLD,
} from "@/shared/types/detection";
import { DETECTION_THRESHOLD } from "@/shared/constants/keywords";
import { scanPage, findGamblingElements } from "./scanner";
import {
  analyzeMeta,
  analyzeLinks,
  analyzeDOM,
  analyzeText,
  analyzeCoherence,
} from "./analyzers";

export function runDetection(): DetectionResult {
  // Layer 1: Fast keyword scan
  const keywordResult = scanPage();
  const analyzers: AnalyzerResult[] = [];

  // Fast path: no gambling signal at all
  if (
    keywordResult.score < SUSPICION_THRESHOLD &&
    keywordResult.matches.length === 0
  ) {
    return {
      keywordScore: keywordResult.score,
      structuralScore: 0,
      finalScore: keywordResult.score,
      isGambling: false,
      confidence: "low",
      analyzers: [],
      matches: keywordResult.matches,
      elements: [],
    };
  }

  // Layer 2: Structural analysis (only on suspicious pages)
  let structuralScore = 0;

  // Meta analysis (cheapest, ~1-2ms)
  const metaResult = analyzeMeta();
  analyzers.push(metaResult);
  structuralScore += metaResult.score;

  // Early exit if already very confident
  const runningScore = keywordResult.score + structuralScore;
  if (runningScore >= HIGH_CONFIDENCE_THRESHOLD) {
    const elements = findGamblingElements();
    return buildResult(keywordResult.score, structuralScore, analyzers, keywordResult.matches, elements);
  }

  // Link topology (~5-15ms)
  const linkResult = analyzeLinks();
  analyzers.push(linkResult);
  structuralScore += linkResult.score;

  // DOM structure (~5-15ms)
  const domResult = analyzeDOM();
  analyzers.push(domResult);
  structuralScore += domResult.score;

  // Text density (~10-20ms)
  const pageText = document.body?.innerText ?? "";
  const textResult = analyzeText(pageText);
  analyzers.push(textResult);
  structuralScore += textResult.score;

  // Domain-content coherence (~1ms)
  const coherenceResult = analyzeCoherence(keywordResult.score);
  analyzers.push(coherenceResult);
  structuralScore += coherenceResult.score;

  const elements = findGamblingElements();
  return buildResult(keywordResult.score, structuralScore, analyzers, keywordResult.matches, elements);
}

function buildResult(
  keywordScore: number,
  structuralScore: number,
  analyzers: AnalyzerResult[],
  matches: string[],
  elements: Element[],
): DetectionResult {
  const finalScore = keywordScore + structuralScore;
  const positiveAnalyzers = analyzers.filter((a) => a.score > 0).length;

  // Determine confidence
  let confidence: "low" | "medium" | "high";
  if (positiveAnalyzers >= 4) {
    confidence = "high";
  } else if (positiveAnalyzers >= 2) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  // Decision: keywords alone can trigger, but structural alone needs medium+ confidence
  const isGambling =
    finalScore >= DETECTION_THRESHOLD &&
    (confidence !== "low" || keywordScore >= DETECTION_THRESHOLD);

  return {
    keywordScore,
    structuralScore,
    finalScore,
    isGambling,
    confidence,
    analyzers,
    matches,
    elements,
  };
}
