---
title: "v0.1.0"
type: Plan
status: 方針確定
milestone: v0.1.0
timestamp: 2026-10-20
---

# v0.1.0 — スキャフォールド

## 目的

実装コードを書く前に、TypeScript npm パッケージとしての器を用意する。

## 含む機能

- `@b4moss/harenohi` の `package.json`（publishConfig は社内 registry）
- TypeScript / テストランナー / Lint の最小構成
- ESM + 型定義を出すビルド設定の骨格
- 既存の `.devcontainer` / `.npmrc` で開発できること

## 受け入れ条件

- 空でもテストと型チェックが通る
- パッケージ名が `@b4moss/harenohi`
- ルート README と `docs/` から方針・roadmap が辿れる

## 依存関係

- 前提なし（本リポ最初の実装マイルストーン）
- 参照: 先行する個人カレンダー実装（移植は v0.2.0）

## やらぬこと

- 祝日演算本体
- CI の自動 publish（後続）

## 詳細

- 実装計画: [implementation-plan.md](implementation-plan.md)
- テスト仕様: [../../tests/v0.1.0/](../../tests/v0.1.0/)

----

以上

