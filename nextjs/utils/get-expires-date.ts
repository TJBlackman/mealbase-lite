/**
 * Calculate date n days in the future.
 * @param days A number of days.
 * Example: getFutureDate("4");
 */
export function getFutureDate(days: string | number) {
  const number = Number(days);
  if (Number.isNaN(number)) {
    throw Error("Argument 'days' is not a number.");
  }
  const seconds = 1000 * 60 * 60 * 24 * number;
  const now = Date.now();
  return new Date(seconds + now);
}
