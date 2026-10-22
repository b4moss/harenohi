---
title: "npm-publish"
type: Spec
status: draft
timestamp: 2026-10-22
---

# 社内 npm 公開（Gitea Packages）

`@b4m/harenohi` を社内 Gitea npm registry へ公開する手順。憲章の CD（タグ起点）に合わせ、実装は `.gitea/workflows/npm-publish.yml`。

## パッケージ

| 項目 | 内容 |
|------|------|
| 名前 | `@b4m/harenohi` |
| 置き場 | リポジトリルート（パッケージ本体） |
| 公開物 | `dist/`（`package.json` の `files`） |
| registry | `https://git.b4m.jp/api/packages/b4m-packages/npm/` |
| 所有者 | Gitea org `b4m-packages` |

## トリガ

| トリガ | 内容 |
|--------|------|
| git タグ | 厳密な `vX.Y.Z` のみ（例: `v0.4.0`）。`v0.4.0-doc.1` など suffix 付きは **スキップ** |
| `workflow_dispatch` | 入力で版（`0.4.0` または `v0.4.0`）を指定して手動実行可 |

タグは `main` に打つ（[versioning-rule](../charter/versioning-rule.md) / [roadmap](../roadmap.md)）。

## 秘密

| 名前 | 用途 |
|------|------|
| `PACKAGE_REGISTRY_TOKEN` | Packages 書き込み用。Gitea Actions は `GITEA_` / `GITHUB_` 接頭辞の secret 名を拒否する |

## ジョブの流れ

1. 版の解決（タグ or dispatch 入力）。suffix タグは skip
2. secret の有無確認
3. **版の一致確認**（不一致なら失敗。CI で `package.json` / `src/version.ts` を書き換えない）
4. npm auth 設定（`.npmrc`）
5. `npm ci` → `npm run build` → `npm test`
6. `npm publish --access restricted`（`dist` を含む）

### 版不一致で落とす理由

タグは「すでにブランチに載っている版」を指すべきである。公開時に `package.json` や `VERSION` を黙って上げると、git タグ・`package.json`・ランタイムの `VERSION`（`src/version.ts`）が食い違ったまま配布され、利用側と履歴が一致しなくなる。そのため **先にコミットで版を揃え、タグ／dispatch はその版と一致させる**。

## 公開前チェックリスト（人手）

1. `package.json` の `version` と `src/version.ts` の `VERSION` を同じ `X.Y.Z` にする
2. main にマージ済みであること
3. main に `vX.Y.Z` タグを打つ（または Actions から `workflow_dispatch`）
4. リポジトリ secret `PACKAGE_REGISTRY_TOKEN` が設定済みであること（本仕様は secret の登録手順を扱わない）

## 消費側（install）

ルート [`.npmrc`](../../.npmrc) と同様:

```ini
@b4m:registry=https://git.b4m.jp/api/packages/b4m-packages/npm/
//git.b4m.jp/api/packages/b4m-packages/npm/:_authToken=${PACKAGE_REGISTRY_TOKEN}
//git.b4m.jp/api/packages/b4m-packages/npm/:always-auth=true
```

```bash
npm install @b4m/harenohi
```

----

以上
