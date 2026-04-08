import type { StreakData } from "@/shared/types";

interface Props {
  streak: StreakData;
}

export function StreakCalendar({ streak }: Props) {
  const milestoneLabels: Record<number, string> = {
    7: "1 Minggu",
    30: "1 Bulan",
    90: "3 Bulan",
    180: "6 Bulan",
    365: "1 Tahun",
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Pencapaian Streak</h3>

      {/* Current streak display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-green-400">
          {streak.currentStreak}
        </div>
        <div className="text-sm text-gray-400 mt-1">hari berturut-turut</div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {streak.milestones.map((milestone) => {
          const achieved = streak.achievedMilestones.includes(milestone);
          const progress = Math.min(
            (streak.currentStreak / milestone) * 100,
            100,
          );

          return (
            <div key={milestone} className="flex items-center gap-4">
              <div className="w-20 text-right">
                <span
                  className={`text-sm font-medium ${
                    achieved ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {milestoneLabels[milestone] ?? `${milestone} hari`}
                </span>
              </div>
              <div className="flex-1 bg-white/5 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    achieved
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="w-8">
                {achieved ? (
                  <span className="text-green-400 text-lg">✓</span>
                ) : (
                  <span className="text-gray-600 text-sm">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
