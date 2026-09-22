const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Converts western digits in a number/string to Bengali digits, e.g. 16 -> "১৬". */
export function toBn(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Alias for toBn for consistent Bengali number formatting across components. */
export const toBanglaNum = toBn;
