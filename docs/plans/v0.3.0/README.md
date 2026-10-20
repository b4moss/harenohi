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
- 過去分の初期投入（**政府 CSV 最古年 1955〜**入手可能な確定年。N-D1。2026-10-20 PO 承認）
- **1948〜1954** は初期投入せず祝日法に基づく演算のまま（N-D1）
- Gitea Actions `fetch-holiday-csv`: CSV 取得後に **PR を作成**（main 直書きしない。secret **`GITEA_TOKEN`** 必須。2026-10-20 PO 承認）

## 受け入れ条件

- 既知年（例: 2024, 2025）が政府公開と一致
- オーバーライドがある年は演算パスを使わない
- override は CSV 入手可能年（1955 以降）に限る（1948〜1954 は演算）
- Actions 失敗時に古いデータのまま黙ってリリースしない運用が文書化されている

## 依存関係

- **前提:** v0.2.0
- **参照:** life リポの `scripts/parse-jp-holiday-csv.mjs` 等

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.3.0/](../../tests/v0.3.0/)

----

以上

