import { HolidayInputError } from '../errors.js'

const YMD_RE = /^(\d{4})-(\d{2})-(\d{2})$/

export type Ymd = { year: number; month: number; day: number }

export function formatDate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function isValidDateString(value: string): boolean {
  const m = YMD_RE.exec(value)
  if (!m) return false
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  if (month < 1 || month > 12) return false
  const utc = new Date(Date.UTC(year, month - 1, day))
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  )
}

export function parseDateString(value: string): Ymd {
  if (!isValidDateString(value)) {
    throw new HolidayInputError(`Invalid date string: ${value}`)
  }
  const m = YMD_RE.exec(value)!
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
}

/** Sunday = 0 … Saturday = 6 (UTC calendar day). */
export function dayOfWeek(date: string): number {
  const { year, month, day } = parseDateString(date)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function addDays(date: string, delta: number): string {
  const { year, month, day } = parseDateString(date)
  const utc = new Date(Date.UTC(year, month - 1, day + delta))
  return formatDate(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate())
}

export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number
): string {
  // month: 1-12, weekday: 0(Sun)-6(Sat)
  const firstWeekday = dayOfWeek(formatDate(year, month, 1))
  let offset = weekday - firstWeekday
  if (offset < 0) offset += 7
  const day = 1 + offset + 7 * (n - 1)
  return formatDate(year, month, day)
}

export function assertIntegerYear(year: number): void {
  if (typeof year !== 'number' || !Number.isInteger(year) || Number.isNaN(year)) {
    throw new HolidayInputError(`year must be an integer, got: ${String(year)}`)
  }
}

export function assertMonth(month: number): void {
  if (typeof month !== 'number' || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new HolidayInputError(`month must be an integer 1-12, got: ${String(month)}`)
  }
}
