import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getHolidaysOfYear } from '../src/index.js'
import { getOverridesOfYear, holidayEngine, resolveYear } from '../src/jp/resolve-year.js'
import {
  parseCsvText,
  parseLine,
} from '../scripts/parse-jp-holiday-csv.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('data sources (v0.3.0)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TC-DATA-PARSE-01: representative CSV lines become override entries', () => {
    const csv = [
      '国民の祝日・休日月日,国民の祝日・休日名称',
      '2024/1/1,元日',
      '2024/1/8,成人の日',
      '',
    ].join('\n')
    const byYear = parseCsvText(csv)
    expect(byYear[2024]).toEqual([
      { title: '元日', date: '2024-01-01' },
      { title: '成人の日', date: '2024-01-08' },
    ])
  })

  it('TC-DATA-PARSE-02: empty and invalid lines are skipped', () => {
    expect(parseLine('')).toBeNull()
    expect(parseLine('   ')).toBeNull()
    expect(parseLine('not-a-date,元日')).toBeNull()
    expect(parseLine('2024/1/1,')).toBeNull()
    expect(parseLine('2024/13/01,元日')).toBeNull()
    const byYear = parseCsvText(
      ['header', '', 'bad', '2024/1/1,元日', '2024/99/01,x'].join('\n')
    )
    expect(byYear[2024]).toEqual([{ title: '元日', date: '2024-01-01' }])
  })

  it('TC-DATA-YEAR-2024: bundled override matches government fixture', () => {
    const fixture = JSON.parse(
      readFileSync(join(root, 'tests/fixtures/jp-holiday/2024.json'), 'utf8')
    ) as { title: string; date: string }[]
    expect(getHolidaysOfYear(2024)).toEqual(fixture)
  })

  it('TC-DATA-YEAR-2025: bundled override matches government fixture', () => {
    const fixture = JSON.parse(
      readFileSync(join(root, 'tests/fixtures/jp-holiday/2025.json'), 'utf8')
    ) as { title: string; date: string }[]
    expect(getHolidaysOfYear(2025)).toEqual(fixture)
  })

  it('TC-DATA-OVERRIDE-SKIP: compute is not called when override exists', () => {
    const spy = vi.spyOn(holidayEngine, 'buildAllHolidays')
    const list = resolveYear(2024)
    expect(list.length).toBeGreaterThan(0)
    expect(spy).not.toHaveBeenCalled()
  })

  it('TC-DATA-NO-OVERRIDE: year without override uses compute path', () => {
    const spy = vi.spyOn(holidayEngine, 'buildAllHolidays')
    const list = resolveYear(2035)
    expect(spy).toHaveBeenCalledWith(2035)
    expect(list.length).toBeGreaterThan(0)
    expect(list[0]?.date.startsWith('2035-')).toBe(true)
  })

  it('TC-DATA-NO-OVERRIDE-1948: 1948-1954 use compute (N-D1, no CSV override)', () => {
    expect(existsSync(join(root, 'src/data/jp-holiday/override/1950.json'))).toBe(
      false
    )
    expect(getOverridesOfYear(1950)).toBeNull()
    const spy = vi.spyOn(holidayEngine, 'buildAllHolidays')
    const list = getHolidaysOfYear(1950)
    expect(spy).toHaveBeenCalledWith(1950)
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((h) => h.date.startsWith('1950-'))).toBe(true)
  })

  it('TC-DATA-ACTIONS-PR: workflow creates PR and never pushes to main', () => {
    const yml = readFileSync(
      join(root, '.gitea/workflows/fetch-holiday-csv.yml'),
      'utf8'
    )
    expect(yml).toMatch(/pulls|pull_request|Create PR|create.*PR/i)
    expect(yml).toMatch(/GITEA_TOKEN/)
    expect(yml).not.toMatch(/git push\s+.*\bmain\b/)
    expect(yml).not.toMatch(/push:\s*\n\s*branches:\s*\n\s*-\s*main/)
  })
})
