---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.2.0
timestamp: 2026-10-20
---

# v0.2.0 実装計画 — 日本祝日演算の移植

## 目的

`kohki/shikata-kohki-life` の祝日演算を移植し、公開 API 骨格を単体テスト付きで動かす（D-03 参照元）。CSV オーバーライド本格運用は v0.3.0。

## 対象ファイル・モジュール構成（案）

```
src/
  index.ts                 # named export: getHolidaysOfYear, getHolidaysOfMonth, getHoliday, isHoliday
  types.ts                 # Holiday, HolidayList, HolidayInputError, Warning（警告の形は下記）
  errors.ts
  jp/
    compute.ts             # ベース祝日演算
    equinox.ts             # 春分・秋分概算（参照実装移植）
    transfer.ts            # 振替休日（春分・秋分含む = D-16）
    national-holiday.ts    # 国民の休日
    resolve-year.ts        # 年解決（オーバーライドがあれば優先。本版は空マップ可）
  internal/
    date.ts                # YYYY-MM-DD パース／検証（外部日付ライブラリなし = D-06）
```

参照: `kohki/shikata-kohki-life` の `src/utils/holiday/`。Day.js 呼び出しは剥がす。

## API / 型

正本: [../v1.0.0/api.md](../v1.0.0/api.md) / [japan-holidays.md](../v1.0.0/japan-holidays.md)。

```ts
export interface Holiday { title: string; date: string }
export type HolidayList = Holiday[]

export function getHolidaysOfYear(year: number): HolidayList
export function getHolidaysOfMonth(year: number, month: number): HolidayList
export function getHoliday(date: string): Holiday | null
export function isHoliday(date: string): boolean
```

- ロケール引数なし（D-17）
- 1948 未満: **エラーにせず**空配列を返す（D-15）。警告は **N-H1 決定どおり** 第 2 引数 `options?: { onWarning?: (w: HolidayWarning) => void }` へ届ける。`onWarning` 未指定時は何もしない（既存の 1 引数呼び出しは壊さない）
- 春分・秋分も振替対象（D-16）

```ts
export type HolidayWarning = { code: 'YEAR_BEFORE_MIN'; year: number; message: string }

export function getHolidaysOfYear(
  year: number,
  options?: { onWarning?: (w: HolidayWarning) => void }
): HolidayList
// getHolidaysOfMonth も同様に options を受け取れるようにする（年が 1948 未満のとき）
```

## 実装ステップ

1. 日付ヘルパ（パース・うるう・曜日）と `HolidayInputError`
2. ベース祝日表（固定・ハッピーマンデー・天皇誕生日 2/23）
3. 春分・秋分概算の移植
4. 振替 → 国民の休日 → ソート・日付一意
5. 公開 4 関数と境界（1948 未満・不正入力）
6. 参照実装との差分テスト（春分秋分の振替）を明示

## リスク

| リスク | 緩和 |
|--------|------|
| 参照実装と振替差分で期待値が食い違う | 差分テストを先に書き、法令どおりを正とする |
| 概算と公布の差 | D-15/U-05: v1 は概算許容。v0.3 の CSV で吸収 |
| 警告の届け漏れ | N-H1 決定: `onWarning` 必須ではない。未指定時は空配列のみ（破壊なし） |

## 受け入れ条件との対応

| 受け入れ | 担保 |
|----------|------|
| 主要ケースの単体テスト緑 | [tests/v0.2.0](../../tests/v0.2.0/) |
| 春分秋分振替をテストで明示 | TC-JP-TRANSFER-EQX |
| 外部日付ライブラリなし | package.json dependencies に日付 lib を入れない |

## 依存

v0.1.0。

----

以上
