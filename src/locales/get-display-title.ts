import type { Holiday } from '../types.js'
import { enTitles } from './en.js'

/**
 * Returns a display title for `holiday` in `locale`.
 * Falls back to the Japanese `holiday.title` when locale is omitted,
 * unsupported, or the title has no translation. Never throws.
 */
export function getDisplayTitle(holiday: Holiday, locale?: string): string {
  if (locale === undefined || locale === '' || locale === 'ja') {
    return holiday.title
  }
  if (locale === 'en') {
    return enTitles[holiday.title] ?? holiday.title
  }
  return holiday.title
}
