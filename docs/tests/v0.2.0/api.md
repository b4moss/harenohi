---
title: "api"
type: TestSpec
status: draft
milestone: v0.2.0
timestamp: 2026-10-20
---

# API テスト（v0.2.0）

## ケース一覧

| ID | 区分 | 入力 | 期待 | 受け入れ / 決定 |
|----|------|------|------|-----------------|
| TC-API-YEAR-01 | 正常 | `getHolidaysOfYear(2024)` | 日付昇順の非空配列。各要素に `title`/`date` | API 正常系 |
| TC-API-YEAR-02 | 境界 | `getHolidaysOfYear(1948)` | 非空（または法令上の祝日）・エラーなし | D-15 開始年 |
| TC-API-YEAR-03 | 境界 | `getHolidaysOfYear(1947)` | **空配列**。警告が出る（届け方は N-H1）。**throw しない** | D-15 |
| TC-API-YEAR-04 | 異常 | `getHolidaysOfYear(2024.5)` / `NaN` | `HolidayInputError` | 整数でない year |
| TC-API-MONTH-01 | 正常 | `(2024, 1)` | 1 月の祝日のみ | |
| TC-API-MONTH-02 | 異常 | `(2024, 0)` / `(2024, 13)` | エラー | month 範囲 |
| TC-API-DAY-01 | 正常 | `getHoliday("2024-01-01")` | `{ title: "元日", date: "2024-01-01" }` 相当 | |
| TC-API-DAY-02 | 正常 | `getHoliday("2024-01-02")`（非祝日） | `null` | 祝日でない ≠ エラー |
| TC-API-DAY-03 | 異常 | `"2024-1-1"` / `"2024-02-30"` | エラー（null に落とさない） | |
| TC-API-IS-01 | 正常 | `isHoliday("2024-01-01")` | `true` | |
| TC-API-IS-02 | 正常 | 非祝日 | `false` | |

### 境界メモ

- うるう日を含む年の `getHolidaysOfYear` が例外にならないこと（祝日が 2/29 である必要はない）
- 返却は日付昇順（安定契約）

----

以上
