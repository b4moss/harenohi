import { addDays } from '../internal/date.js'
import type { HolidayList } from '../types.js'
import { sortByDate } from './transfer.js'

/**
 * 前日と翌日がいずれも国民の祝日であり、その日自身が祝日でないとき国民の休日とする。
 */
export function applyBridgeHolidays(list: HolidayList): HolidayList {
  const sorted = sortByDate(list)
  const existing = new Set(sorted.map((h) => h.date))
  const result: HolidayList = [...sorted]

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i]!.date
    const next = sorted[i + 1]!.date
    const middle = addDays(current, 1)
    if (addDays(current, 2) === next && !existing.has(middle)) {
      result.push({ title: '国民の休日', date: middle })
      existing.add(middle)
    }
  }

  return sortByDate(result)
}
