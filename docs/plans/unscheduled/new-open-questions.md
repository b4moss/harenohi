---
title: "new-open-questions"
type: Plan
status: 仕様詳細
milestone: unscheduled
timestamp: 2026-10-20
---

# 計画作成中に判明した未決事項（PO 判断待ち）

推測で確定していない。実装（v0.2.0）前に決める。

## N-H1 1948 年未満の「警告」の届け方（D-15 の細部）

| 案 | 内容 |
|----|------|
| A | 戻り値を `{ holidays, warnings }` に変更 |
| B | 戻り値は従来どおり `HolidayList`。第 2 引数 `options.onWarning?` で通知 |
| C | モジュールスコープの `getLastWarnings()` |

**推奨: B。** 既存の配列戻りを維持しつつ、呼び出し側が気づける。純関数性も A に近い（コールバックは呼び出し元管理）。

----

以上
