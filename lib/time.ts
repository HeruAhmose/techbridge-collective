export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function fmtSchedule(dayOfWeek: number, startTime: string, endTime: string) {
  const day = DAYS[dayOfWeek] ?? `Day${dayOfWeek}`;
  return `${day} ${startTime}–${endTime}`;
}
