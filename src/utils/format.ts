export function formatPriceRub(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

export function toDateKeyRu(dateStr: string): string {
  const [d, m, y] = dateStr.split('.').map(Number);
  return [y, String(m).padStart(2, '0'), String(d).padStart(2, '0')].join('-');
}

export function isNightShift(timeStart: string, timeEnd: string): boolean {
  return timeEnd < timeStart;
}

export function badgeForDate(dateStr: string, timeStart: string, timeEnd: string): 'Сегодня' | 'Завтра' | 'Ночь' | null {
  if (isNightShift(timeStart, timeEnd)) return 'Ночь';
  const [d, m, y] = dateStr.split('.').map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (target.getTime() === today.getTime()) return 'Сегодня';
  if (target.getTime() === tomorrow.getTime()) return 'Завтра';
  return null;
}

export function shortDateLabel(dateStr: string): string {
  return dateStr;
}

