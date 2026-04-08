import { useMemo } from "react";
import { getRandomQuote } from "@/shared/constants/quotes";

export function MotivationalQuote() {
  const quote = useMemo(() => getRandomQuote("id"), []);

  return (
    <div className="bg-white/5 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-xl">💭</span>
        <div>
          <p className="text-sm text-gray-200 italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xs text-gray-500 mt-2">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
