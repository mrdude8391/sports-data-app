/**
 * Returns `date` with the current time of day copied onto it.
 * Calendar pickers return midnight; without this, back-dated stats saved
 * on the same day would all share 00:00 and sort unpredictably.
 */
export const withCurrentTime = (date: Date): Date => {
  const now = new Date();
  const merged = new Date(date);
  merged.setHours(
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  return merged;
};
