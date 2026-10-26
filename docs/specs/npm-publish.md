---
title: "npm-publish"
type: Spec
status: draft
timestamp: 2026-10-26
---

# npm 公開（npmjs.org と社内レジストリ併存）

`@b4moss/harenohi` を **npmjs.org** へ公開する手順（GitHub Actions / Trusted Publishing）と、当面の **社内 Gitea Packages**（`@b4m/harenohi`）併存を扱う。憲章の CD（タグ起点）に合わせる。

実装:

| 経路 | ワークフロー | パッケージ名 |
|------|--------------|--------------|
| npmjs.org | [`.github/workflows/publish.yml`](../../.github/workflows/publish.yml) | `@b4moss/harenohi` |
| 社内 Gitea Packages | [`.gitea/workflows/npm-publish.yml`](../../.gitea/workflows/npm-publish.yml) | `@b4m/harenohi`（publish 直前に name を一時書き換え） |

`fetch-holiday-csv` は **Gitea のみ**（GitHub には置かない）。

## パッケージ（npmjs）

| 項目 | 内容 |
|------|------|
| 名前 | `@b4moss/harenohi` |
| 置き場 | リポジトリルート |
| 公開物 | `dist/`（`.map` 除外）、`LICENSE`、`NOTICE`、`README.md` |
| registry | `https://registry.npmjs.org` |
| `publishConfig` | `{ "access": "public" }` |
| `repository.url` | `git+https://github.com/b4moss/harenohi.git`（Trusted Publishing 照合用） |

## トリガ（共通）

| トリガ | 内容 |
|--------|------|
| git タグ | 厳密な `vX.Y.Z` のみ（例: `v0.4.0`）。`v0.4.0-doc.1` など suffix 付きは **スキップ**（Gitea）またはマッチしない（GitHub の tag filter） |
| Gitea `workflow_dispatch` | 社内公開のみ。入力で版を指定して手動実行可 |
| GitHub `workflow_dispatch` | **付けない**（Trusted Publisher の workflow 名照合を崩さないため） |

タグは `main` に打つ（[versioning-rule](../charter/versioning-rule.md) / [roadmap](../roadmap.md)）。

## 同じタグで両方の workflow が走るとき

運用想定（Gitea 正本 → GitHub push mirror）:

1. `main` に `vX.Y.Z` を打つ
2. **Gitea** の `npm-publish` が動き、社内 registry へ `@b4m/harenohi@X.Y.Z` を出す
3. ミラーが GitHub にタグを届け、**GitHub** の `publish` が動き、npmjs へ `@b4moss/harenohi@X.Y.Z` を出す

失敗時:

- どちらか一方だけ成功しても、もう一方は **自動ではロールバックしない**
- 版番号は両経路で同じ `X.Y.Z` を使う。再実行は「未公開の経路だけ」を対象にする（npm 側は既に版があれば skip）
- 社内のみ再公開したい場合は Gitea の `workflow_dispatch` を使う
- 片方が失敗したら、ログを確認してから同タグの再実行または次の patch で揃える

## GitHub Actions（npmjs）

### 権限・環境

| 項目 | 内容 |
|------|------|
| `permissions` | `contents: read`、`id-token: write` |
| `runs-on` | `ubuntu-latest` |
| `environment` | `npm-publish` |
| Node | 24（`registry-url: https://registry.npmjs.org`。release では npm cache を使わない） |
| npm | **11.5.1 以上**（Trusted Publishing 要件。不足なら workflow 内で更新） |
| actions | checkout / setup-node を **SHA 固定** |

### ジョブの流れ

1. タグと `package.json.version` と `src/version.ts` の `VERSION` が一致するか確認（不一致なら失敗。CI で版を書き換えない）
2. `npm ci` → lint → typecheck → test → build
3. `npm pack --dry-run`
4. その版が npm に既にあれば **skip**
5. `npm publish --access public --provenance`
   - `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` は **初版のみ**（granular token）。Trusted Publisher 登録後は secret を消し、OIDC だけで公開する

### 秘密（GitHub Environment `npm-publish`）

| 名前 | 用途 |
|------|------|
| `NPM_TOKEN` | 初版公開用。登録後は削除し Trusted Publishing に切り替える |

## Gitea Actions（社内）

### 秘密

| 名前 | 用途 |
|------|------|
| `PACKAGE_REGISTRY_TOKEN` | Packages 書き込み用。Gitea Actions は `GITEA_` / `GITHUB_` 接頭辞の secret 名を拒否する |

### ジョブの流れ

1. 版の解決（タグ or dispatch 入力）。suffix タグは skip
2. secret の有無確認
3. **版の一致確認**（`package.json` / `src/version.ts`。不一致なら失敗）
4. npm auth 設定（`.npmrc` の `@b4m` → 社内 registry）
5. `npm ci` → `npm run build` → `npm test`
6. `package.json` の `name` を一時的に `@b4m/harenohi` に書き換え、`publishConfig` を外す
7. `npm publish --access restricted --registry <社内 npm registry URL>`

### 版不一致で落とす理由

タグは「すでにブランチに載っている版」を指すべきである。公開時に `package.json` や `VERSION` を黙って上げると、git タグ・`package.json`・ランタイムの `VERSION`（`src/version.ts`）が食い違ったまま配布され、利用側と履歴が一致しなくなる。そのため **先にコミットで版を揃え、タグ／dispatch はその版と一致させる**。

## 公開前チェックリスト（人手）

1. `package.json` の `version` と `src/version.ts` の `VERSION` を同じ `X.Y.Z` にする
2. main にマージ済みであること
3. GitHub に public リポ `b4moss/harenohi` と Environment `npm-publish` があること（初版時は `NPM_TOKEN`）
4. Gitea → GitHub の push mirror（タグ含む）が設定済みであること
5. main に `vX.Y.Z` タグを打つ
6. 公開後: Trusted Publisher（workflow `publish.yml`、environment `npm-publish`）を登録し、`NPM_TOKEN` を revoke / 削除

## 消費側

### npmjs（推奨）

```bash
npm install @b4moss/harenohi
```

### 社内レジストリ

ルート [`.npmrc`](../../.npmrc) と同様（ホスト名は環境に合わせる）:

```ini
@b4m:registry=https://<gitea-host>/api/packages/<org>/npm/
//<gitea-host>/api/packages/<org>/npm/:_authToken=${PACKAGE_REGISTRY_TOKEN}
//<gitea-host>/api/packages/<org>/npm/:always-auth=true
```

```bash
npm install @b4m/harenohi
```

----

以上
