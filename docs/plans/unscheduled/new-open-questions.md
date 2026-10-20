---
title: "new-open-questions"
type: Plan
status: 仕様詳細
milestone: unscheduled
timestamp: 2026-10-20
---

# 追加決定事項（計画作成時の確認項目）

PO 回答により **2026-10-20** に確定。未決のまま残っている項目は現状なし。

## N-H1 1948 年未満の「警告」の届け方（D-15 の細部）— 決定済み（2026-10-20 PO 回答）

| 案 | 内容 |
|----|------|
| A | 戻り値を `{ holidays, warnings }` に変更 |
| B | 戻り値は従来どおり `HolidayList`。第 2 引数 `options.onWarning?` で通知 |
| C | モジュールスコープの `getLastWarnings()` |

**決定: B。** 1948 年未満の年は戻り値を**空配列のまま**返し、警告は `options.onWarning?` コールバックに届ける。未指定時は何もしない（既存の呼び方は壊さない）。

----

以上
