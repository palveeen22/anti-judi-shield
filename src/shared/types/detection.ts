export interface AnalyzerResult {
  name: string;
  score: number;
  signals: string[];
}

export interface DetectionResult {
  keywordScore: number;
  structuralScore: number;
  finalScore: number;
  isGambling: boolean;
  confidence: "low" | "medium" | "high";
  analyzers: AnalyzerResult[];
  matches: string[];
  elements: Element[];
}

export const SUSPICION_THRESHOLD = 3;
export const HIGH_CONFIDENCE_THRESHOLD = 30;
