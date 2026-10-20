import { describe, expect, it, vi } from 'vitest'
import {
  getHoliday,
  getHolidaysOfMonth,
  getHolidaysOfYear,
  HolidayInputError,
  isHoliday,
} from '../src/index.js'

describe('API (v0.2.0)', () => {
  it('TC-API-YEAR-01: getHolidaysOfYear(2024) returns sorted non-empty list', () => {
    const list = getHolidaysOfYear(2024)
    expect(list.length).toBeGreaterThan(0)
    for (const h of list) {
      expect(h).toHaveProperty('title')
      expect(h).toHaveProperty('date')
      expect(h.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    const dates = list.map((h) => h.date)
    expect(dates).toEqual([...dates].sort())
  })

  it('TC-API-YEAR-02: getHolidaysOfYear(1948) does not throw', () => {
    expect(() => getHolidaysOfYear(1948)).not.toThrow()
    const list = getHolidaysOfYear(1948)
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it('TC-API-YEAR-03: year 1947 returns empty array without throw', () => {
    expect(getHolidaysOfYear(1947)).toEqual([])
  })

  it('TC-API-YEAR-03b: onWarning receives YEAR_BEFORE_MIN', () => {
    const onWarning = vi.fn()
    expect(getHolidaysOfYear(1947, { onWarning })).toEqual([])
    expect(onWarning).toHaveBeenCalled()
    expect(onWarning.mock.calls[0]![0]).toMatchObject({
      code: 'YEAR_BEFORE_MIN',
      year: 1947,
    })
  })

  it('TC-API-YEAR-03c: without options returns empty only', () => {
    expect(getHolidaysOfYear(1947)).toEqual([])
  })

  it('TC-API-YEAR-04: non-integer year throws HolidayInputError', () => {
    expect(() => getHolidaysOfYear(2024.5)).toThrow(HolidayInputError)
    expect(() => getHolidaysOfYear(Number.NaN)).toThrow(HolidayInputError)
  })

  it('TC-API-MONTH-01: filters January 2024', () => {
    const list = getHolidaysOfMonth(2024, 1)
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((h) => h.date.startsWith('2024-01-'))).toBe(true)
  })

  it('TC-API-MONTH-02: invalid month throws', () => {
    expect(() => getHolidaysOfMonth(2024, 0)).toThrow(HolidayInputError)
    expect(() => getHolidaysOfMonth(2024, 13)).toThrow(HolidayInputError)
  })

  it('TC-API-DAY-01: getHoliday New Year', () => {
    expect(getHoliday('2024-01-01')).toEqual({ title: '元日', date: '2024-01-01' })
  })

  it('TC-API-DAY-02: non-holiday returns null', () => {
    expect(getHoliday('2024-01-02')).toBeNull()
  })

  it('TC-API-DAY-03: invalid date throws (not null)', () => {
    expect(() => getHoliday('2024-1-1')).toThrow(HolidayInputError)
    expect(() => getHoliday('2024-02-30')).toThrow(HolidayInputError)
  })

  it('TC-API-IS-01 / TC-API-IS-02: isHoliday', () => {
    expect(isHoliday('2024-01-01')).toBe(true)
    expect(isHoliday('2024-01-02')).toBe(false)
  })

  it('leap year does not throw', () => {
    expect(() => getHolidaysOfYear(2024)).not.toThrow()
    expect(getHoliday('2024-02-29')).toBeNull()
  })
})
