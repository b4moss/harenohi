import {
  assertIntegerYear,
  assertMonth,
  parseDateString,
} from './internal/date.js'
import { resolveYear } from './jp/resolve-year.js'
import type { Holiday, HolidayList, HolidayQueryOptions } from './types.js'

export type { Holiday, HolidayList, HolidayQueryOptions, HolidayWarning } from './types.js'
export { HolidayInputError } from './errors.js'
export { VERSION } from './version.js'

/** 祝日法施行年（これより前は空配列） */
export const MIN_HOLIDAY_YEAR = 1948

export function getHolidaysOfYear(
  year: number,
  options?: HolidayQueryOptions
): HolidayList {
  assertIntegerYear(year)
  if (year < MIN_HOLIDAY_YEAR) {
    options?.onWarning?.({
      code: 'YEAR_BEFORE_MIN',
      year,
      message: `Year ${year} is before the minimum supported year ${MIN_HOLIDAY_YEAR}`,
    })
    return []
  }
  return resolveYear(year)
}

export function getHolidaysOfMonth(
  year: number,
  month: number,
  options?: HolidayQueryOptions
): HolidayList {
  assertMonth(month)
  const all = getHolidaysOfYear(year, options)
  const mm = String(month).padStart(2, '0')
  const prefix = `${year}-${mm}-`
  return all.filter((h) => h.date.startsWith(prefix))
}

export function getHoliday(date: string): Holiday | null {
  const { year } = parseDateString(date)
  if (year < MIN_HOLIDAY_YEAR) return null
  const all = resolveYear(year)
  return all.find((h) => h.date === date) ?? null
}

export function isHoliday(date: string): boolean {
  return getHoliday(date) !== null
}
