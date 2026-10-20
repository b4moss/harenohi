---
title: "tests-v0.1.0"
type: TestSpec
status: draft
milestone: v0.1.0
timestamp: 2026-10-20
---

# v0.1.0 テスト仕様 — スキャフォールド

計画: [plans/v0.1.0/implementation-plan.md](../../plans/v0.1.0/implementation-plan.md)

## ケース一覧

| ID | 区分 | 内容 | 受け入れ対応 |
|----|------|------|--------------|
| TC-SCAF-01 | 正常 | `npm test`（または同等）が成功する | 空でもテスト緑 |
| TC-SCAF-02 | 正常 | `tsc --noEmit`（またはビルド）が成功する | 型チェック |
| TC-SCAF-03 | 正常 | `package.json` の `name` が `@b4m/harenohi` | パッケージ名 |
| TC-SCAF-04 | 正常 | `exports` / 型定義パスが ESM 向けに設定されている | D-05 |

### TC-SCAF-01

- **入力:** リポジトリルートでテストコマンド実行
- **期待:** exit 0。最低 1 ケース（プレースホルダ可）

### TC-SCAF-03

- **入力:** `package.json`
- **期待:** `"name": "@b4m/harenohi"`。`publishConfig.registry` が社内 URL（任意だが推奨）

境界値: 本版では業務ロジックなし。異常系はパッケージ設定の欠落検出のみ。

----

以上
