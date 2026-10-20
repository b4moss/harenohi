import { overrideByYear } from '../data/jp-holiday/override-map.js'
import type { HolidayList } from '../types.js'
import { buildBaseHolidays } from './compute.js'
import { applyBridgeHolidays } from './national-holiday.js'
import { applySubstituteHolidays, uniqueByDate } from './transfer.js'

export function getOverridesOfYear(year: number): HolidayList | null {
  return overrideByYear[year] ?? null
}

export function buildAllHolidays(year: number): HolidayList {
  const base = buildBaseHolidays(year)
  const withSubstitute = applySubstituteHolidays(base)
  const withBridge = applyBridgeHolidays(withSubstitute)
  return uniqueByDate(withBridge)
}

/** テスト差し替え可能な演算エントリ（ランタイム公開 API からは触れない） */
export const holidayEngine = {
  buildAllHolidays,
  getOverridesOfYear,
}

export function resolveYear(year: number): HolidayList {
  const overrides = holidayEngine.getOverridesOfYear(year)
  if (overrides) {
    return uniqueByDate(overrides)
  }
  return holidayEngine.buildAllHolidays(year)
}
