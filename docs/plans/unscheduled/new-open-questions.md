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

## N-D1 政府 CSV の最古年が 1955 である件 — 決定済み（2026-10-20 PO 承認）

政府公開 `syukujitsu.csv` の最古行は **1955**。計画の対象開始年は 1948（D-15 / U-02）。

| 案 | 内容 |
|----|------|
| A | 1948–1954 も手作業で override を起こす |
| B | 1948–1954 は演算パスのまま。override は CSV 入手可能年のみ |
| C | 開始年を 1955 に引き上げる |

**決定: B（2026-10-20 PO 承認）。** 明記事項:

- 政府の祝日 CSV の最古年は **1955** 年であること
- **1948〜1954** 年は祝日法に基づく**演算**で求めること
- CSV による override は CSV を入手できる年（**1955 年以降**）に限ること

仕様正本への反映先: [pillar](../../README.md) / [api.md](../v1.0.0/api.md) / [japan-holidays.md](../v1.0.0/japan-holidays.md) / [data-sources.md](../v1.0.0/data-sources.md) / [v0.3.0 計画](../v0.3.0/) / [tests/v0.3.0](../../tests/v0.3.0/)。

`fetch-holiday-csv` 運用（secret `GITEA_TOKEN` 必須・PR 作成のみ・main 直書きなし）も同日 PO 承認。正本: [data-sources.md](../v1.0.0/data-sources.md)。

----

以上
