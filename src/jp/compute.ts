import { formatDate, getNthWeekdayOfMonth } from '../internal/date.js'
import type { Holiday, HolidayList } from '../types.js'
import { estimateAutumnalEquinox, estimateVernalEquinox } from './equinox.js'

/** 現行法・現天皇誕生日前提のベース祝日（振替・国民の休日なし） */
export function buildBaseHolidays(year: number): HolidayList {
  const list: Holiday[] = [
    { title: '元日', date: formatDate(year, 1, 1) },
    { title: '成人の日', date: getNthWeekdayOfMonth(year, 1, 1, 2) },
    { title: '建国記念の日', date: formatDate(year, 2, 11) },
    { title: '天皇誕生日', date: formatDate(year, 2, 23) },
    { title: '春分の日', date: estimateVernalEquinox(year) },
    { title: '昭和の日', date: formatDate(year, 4, 29) },
    { title: '憲法記念日', date: formatDate(year, 5, 3) },
    { title: 'みどりの日', date: formatDate(year, 5, 4) },
    { title: 'こどもの日', date: formatDate(year, 5, 5) },
    { title: '海の日', date: getNthWeekdayOfMonth(year, 7, 1, 3) },
    { title: '山の日', date: formatDate(year, 8, 11) },
    { title: '敬老の日', date: getNthWeekdayOfMonth(year, 9, 1, 3) },
    { title: '秋分の日', date: estimateAutumnalEquinox(year) },
    { title: 'スポーツの日', date: getNthWeekdayOfMonth(year, 10, 1, 2) },
    { title: '文化の日', date: formatDate(year, 11, 3) },
    { title: '勤労感謝の日', date: formatDate(year, 11, 23) },
  ]
  return list
}
