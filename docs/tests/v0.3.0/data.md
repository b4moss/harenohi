---
title: "data"
type: TestSpec
status: draft
milestone: v0.3.0
timestamp: 2026-10-20
---

# データソース・オーバーライドテスト（v0.3.0）

## ケース一覧

| ID | 区分 | 入力 | 期待 | 受け入れ / 決定 |
|----|------|------|------|-----------------|
| TC-DATA-PARSE-01 | 正常 | 代表行の CSV 断片 | override JSON 配列（title/date） | パース |
| TC-DATA-PARSE-02 | 異常 | 空行・不正行 | スキップまたは明示エラー（実装で統一し文書化） | |
| TC-DATA-YEAR-2024 | 正常 | 同梱 2024 override vs 政府公開フィクスチャ | 一致 | 既知年一致 |
| TC-DATA-YEAR-2025 | 正常 | 同上 2025 | 一致 | |
| TC-DATA-OVERRIDE-SKIP | 正常 | override がある年で演算スパイ | 演算が呼ばれない | オーバーライド優先 |
| TC-DATA-NO-OVERRIDE | 正常 | override なしの未来年 | 演算パスで結果 | |
| TC-DATA-NO-OVERRIDE-1948 | 境界 | 1948〜1954（例: 1950） | 演算パスで非空（override ファイル無し） | N-D1 |
| TC-DATA-ACTIONS-PR | 手順 | ワークフロー定義 | PR 作成ステップあり。main 直 push なし。`GITEA_TOKEN` 参照あり | D-18 / 2026-10-20 PO |

### TC-DATA-OVERRIDE-SKIP

- **入力:** テスト用に 1 年分 override をスタブ。演算関数をモック
- **期待:** `getHolidaysOfYear(year)` が override 内容を返し、演算モック呼び出し 0 回

### 年範囲メモ（N-D1。2026-10-20 PO 承認）

- 政府祝日 CSV の最古年は **1955**
- **1948〜1954** は祝日法に基づく演算（override を置かない）
- CSV override は **1955 年以降**に限る
- 境界: 1948 年は一覧（演算）。1947 未満は空配列（API 契約）

### TC-DATA-ACTIONS-PR

- ワークフローが feature ブランチ + PR 作成であること（main 直書きなし）
- secret **`GITEA_TOKEN`** を用いる記述があること（運用承認済み 2026-10-20）

----

以上

