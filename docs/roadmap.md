---
title: "roadmap"
type: Hub
status: draft
timestamp: 2026-10-20
---

# roadmap

版一覧・目的・含む機能・受け入れ・依存のハブ。詳細仕様の正本は各 `plans/`。実装後の仕様正本は `specs/`（現状なし）。

## 現状

- 各 v0.x.0（v1.0.0 直前まで）に実装計画書（`plans/v0.x.0/implementation-plan.md`）とマイルストーンテスト仕様（`tests/v0.x.0/`）を追加

- 各 v0.x.0 に [implementation-plan](plans/) と [tests/v0.x.0](tests/) を追加（v1.0.0 直前まで）

- charter（OKF v0.1 / VERSION 1.2.0 相当）取り込み済み
- PO 決定（2026-10-20）反映済み
- `.npmrc` / `.devcontainer` 配置済み（実装コードは未着手）
- **次の実装マイルストーン**: [v0.1.0](plans/v0.1.0/)

## バージョニング方針

- SemVer。`v0.x` 中は破壊的変更可（[versioning-rule](charter/versioning-rule.md)）
- タグは `main` に打つ
- 社内 publish は `vX.Y.Z` タグ想定（framewaku と同型。実装は後続）

## 実装計画（版一覧）

| 版 | 状態 | 目的（一言） | 詳細 |
|----|------|--------------|------|
| **v0.1.0** | 未着手 | パッケージ開発の器 | [plans/v0.1.0/](plans/v0.1.0/) |
| **v0.2.0** | 未着手 | 日本祝日演算の移植 | [plans/v0.2.0/](plans/v0.2.0/) |
| **v0.3.0** | 未着手 | CSV / オーバーライド / Actions | [plans/v0.3.0/](plans/v0.3.0/) |
| **v1.0.0** | 未着手 | API 安定・社内配信 | [plans/v1.0.0/](plans/v1.0.0/) |
| **After-v1.0.0** | 未割当 | 他文化圏 | [unscheduled/other-locales.md](plans/unscheduled/other-locales.md) |

---

### v0.1.0 — スキャフォールド

| 項目 | 内容 |
|------|------|
| **目的** | 実装を載せる TypeScript パッケージの器を用意する |
| **含む機能** | `package.json`（`@b4m/harenohi`）、TS / テスト / Lint の最小構成、devcontainer で Node が動くこと |
| **受け入れ** | `npm test`（または同等）が空でも緑、型チェックが通る、ルートから docs が辿れる |
| **依存** | なし（コード実装の最初の版） |
| **詳細** | [plans/v0.1.0/](plans/v0.1.0/) |

### v0.2.0 — 日本祝日演算

| 項目 | 内容 |
|------|------|
| **目的** | `shikata-kohki-life` から演算を移植し、公開 API の骨格を動かす |
| **含む機能** | `getHolidaysOfYear` / `OfMonth` / `getHoliday` / `isHoliday`。振替・国民の休日。春分秋分も振替対象。1948 未満は空配列＋`options.onWarning?`（N-H1） |
| **受け入れ** | [api.md](plans/v1.0.0/api.md) / [japan-holidays.md](plans/v1.0.0/japan-holidays.md) の単体テストが主要ケースで緑。外部日付ライブラリなし |
| **依存** | v0.1.0 |
| **詳細** | [plans/v0.2.0/](plans/v0.2.0/) |

### v0.3.0 — データソース

| 項目 | 内容 |
|------|------|
| **目的** | 政府 CSV → 年単位オーバーライドと更新フローを確立する |
| **含む機能** | CSV パース、override JSON、過去分の初期投入、Actions による来年分 PR 作成 |
| **受け入れ** | [data-sources.md](plans/v1.0.0/data-sources.md) どおり。既知年が政府公開と一致。Actions は PR を作り main 直書きしない |
| **依存** | v0.2.0 |
| **詳細** | [plans/v0.3.0/](plans/v0.3.0/) |

### v1.0.0 — 安定・社内配信

| 項目 | 内容 |
|------|------|
| **目的** | 日本祝日ライブラリとして社内利用可能な品質で出す |
| **含む機能** | API・型の安定、ドキュメント、社内 registry への publish 手順 |
| **受け入れ** | [plans/v1.0.0/README.md](plans/v1.0.0/README.md) の受け入れ一覧。カバレッジ目安 50%。npmjs 公開は必須としない |
| **依存** | v0.3.0 |
| **詳細** | [plans/v1.0.0/](plans/v1.0.0/) |

---

## 早期意思決定（ログ）

| 議題 | 状態 | 正本 |
|------|------|------|
| npm スコープ・公開時期 | **決定**（2026-10-20） | [open-questions.md](plans/v1.0.0/open-questions.md) |
| 開始年 1948・範囲外は空＋`onWarning?` | **決定**（N-H1 含む） | [open-questions](plans/v1.0.0/open-questions.md) U-02 / [new-open-questions](plans/unscheduled/new-open-questions.md) |
| 振替・ロケール・CSV は PR マージ | **決定** | 同上 U-04 / U-07 / U-09 |

----

以上
