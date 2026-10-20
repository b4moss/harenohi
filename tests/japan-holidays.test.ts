import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getHoliday, getHolidaysOfYear, isHoliday } from '../src/index.js'
import { estimateAutumnalEquinox, estimateVernalEquinox } from '../src/jp/equinox.js'
import { buildAllHolidays } from '../src/jp/resolve-year.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('Japan holidays (v0.2.0+)', () => {
  it('TC-JP-FIXED-01: 2024-01-01 is 元日', () => {
    expect(getHoliday('2024-01-01')).toEqual({ title: '元日', date: '2024-01-01' })
  })

  it('TC-JP-HM-01: 2024 Coming of Age Day is 2nd Monday of January', () => {
    expect(getHoliday('2024-01-08')).toEqual({ title: '成人の日', date: '2024-01-08' })
  })

  it('TC-JP-TRANSFER-01: Sunday holiday gets substitute (compute path)', () => {
    const list = buildAllHolidays(2024)
    expect(list.find((h) => h.date === '2024-11-03')).toEqual({
      title: '文化の日',
      date: '2024-11-03',
    })
    expect(list.find((h) => h.date === '2024-11-04')).toEqual({
      title: '振替休日',
      date: '2024-11-04',
    })
  })

  it('TC-JP-TRANSFER-EQX: equinox on Sunday also gets substitute (D-16, compute)', () => {
    const list = buildAllHolidays(2024)
    expect(list.find((h) => h.date === '2024-09-22')).toEqual({
      title: '秋分の日',
      date: '2024-09-22',
    })
    expect(list.find((h) => h.date === '2024-09-23')).toEqual({
      title: '振替休日',
      date: '2024-09-23',
    })
  })

  it('TC-JP-BRIDGE-01: national holiday bridge (敬老〜秋分, compute)', () => {
    const list = buildAllHolidays(2026)
    expect(list.find((h) => h.date === '2026-09-22')).toEqual({
      title: '国民の休日',
      date: '2026-09-22',
    })
  })

  it('TC-JP-EQX-RANGE: equinox estimates fall in plausible day ranges', () => {
    for (const year of [2023, 2024, 2025, 2026]) {
      const v = estimateVernalEquinox(year)
      const a = estimateAutumnalEquinox(year)
      const vDay = Number(v.slice(-2))
      const aDay = Number(a.slice(-2))
      expect(v.startsWith(`${year}-03-`)).toBe(true)
      expect(a.startsWith(`${year}-09-`)).toBe(true)
      expect(vDay).toBeGreaterThanOrEqual(19)
      expect(vDay).toBeLessThanOrEqual(22)
      expect(aDay).toBeGreaterThanOrEqual(22)
      expect(aDay).toBeLessThanOrEqual(24)
    }
  })

  it('TC-JP-SORT-01: dates unique and ascending', () => {
    const list = getHolidaysOfYear(2024)
    const dates = list.map((h) => h.date)
    expect(new Set(dates).size).toBe(dates.length)
    expect(dates).toEqual([...dates].sort())
  })

  it('TC-JP-NO-DAYJS: no external date libraries in dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const names = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ]
    for (const forbidden of ['dayjs', 'luxon', 'moment', 'date-fns', 'temporal-polyfill']) {
      expect(names).not.toContain(forbidden)
    }
  })

  it('override year uses government title 休日 for substitute', () => {
    // 政府 CSV は振替を「休日」と表記する
    expect(isHoliday('2024-09-23')).toBe(true)
    expect(getHoliday('2024-09-23')?.title).toBe('休日')
  })
})
