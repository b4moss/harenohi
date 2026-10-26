---
title: "roadmap"
type: Hub
status: draft
timestamp: 2026-10-26
---

# roadmap

版一覧・目的・含む機能・受け入れ・依存のハブ。詳細仕様の正本は各 `plans/`。実装後の仕様正本は `specs/`。

## 現状

- v0.1.0〜v0.4.0 相当の実装済み（スキャフォールド・日本祝日演算・CSV オーバーライド・表示用英名）
- charter（OKF v0.1 / VERSION 移動タグ `v1`）取り込み済み
- PO 決定（2026-10-20）反映済み
- **npmjs.org 公開を決定**（2026-10-26、こうきさん）。準備: `.github/workflows/publish.yml`、パッケージ名 `@b4moss/harenohi`
- 社内 Gitea Packages（`@b4m/harenohi`）は当面併存（D-8）
- **次の実装マイルストーン**: [v1.0.0](plans/v1.0.0/)（API 安定）および初版 npmjs 公開（タグ後）

## バージョニング方針

- SemVer。`v0.x` 中は破壊的変更可（[versioning-rule](charter/versioning-rule.md)）
- タグは `main` に打つ
- publish は `vX.Y.Z` タグ。npmjs: [`.github/workflows/publish.yml`](../.github/workflows/publish.yml)。社内: [`.gitea/workflows/npm-publish.yml`](../.gitea/workflows/npm-publish.yml)。手順: [specs/npm-publish.md](specs/npm-publish.md)

## 実装計画（版一覧）

| 版 | 状態 | 目的（一言） | 詳細 |
|----|------|--------------|------|
| **v0.1.0** | 完了 | パッケージ開発の器 | [plans/v0.1.0/](plans/v0.1.0/) |
| **v0.2.0** | 完了 | 日本祝日演算の移植 | [plans/v0.2.0/](plans/v0.2.0/) |
| **v0.3.0** | 完了 | CSV / オーバーライド / Actions | [plans/v0.3.0/](plans/v0.3.0/) |
| **v0.4.0** | 完了（現行タグ） | 表示用英名・現行機能セット。npmjs 初版候補 | — |
| **v1.0.0** | 未着手 | API 安定・配信 | [plans/v1.0.0/](plans/v1.0.0/) |
| **After-v1.0.0** | 未割当 | 他文化圏 | [unscheduled/other-locales.md](plans/unscheduled/other-locales.md) |

---

### v0.1.0 — スキャフォールド

| 項目 | 内容 |
|------|------|
| **目的** | 実装を載せる TypeScript パッケージの器を用意する |
| **含む機能** | `package.json`（公開名は現在 `@b4moss/harenohi`）、TS / テスト / Lint の最小構成、devcontainer で Node が動くこと |
| **受け入れ** | `npm test`（または同等）が空でも緑、型チェックが通る、ルートから docs が辿れる |
| **依存** | なし（コード実装の最初の版） |
| **詳細** | [plans/v0.1.0/](plans/v0.1.0/) |

### v0.2.0 — 日本祝日演算

| 項目 | 内容 |
|------|------|
| **目的** | 先行する個人カレンダー実装から演算を移植し、公開 API の骨格を動かす |
| **含む機能** | `getHolidaysOfYear` / `OfMonth` / `getHoliday` / `isHoliday`。振替・国民の休日。春分秋分も振替対象。1948 未満は空配列＋`options.onWarning?`（N-H1） |
| **受け入れ** | [api.md](plans/v1.0.0/api.md) / [japan-holidays.md](plans/v1.0.0/japan-holidays.md) の単体テストが主要ケースで緑。外部日付ライブラリなし |
| **依存** | v0.1.0 |
| **詳細** | [plans/v0.2.0/](plans/v0.2.0/) |

### v0.3.0 — データソース

| 項目 | 内容 |
|------|------|
| **目的** | 政府 CSV → 年単位オーバーライドと更新フローを確立する |
| **含む機能** | CSV パース、override JSON（**1955〜**）、1948〜1954 は演算、Actions による来年分 PR 作成 |
| **受け入れ** | [data-sources.md](plans/v1.0.0/data-sources.md) どおり。既知年が政府公開と一致。Actions は PR を作り main 直書きしない（N-D1 / U-09。2026-10-20 PO） |
| **依存** | v0.2.0 |
| **詳細** | [plans/v0.3.0/](plans/v0.3.0/) |

### v0.4.0 — 表示名と公開準備

| 項目 | 内容 |
|------|------|
| **目的** | 表示用英名と、npmjs.org 向けメタデータ／CI |
| **含む機能** | `locales` エントリ、MIT / NOTICE、GitHub `publish.yml`、社内 `@b4m` 併存 |
| **受け入れ** | タグ `v0.4.0` と `package.json` / `src/version.ts` が一致。公開前確認は準備 PR 本文 |
| **依存** | v0.3.0 |

### v1.0.0 — 安定・配信

| 項目 | 内容 |
|------|------|
| **目的** | 日本祝日ライブラリとして利用可能な品質で出す |
| **含む機能** | API・型の安定、ドキュメント、npmjs / 社内 publish（[npm-publish](specs/npm-publish.md)） |
| **受け入れ** | [plans/v1.0.0/README.md](plans/v1.0.0/README.md) の受け入れ一覧。カバレッジ目安 50% |
| **依存** | v0.4.0 |
| **詳細** | [plans/v1.0.0/](plans/v1.0.0/) |

---

## 早期意思決定（ログ）

| 議題 | 状態 | 正本 |
|------|------|------|
| npm スコープ・公開時期 | **決定**（2026-10-20）。**npmjs 公開を決定**（2026-10-26、こうきさん） | [open-questions.md](plans/v1.0.0/open-questions.md) U-01 / U-06 |
| 開始年 1948・範囲外は空＋`onWarning?` | **決定**（N-H1 含む） | [open-questions](plans/v1.0.0/open-questions.md) U-02 / [new-open-questions](plans/unscheduled/new-open-questions.md) |
| CSV 最古 1955・1948〜1954 は演算・override は 1955〜 | **決定**（N-D1。2026-10-20 PO） | [new-open-questions](plans/unscheduled/new-open-questions.md) / [data-sources](plans/v1.0.0/data-sources.md) |
| 振替・ロケール・CSV は PR マージ | **決定** | 同上 U-04 / U-07 / U-09 |

----

以上
