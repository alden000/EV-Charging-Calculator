export function formatDurationHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0 min";
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatDateTime(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const time = formatTime(date);
  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${time}`;
}

export function formatKWh(value: number, digits = 1): string {
  return `${value.toFixed(digits)} kWh`;
}

export function formatCurrency(value: number, currencySymbol: string): string {
  return `${currencySymbol}${value.toFixed(2)}`;
}
