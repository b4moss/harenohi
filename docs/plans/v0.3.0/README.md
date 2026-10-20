---
title: "v0.3.0"
type: Plan
status: 方針確定
milestone: v0.3.0
timestamp: 2026-10-20
---

# v0.3.0 — CSV / オーバーライド / Actions

## 目的

政府 CSV 由来の過去・確定データをオーバーライドとして同梱し、来年分の更新を Actions → PR → 人手マージで回せるようにする。

## 含む機能

- CSV 取得・パース・年単位 JSON オーバーライド（[data-sources.md](../v1.0.0/data-sources.md)）
- 過去分の初期投入（1948 以降〜入手可能な確定年）
- Gitea Actions: CSV 取得後に PR を作成（main 直書きしない）

## 受け入れ条件

- 既知年（例: 2024, 2025）が政府公開と一致
- オーバーライドがある年は演算パスを使わない
- Actions 失敗時に古いデータのまま黙ってリリースしない運用が文書化されている

## 依存関係

- **前提:** v0.2.0
- **参照:** life リポの `scripts/parse-jp-holiday-csv.mjs` 等

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.3.0/](../../tests/v0.3.0/)

----

以上

