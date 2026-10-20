---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.3.0
timestamp: 2026-10-20
---

# v0.3.0 実装計画 — CSV / オーバーライド / Actions

## 目的

政府 CSV → 年単位オーバーライド同梱と、来年分更新（Actions → PR → 人手マージ = D-18）を確立する。

## 対象ファイル・モジュール構成（案）

```
src/
  data/jp-holiday/
    override/           # 年ごと JSON（例: 2024.json）
    source/             # 取得 CSV（必要なら git 管理）
  jp/resolve-year.ts    # オーバーライド優先に本格接続
scripts/
  fetch-jp-holiday-csv.*
  parse-jp-holiday-csv.*
.gitea/workflows/
  fetch-holiday-csv.yml # workflow_dispatch / schedule。PR 作成。main 直書きしない。GITEA_TOKEN 必須
```

正本: [../v1.0.0/data-sources.md](../v1.0.0/data-sources.md)。

## 年範囲（N-D1。2026-10-20 PO 承認）

- 政府祝日 CSV の最古年は **1955**
- **1948〜1954** は祝日法に基づく演算（override を置かない）
- CSV override は **1955 年以降**（入手可能年）に限る

## API / 型

公開 API シグネチャは v0.2.0 と同じ。内部のみ:

- 該当年に `override/{year}.json` があれば演算せずそれを返す（1955 以降の同梱年）
- JSON 形: `{ "title": string, "date": "YYYY-MM-DD" }[]`

ランタイム API は HTTP / FS にアクセスしない（ビルド同梱）。

## 実装ステップ

1. CSV パース（Shift_JIS 等）と override 生成スクリプト（life の `parse-jp-holiday-csv.mjs` 参考）
2. 過去分の初期投入（**1955〜**入手可能年。1948〜1954 は演算のまま）
3. `resolve-year` をオーバーライド優先に接続
4. Actions: 取得 → パース → ブランチ + PR（D-18。secret `GITEA_TOKEN`）
5. 既知年の一致テスト（政府公開との突合はフィクスチャ化）

## リスク

| リスク | 緩和 |
|--------|------|
| CSV 文字コード・列ゆれ | パース異常系テスト。失敗時 Actions を fail |
| 誤データを main に入れる | PR 必須（D-18） |
| 全歴史を演算に書く誘惑 | 例外年はオーバーライドのみ |

## 受け入れ条件との対応

| 受け入れ | 担保 |
|----------|------|
| 既知年が政府公開と一致 | TC-DATA-YEAR-* |
| オーバーライド年は演算しない | TC-DATA-OVERRIDE-SKIP |
| Actions は PR 作成（GITEA_TOKEN・main 直書きなし） | ワークフロー定義レビュー + TC-DATA-ACTIONS-PR |

## 依存

v0.2.0。

----

以上
