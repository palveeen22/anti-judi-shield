export function getToday(): string {
  return new Date().toISOString().split("T")[0]!;
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / 86400000);
}

export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]!);
  }
  return days;
}

export function formatDate(date: string, lang: "id" | "en" = "id"): string {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
