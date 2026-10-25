---
title: "display-title"
type: TestSpec
status: draft
timestamp: 2026-10-22
---

# getDisplayTitle / locales/en

Issue #10（祝日名の多言語対応）。W-T1〜W-T8 推奨案に従う。

`getDisplayTitle(holiday, locale?)` は `Holiday.title`（日本語）をキーに、指定ロケールの表示名を返す。ロケール未指定・未対応・訳欠落時は日本語 `title` へフォールバックし、エラーにしない。英語データは `@b4m/harenohi/locales/en`（コア `.` エントリには載せない）。

### getDisplayTitle

- `Holiday` と任意の `locale` を受け取り、表示用タイトル文字列を返す
- `locale` が `'en'` のとき、日本語 `title` キーで英訳を引く
- 訳が無い・ロケール未対応・`locale` 省略時は `holiday.title`（日本語）を返す
- 例外は投げない（入力 `Holiday` が与えられている前提）

#### テスト：正常系

- 現行16祝日の日本語名をキーに、法令外国語訳 DB（Act on National Holidays）の英名どおり返す
- `振替休日` → `Substitute Holiday`、`国民の休日` → `Citizens' Holiday`（社内固定訳）
- 政府 CSV の `休日` → `Public Holiday`（対応表どおり）
- `locale` 省略時は日本語 `title` のまま
- 歴史名 `体育の日` は日本語キーで英訳を引ける（旧称キー）
- 一回限り・英訳なし名称はヘボン式ローマ字（ASCII・長音記号なし）で返す

#### テスト: 異常系 / フォールバック

- 対応表に無い未知の日本語タイトルはエラーにせず日本語のまま返す（W-T4）
- 未対応ロケール（例: `fr`）は日本語へフォールバック
- コア `@b4m/harenohi` の `Holiday.title` は日本語のまま（既存 API 非破壊）

### locales/en エントリ

- `@b4m/harenohi/locales/en` から英名マップを named export できる
- パッケージ `exports` に `./locales` と `./locales/en` がある

----

以上
