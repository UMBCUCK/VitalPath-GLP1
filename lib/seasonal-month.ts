/**
 * Returns a forward-looking month name for seasonal conversion headlines
 * (e.g. "Lose that stubborn belly fat by May").
 *
 * Rule — rolls on the 20th of each month:
 *   • Day 1–19: target = this month + 1  (urgent near-term deadline)
 *   • Day 20+:  target = this month + 2  (protect from landing on the current month)
 *
 * Examples (assume `now` is the 1st vs 20th of each month):
 *   Apr 1  → May       Apr 20 → June
 *   May 19 → June      May 20 → July
 *   Dec 1  → January   Dec 20 → February   (year rollover handled natively by Date)
 *
 * SSR-safe: computed at render time on the server. The parent route should
 * set `export const revalidate = 3600` so stale HTML doesn't outlive the rollover.
 */
export function getDeadlineMonth(now: Date = new Date()): string {
  const dayOfMonth = now.getDate();
  const monthsAhead = dayOfMonth >= 20 ? 2 : 1;
  const target = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(target);
}
