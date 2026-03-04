/**
 * Joins class names, filtering falsy values.
 * Lightweight alternative to `clsx` for internal use.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
