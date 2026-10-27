---
title: "npm-publish"
type: Spec
status: draft
timestamp: 2026-10-27
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
| git タグ | 厳密な `vX.Y.Z` のみ（例: `v0.4.2`）。`v0.4.0-doc.1` など suffix 付きは **スキップ**（Gitea）またはマッチしない（GitHub の tag filter）／ガードで拒否 |
| Gitea `workflow_dispatch` | 社内公開のみ。入力で版を指定して手動実行可 |
| GitHub `workflow_dispatch` | **付ける**（決定 2026-10-27）。`git push --mirror` によるタグ同期は GitHub 上で tag push イベントを起こさないため、ミラー後に手動実行する |

タグは `main` に打つ（[versioning-rule](../charter/versioning-rule.md) / [roadmap](../roadmap.md)）。

## 同じタグで両方の workflow が走るとき

運用想定（Gitea 正本 → GitHub push mirror）:

1. `main` に `vX.Y.Z` を打つ
2. **Gitea** の `npm-publish` が動き、社内 registry へ `@b4m/harenohi@X.Y.Z` を出す
3. ミラーが GitHub にタグを届ける（**tag push イベントは発火しない**）
4. ミラー確認後、npmjs 公開は手動で起動する:

```bash
gh workflow run publish.yml --ref vX.Y.Z -R b4moss/harenohi
```

このとき `github.ref` は `refs/tags/vX.Y.Z`、`github.event_name` は `workflow_dispatch`。ブランチ ref での dispatch はガードで拒否する。

失敗時:

- どちらか一方だけ成功しても、もう一方は **自動ではロールバックしない**
- 版番号は両経路で同じ `X.Y.Z` を使う。再実行は「未公開の経路だけ」を対象にする（npm 側は既に版があれば skip）
- 社内のみ再公開したい場合は Gitea の `workflow_dispatch` を使う
- npmjs のみ再公開したい場合は上記 `gh workflow run ... --ref vX.Y.Z` を使う
- 片方が失敗したら、ログを確認してから同タグの再実行または次の patch で揃える

## GitHub Actions（npmjs）

### 権限・環境

| 項目 | 内容 |
|------|------|
| `permissions` | `contents: read`、`id-token: write` |
| `runs-on` | `ubuntu-latest` |
| `environment` | `npm-publish`（deployment は `v*` タグのみ許可） |
| Node | 24（`registry-url: https://registry.npmjs.org`。release では npm cache を使わない） |
| npm | **11.5.1 以上**（Trusted Publishing 要件。不足なら workflow 内で更新） |
| actions | checkout / setup-node を **SHA 固定** |

### ジョブの流れ

1. `github.ref` が `refs/tags/vX.Y.Z`（plain SemVer）であること（不一致なら失敗。ブランチ dispatch も拒否）
2. タグと `package.json.version` と `src/version.ts` の `VERSION` が一致するか確認（不一致なら失敗。CI で版を書き換えない）
3. `npm ci` → lint → typecheck → test → build
4. `npm pack --dry-run`
5. その版が npm に既にあれば **skip**
6. `npm publish --access public --provenance`
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

## 公開準備の状況（2026-10-27 時点）

| 項目 | 状態 |
|------|------|
| GitHub リポ | `b4moss/harenohi` を **public** で作成済み |
| GitHub Environment | `npm-publish` を作成済み。デプロイを許すのは **`v*` タグだけ** |
| push mirror（Gitea → GitHub） | `git push --mirror` で同期。**ミラーは tag push イベントを起こさない**ため、npmjs の `publish.yml` は `workflow_dispatch`（`--ref vX.Y.Z`）で起動する（決定 2026-10-27） |
| `NPM_TOKEN` / Trusted Publisher | 初版以降の切替は運用に従う |
| 社内レジストリ | `0.4.1` は社内のみ公開済み。npmjs は `0.4.2` から `workflow_dispatch` 経路で出す |
| NOTICE | 出典が書いてあれば問題ない（2026-10-26 PO）。D-10 の「要確認」は解消 |

### 初版のタグ

既存タグ `v0.4.0` は `.github/workflows/publish.yml` が入る**前**のコミットを指す。そのため「`0.4.0` のまま初版を出す」はタグでは動かない（`publish.yml` はタグが指すコミットの workflow で動く）。検討した案:

- **(a) パッチ版を上げる**: `0.4.1` に版を揃えてから `v0.4.1` を打ち、これを npmjs の初版にする
- **(b)** `publish.yml` に `workflow_dispatch` を足し、当時の `main` から `0.4.0` を出す
- **(c)** 既存タグ `v0.4.0` を打ち直す（公開済みタグの付け替えになる）

**決定（2026-10-26）：案 a、0.4.1 で初回公開（版揃え）。**  
**追記（2026-10-27）：** ミラーが tag push を発火しないため、npmjs 公開は `workflow_dispatch`（`gh workflow run publish.yml --ref vX.Y.Z -R b4moss/harenohi`）で行う。`0.4.1` は社内のみ、npmjs 向けは `0.4.2`（本変更）で揃える。


## 公開前チェックリスト（人手）

1. `package.json` の `version` と `src/version.ts` の `VERSION` を同じ `X.Y.Z` にする
2. main にマージ済みであること
3. GitHub に public リポ `b4moss/harenohi` と Environment `npm-publish` があること（初版時は `NPM_TOKEN`）
4. Gitea → GitHub の push mirror（タグ含む）が済みであること
5. main に `vX.Y.Z` タグを打ち、ミラーで GitHub に届いていること
6. `gh workflow run publish.yml --ref vX.Y.Z -R b4moss/harenohi` で npmjs 公開を起動する
7. 公開後: Trusted Publisher（workflow `publish.yml`、environment `npm-publish`）を登録し、`NPM_TOKEN` を revoke / 削除

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
