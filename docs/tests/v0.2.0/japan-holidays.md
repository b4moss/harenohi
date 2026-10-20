---
title: "japan-holidays"
type: TestSpec
status: draft
milestone: v0.2.0
timestamp: 2026-10-20
---

# 日本祝日演算テスト（v0.2.0）

## ケース一覧

| ID | 区分 | 入力 / 条件 | 期待 | 決定 |
|----|------|-------------|------|------|
| TC-JP-FIXED-01 | 正常 | 2024-01-01 | 元日 | |
| TC-JP-HM-01 | 正常 | 2024 成人の日 | 1 月第 2 月曜 | |
| TC-JP-TRANSFER-01 | 正常 | 祝日が日曜の年 | 直後の非祝日が振替休日 | D-16 |
| TC-JP-TRANSFER-EQX | 差分 | 春分または秋分が日曜 | **振替休日あり**（参照実装が無しでも本パッケージはあり） | D-16 |
| TC-JP-BRIDGE-01 | 正常 | GW 橋渡し年 | 国民の休日 | |
| TC-JP-EQX-RANGE | 正常 | 春分・秋分 | 概算が妥当な日付範囲（公布差は許容） | U-05 |
| TC-JP-SORT-01 | 正常 | 任意年 | 日付一意・昇順 | |
| TC-JP-NO-DAYJS | 制約 | package 依存 | dayjs / luxon / moment なし | D-06 |

フィクスチャ年は実装時に政府公開と突合しやすい年（例: 2023–2025）を選ぶ。期待 `title` は法令・CSV 呼称に合わせる。

----

以上
