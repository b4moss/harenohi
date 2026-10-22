import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getHoliday, getHolidaysOfYear } from '../src/index.js'
import { getDisplayTitle } from '../src/locales/index.js'
import { enTitles, csvHolidayCorrespondence } from '../src/locales/en.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Act on National Holidays (JLT) Article 2 — reference translation, not official text */
const LAW_EN_BY_JA: Record<string, string> = {
  元日: "New Year's Day",
  成人の日: 'Coming-of-Age Day',
  建国記念の日: 'National Foundation Commemoration Day',
  天皇誕生日: "Emperor's Birthday",
  春分の日: 'Vernal Equinox Day',
  昭和の日: 'Showa Day',
  憲法記念日: 'Constitution Memorial Day',
  みどりの日: 'Greenery Day',
  こどもの日: "Children's Day",
  海の日: 'Marine Day',
  山の日: 'Mountain Day',
  敬老の日: 'Respect for the Aged Day',
  秋分の日: 'Autumnal Equinox Day',
  スポーツの日: 'Sports Day',
  文化の日: 'Culture Day',
  勤労感謝の日: 'Labor Thanksgiving Day',
}

describe('getDisplayTitle (i18n en)', () => {
  it('TC-I18N-EN-01: maps all 16 current national holidays to JLT English names', () => {
    for (const [ja, en] of Object.entries(LAW_EN_BY_JA)) {
      expect(getDisplayTitle({ title: ja, date: '2024-01-01' }, 'en')).toBe(en)
      expect(enTitles[ja]).toBe(en)
    }
  })

  it('TC-I18N-EN-02: fixed translations for substitute / citizens holidays', () => {
    expect(getDisplayTitle({ title: '振替休日', date: '2024-02-12' }, 'en')).toBe(
      'Substitute Holiday'
    )
    expect(getDisplayTitle({ title: '国民の休日', date: '2026-05-06' }, 'en')).toBe(
      "Citizens' Holiday"
    )
  })

  it('TC-I18N-EN-03: CSV「休日」correspondence and Public Holiday', () => {
    expect(csvHolidayCorrespondence['休日']).toEqual({
      computeTitles: ['振替休日', '国民の休日'],
      en: 'Public Holiday',
      note: 'Government CSV uses 休日 for both substitute and citizens holidays',
    })
    expect(getDisplayTitle({ title: '休日', date: '2025-02-24' }, 'en')).toBe(
      'Public Holiday'
    )
  })

  it('TC-I18N-EN-04: omits locale → Japanese title unchanged', () => {
    const h = { title: '元日', date: '2024-01-01' }
    expect(getDisplayTitle(h)).toBe('元日')
    expect(getDisplayTitle(h, undefined)).toBe('元日')
  })

  it('TC-I18N-EN-05: historical name 体育の日 keyed by Japanese title', () => {
    expect(getDisplayTitle({ title: '体育の日', date: '2019-10-14' }, 'en')).toBe(
      'Health and Sports Day'
    )
  })

  it('TC-I18N-FB-01: unknown title falls back to Japanese (no throw)', () => {
    expect(() =>
      getDisplayTitle({ title: '未知の祝日', date: '2024-01-01' }, 'en')
    ).not.toThrow()
    expect(getDisplayTitle({ title: '未知の祝日', date: '2024-01-01' }, 'en')).toBe(
      '未知の祝日'
    )
  })

  it('TC-I18N-FB-02: unsupported locale falls back to Japanese', () => {
    expect(getDisplayTitle({ title: '元日', date: '2024-01-01' }, 'fr')).toBe('元日')
  })

  it('TC-I18N-API-01: core Holiday.title stays Japanese (non-breaking)', () => {
    expect(getHoliday('2024-01-01')).toEqual({ title: '元日', date: '2024-01-01' })
    const list = getHolidaysOfYear(2024)
    expect(list.some((h) => h.title === '元日')).toBe(true)
    expect(list.every((h) => typeof h.title === 'string')).toBe(true)
  })

  it('TC-I18N-PKG-01: package exports locales and locales/en subpaths', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      exports?: Record<string, { types?: string; import?: string }>
    }
    expect(pkg.exports?.['./locales']?.import).toBe('./dist/locales/index.js')
    expect(pkg.exports?.['./locales']?.types).toBe('./dist/locales/index.d.ts')
    expect(pkg.exports?.['./locales/en']?.import).toBe('./dist/locales/en.js')
    expect(pkg.exports?.['./locales/en']?.types).toBe('./dist/locales/en.d.ts')
  })
})
