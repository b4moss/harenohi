---
title: "harenohi"
type: Pillar
status: draft
owner: PO
timestamp: 2026-10-26
---

# harenohi

## このプロジェクトについて

**各国・各文化圏の祝日を演算し返すライブラリ**。当面は日本の国民の祝日のみ。TypeScript の npm パッケージとして **npmjs.org**（`@b4moss/harenohi`）で公開し、社内向けには当面 `@b4m/harenohi` も併存する。

社内カレンダー（例: `@b4m/final-calendar`）や個人アプリから祝日判定を共通利用できるようにする。核は、先行する個人カレンダー実装の TypeScript 祝日演算を切り出したものとする。

## スコープ

### やる（v1.0.0 まで）

- 祝日演算 API（年・月・日の照会）
- **日本の祝日**（法令どおりの演算＋政府 CSV 由来のオーバーライド）
  - 春分・秋分は概算（公布差分は許容。差分は CSV で吸収）
  - 振替休日・国民の休日を含む（春分・秋分も振替対象）
- 対象開始年は **1948**（祝日法施行）。それより前は空結果＋`options.onWarning?`（未指定時は空のみ。N-H1）。エラーにはしない
- 政府祝日 CSV の最古年は **1955**。**1948〜1954** は祝日法に基づく演算。CSV override は **1955 以降**（入手可能年）に限る（N-D1。2026-10-20 PO 承認）
- 来年分 CSV は Actions（`fetch-holiday-csv`、Gitea のみ）が PR を作り、人がマージする（secret 必須。main 直書きしない）

### やらない（現時点）

- 日本以外の文化圏・国（After-v1.0.0）
- 1948 年より前の歴史的祝祭日の正確な再現
- UI / カレンダー描画（final-calendar 等）
- 営業日・銀行休業日カレンダー
- 時刻・タイムゾーン変換（日付 `YYYY-MM-DD` のみ）

## 主な責務

1. 指定した日付・年・月について祝日かどうかを判定する
2. 祝日一覧（名称と日付）を返す
3. 演算と年単位オーバーライドを組み合わせる（オーバーライド優先）

## 日本祝日データの生成方針

| 区分 | 方針 |
|------|------|
| 未来 | 法令どおり動的演算。春分・秋分は概算 |
| 来年 | 政府発表後に Actions で CSV 取得 → PR → 人手マージ |
| 過去（1955〜） | 政府 CSV を取り込みオーバーライド化（CSV 最古年は 1955。N-D1） |
| 過去（1948〜1954） | 祝日法に基づく演算（CSV 無し。N-D1。2026-10-20 PO 承認） |

詳細は [plans/v1.0.0/japan-holidays.md](plans/v1.0.0/japan-holidays.md) / [data-sources.md](plans/v1.0.0/data-sources.md)。出典と利用規約はルート [NOTICE](../NOTICE)。

## 技術方針

| 項目 | 方針 |
|------|------|
| 言語 | TypeScript |
| 実行環境 | Node.js およびブラウザ |
| 日付 | `YYYY-MM-DD` 文字列。時刻は扱わない |
| 依存 | 外部日付ライブラリなし（`Date` / 自前ヘルパ） |
| モジュール | ESM + 型定義のみ |
| API | v1 は日本固定。演算 API に国・ロケール引数なし（U-07）。表示名 en は `@b4moss/harenohi/locales`（[specs/display-title-i18n.md](specs/display-title-i18n.md)） |
| アーキテクチャ | 純関数の演算層中心（憲章のパッケージ例外） |
| 参照実装 | 先行する個人カレンダー実装の祝日ユーティリティ |
| 配布 | `@b4moss/harenohi`（npmjs.org）。社内は当面 `@b4m/harenohi` 併存（[specs/npm-publish.md](specs/npm-publish.md)） |
| レジストリ設定 | 社内消費時はルート [`.npmrc`](../.npmrc)（トークンは `${PACKAGE_REGISTRY_TOKEN}`）。ホスト名は環境依存 |
| publish | plain `vX.Y.Z` タグ（Gitea `npm-publish.yml`）。npmjs はミラー後に `gh workflow run publish.yml --ref vX.Y.Z -R b4moss/harenohi`（[specs/npm-publish.md](specs/npm-publish.md)） |
| 開発環境 | [`.devcontainer/`](../.devcontainer/)（Node 24） |
| テスト | 憲章 TDD・氷山パターン。単体を厚め。E2E 不要 |

## マイルストーン（要約）

| 版 | 内容 |
|----|------|
| v0.1.0 | スキャフォールド・ビルド・Lint・テスト基盤 |
| v0.2.0 | 日本祝日演算の移植・単体テスト |
| v0.3.0 | CSV 取り込み・オーバーライド・Actions（PR 作成） |
| v0.4.0 | 表示用英名・現行機能セット |
| v0.4.1 | npmjs.org 初回公開の版揃え（案 a。社内のみ公開） |
| v0.4.2 | npmjs `workflow_dispatch` 経路（ミラーが tag push を発火しないため） |
| v1.0.0 | API 安定・配信可能な日本祝日ライブラリ |
| After-v1.0.0 | 他文化圏 |

詳細は [roadmap.md](roadmap.md)。

## 憲章・ドキュメント

- 憲章: AGENTS.md の「開発憲章（charter）」節 → [b4moss/charter v1](https://github.com/b4moss/charter/tree/v1/docs/charter)
- オーバーライド: [override-charter.md](override-charter.md)（現状なし）
- 計画: [plans/](plans/) / 版ハブ: [roadmap.md](roadmap.md)
- 現行仕様: [specs/](specs/)（表示名 i18n: [display-title-i18n.md](specs/display-title-i18n.md)、公開: [npm-publish.md](specs/npm-publish.md)）
- 決定ログ: [plans/v1.0.0/open-questions.md](plans/v1.0.0/open-questions.md)（2026-10-20 PO、npmjs 決定 2026-10-26）

----

以上
