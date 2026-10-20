---
title: "v0.2.0"
type: Plan
status: 方針確定
milestone: v0.2.0
timestamp: 2026-10-20
---

# v0.2.0 — 日本祝日演算の移植

## 目的

`kohki/shikata-kohki-life` の祝日演算を本パッケージへ移植し、公開 API の骨格を単体テスト付きで動かす。

## 含む機能

- [api.md](../v1.0.0/api.md) の関数群
- [japan-holidays.md](../v1.0.0/japan-holidays.md) の演算（振替・国民の休日・春分秋分の振替含む）
- 1948 年未満: 警告＋空結果（エラーにしない）
- 外部日付ライブラリなし

## 受け入れ条件

- 既知年の主要ケース（固定日・ハッピーマンデー・GW・振替）がテストで緑
- 参照実装との差分（春分秋分の振替）をテストで明示
- Day.js 等へ依存しない

## 依存関係

- **前提:** v0.1.0
- **参照実装:** `kohki/shikata-kohki-life` の `src/utils/holiday/`
- CSV オーバーライド本格運用は v0.3.0（本版では演算のみでも可）

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.2.0/](../../tests/v0.2.0/)

----

以上

