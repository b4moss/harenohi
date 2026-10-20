import type { HolidayList } from '../types.js'
import { buildBaseHolidays } from './compute.js'
import { applyBridgeHolidays } from './national-holiday.js'
import { applySubstituteHolidays, uniqueByDate } from './transfer.js'

/** 年単位オーバーライド（v0.3.0 で本格投入。本版は空） */
const overrideByYear: Record<number, HolidayList> = {}

export function getOverridesOfYear(year: number): HolidayList | null {
  return overrideByYear[year] ?? null
}

export function buildAllHolidays(year: number): HolidayList {
  const base = buildBaseHolidays(year)
  const withSubstitute = applySubstituteHolidays(base)
  const withBridge = applyBridgeHolidays(withSubstitute)
  return uniqueByDate(withBridge)
}

export function resolveYear(year: number): HolidayList {
  const overrides = getOverridesOfYear(year)
  if (overrides) {
    return uniqueByDate(overrides)
  }
  return buildAllHolidays(year)
}
