---
title: "v1.0.0"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-19
---

# v1.0.0 — 日本祝日ライブラリ

## 目的

日本の国民の祝日を演算・照会できる npm パッケージを、社内利用可能な品質で出す。他文化圏は含めない。

## 受け入れ（要約）

- 公開 API が [api.md](api.md) どおりに振る舞い、型定義を同梱する
- 日本祝日の演算・オーバーライド優先が [japan-holidays.md](japan-holidays.md) どおり
- 過去・来年データの取り込み手順が [data-sources.md](data-sources.md) どおり動かせる（Actions 含む）
- 憲章の TDD に沿い、主要 API の単体テストがある（氷山パターン。カバレッジ目安 50%）
- ルート README と `docs/` から利用方法が辿れる

## 文書一覧

| 文書 | 内容 |
|------|------|
| [api.md](api.md) | 公開 API・型・エラー・互換性 |
| [japan-holidays.md](japan-holidays.md) | 日本祝日の演算ルールと振る舞い |
| [data-sources.md](data-sources.md) | CSV / オーバーライド / Actions |
| [open-questions.md](open-questions.md) | 決定済み項目（旧・未決） |
| [../unscheduled/other-locales.md](../unscheduled/other-locales.md) | v1 外 |

## 参照実装

- `kohki/shikata-kohki-life` の `src/utils/holiday/`
- 同リポの CSV パーススクリプト `scripts/parse-jp-holiday-csv.mjs`

切り出し時は依存（例: Day.js）を本パッケージ方針（[open-questions.md](open-questions.md) U-03）に合わせて整理する。

## 公開方針（v1）

- パッケージ名: `@b4m/harenohi`（社内 Gitea レジストリ。公開時に `@b4moss/harenohi` へ移す。U-01 決定済み）
- 当面は社内のみ。npmjs 公開は個別判断（U-06 決定済み）
- SemVer。`v0.x` 中は破壊的変更を許容。`v1.0.0` は PO 判断（憲章 versioning-rule）

----

以上
