import { useEffect, useState } from "react";

interface Props {
  duration: number;
  onComplete: () => void;
}

export function CountdownTimer({ duration, onComplete }: Props) {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  if (seconds <= 0) return null;

  const progress = ((duration - seconds) / duration) * 100;

  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500 mb-2">
        Luangkan waktu sejenak untuk berpikir...
      </p>
      <div className="text-3xl font-bold text-white mb-3">{seconds}</div>
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div
          className="bg-green-500 rounded-full h-1.5 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
