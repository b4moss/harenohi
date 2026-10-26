---
title: "implementation-plan"
type: Plan
status: 仕様詳細
milestone: v0.1.0
timestamp: 2026-10-20
---

# v0.1.0 実装計画 — スキャフォールド

## 目的

`@b4moss/harenohi` の TypeScript パッケージ器を用意する。祝日演算は含めない。

## 対象ファイル・モジュール構成（案）

```
package.json          # name: @b4moss/harenohi, type: module, exports + types
tsconfig.json
vitest.config.ts      # または node:test。DOM 不要
src/
  index.ts            # 空の named export プレースホルダ（後続版で埋める）
  version.ts          # 任意
.gitignore            # 既存
.devcontainer/        # 既存
.npmrc                # 既存
```

`publishConfig` は npmjs 向けに `{ "access": "public" }`（社内 registry は `.npmrc` / Gitea workflow の `--registry`。D-00 / D-8）。

## API / 型（本版）

本版では公開 API を確定させない。プレースホルダのみ。

```ts
// src/index.ts — v0.2.0 で差し替え
export {}
```

モジュール形式: **ESM + 型定義のみ**（D-05 / U-08）。

## 実装ステップ

1. `package.json` / `tsconfig` / テストランナー設定
2. ビルド（`tsc` または `tsup`）で `dist/*.js` + `.d.ts` が出ること
3. 空テスト 1 本が緑
4. README / docs リンクがルートから辿れることを手動確認

## リスク

| リスク | 緩和 |
|--------|------|
| ビルドツール選定が後で変わる | v0.x のため破壊的変更可。最初は `tsc` のみでよい |
| publish 手順未整備 | 本版の受け入れ外。v1.0.0 で整備 |

## 受け入れ条件との対応

| 受け入れ（[README](README.md)） | 本計画での担保 |
|--------------------------------|----------------|
| 空でもテストと型チェックが通る | ステップ 2–3 |
| パッケージ名 `@b4moss/harenohi` | `package.json` name |
| docs が辿れる | 既存 docs + ルート README |

## 依存

なし。

## テスト仕様

[docs/tests/v0.1.0/](../../tests/v0.1.0/)

----

以上
