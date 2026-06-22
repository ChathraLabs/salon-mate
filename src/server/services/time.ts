const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dateTimeFromLocalParts(date: string, time: string) {
  return new Date(`${date}T${time}:00.000Z`);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function displayTime(time: string) {
  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, "0")}:${minute} ${suffix}`;
}

export function parseDisplayTime(display: string) {
  const match = display.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return display;

  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = match[3].toUpperCase();

  if (suffix === "PM" && hour !== 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

export function nextDateOptions(days = 7) {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + index));
    const key = dateKey(date);
    const label =
      index === 0
        ? "Today"
        : index === 1
          ? "Tomorrow"
          : `${WEEKDAY_LABELS[date.getUTCDay()]} ${date.getUTCDate()}`;

    return { label, date: key, weekday: date.getUTCDay() };
  });
}
