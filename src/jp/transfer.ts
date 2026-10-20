import { addDays, dayOfWeek } from '../internal/date.js'
import type { Holiday, HolidayList } from '../types.js'

const sortByDate = (list: HolidayList): HolidayList =>
  [...list].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

const uniqueByDate = (list: HolidayList): HolidayList => {
  const seen = new Set<string>()
  const result: HolidayList = []
  for (const h of sortByDate(list)) {
    if (seen.has(h.date)) continue
    seen.add(h.date)
    result.push(h)
  }
  return result
}

const isHolidayDate = (date: string, holidays: HolidayList): boolean =>
  holidays.some((h) => h.date === date)

/**
 * 祝日が日曜日のとき、直後の最初の「祝日でない日」を振替休日とする。
 * 春分・秋分も振替対象（D-16）。
 */
export function applySubstituteHolidays(base: HolidayList): HolidayList {
  const result: HolidayList = [...base]

  for (const h of base) {
    if (dayOfWeek(h.date) !== 0) continue

    let cursor = addDays(h.date, 1)
    while (isHolidayDate(cursor, result)) {
      cursor = addDays(cursor, 1)
    }
    result.push({ title: '振替休日', date: cursor })
  }

  return uniqueByDate(result)
}

export { sortByDate, uniqueByDate }
