import { useMemo } from "react";
import { getRandomFact } from "@/shared/constants/risk-facts";

export function RiskFact() {
  const fact = useMemo(() => getRandomFact("id"), []);

  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-xl">📊</span>
        <div>
          <h3 className="text-sm font-semibold text-orange-300 mb-1">
            Tahukah Kamu?
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{fact.text}</p>
          <p className="text-xs text-gray-600 mt-2">Sumber: {fact.source}</p>
        </div>
      </div>
    </div>
  );
}
