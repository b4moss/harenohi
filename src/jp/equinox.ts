import { formatDate } from '../internal/date.js'

// 簡易推定ロジック（主に将来年向け）。過去の確定差分はオーバーライドで吸収する。

export function estimateVernalEquinox(year: number): string {
  // 1980-2099年向け近似式
  const day = Math.floor(
    20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  )
  return formatDate(year, 3, day)
}

export function estimateAutumnalEquinox(year: number): string {
  // 1980-2099年向け近似式
  const day = Math.floor(
    23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4)
  )
  return formatDate(year, 9, day)
}
