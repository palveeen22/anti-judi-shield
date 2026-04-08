import type { BlockStats } from "@/shared/types";
import { getLastNDays } from "@/shared/utils/date";

interface Props {
  stats: BlockStats;
}

export function BlockChart({ stats }: Props) {
  const days = getLastNDays(7);
  const data = days.map((date) => ({
    date,
    count: stats.daily[date] ?? 0,
    label: new Date(date).toLocaleDateString("id-ID", { weekday: "short" }),
  }));

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Blokir 7 Hari Terakhir</h3>
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => {
          const height = (d.count / maxCount) * 100;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                {d.count}
              </span>
              <div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: "120px" }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
