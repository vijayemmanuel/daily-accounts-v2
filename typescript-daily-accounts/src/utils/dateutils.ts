export function formatToYYYYMM(date: Date): string {
  const year = date.getFullYear();
  // getMonth() is zero-based (0-11), so we add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${year}${month}`;
}

export function formatPrvMonthToYYYYMM(date: Date): string {
  const year = date.getFullYear();
  // getMonth() is zero-based (0-11), so we add 1
  const month = (date.getMonth()).toString().padStart(2, '0');
  
  return `${year}${month}`;
}

export function formatToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  // getMonth() is zero-based (0-11), so we add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function getDateFromDDDay(dateStr: string): Date | null {
  // Expected format: "DD - Day"
  const [dayPart] = dateStr.split(' - ');
  const day = parseInt(dayPart, 10);

  if (isNaN(day) || day < 1 || day > 31) {
    return null; // Invalid day
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // getMonth() is zero-based

  return new Date(year, month, day);
} 