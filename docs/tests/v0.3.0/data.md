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
| TC-DATA-ACTIONS-PR | 手順 | ワークフロー定義 | PR 作成ステップあり。main 直 push なし | D-18 |

### TC-DATA-OVERRIDE-SKIP

- **入力:** テスト用に 1 年分 override をスタブ。演算関数をモック
- **期待:** `getHolidaysOfYear(year)` が override 内容を返し、演算モック呼び出し 0 回

境界: 1948 年の override 有無どちらでも API 契約（空／一覧）を満たすこと。

----

以上
