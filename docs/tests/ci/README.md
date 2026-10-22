---
title: "ci"
type: TestSpec
status: draft
timestamp: 2026-10-22
---

# CI ワークフロー契約テスト

憲章 [charter/ci-cd.md](../../charter/ci-cd.md) に対する `.gitea/workflows/*.yml` のテキスト契約。実装は [specs/ci-cd.md](../../specs/ci-cd.md)。

対象はワークフロー定義の文言（正規表現・行単位）。Actions の実行そのものは検証しない。

## ケース一覧

| ID | 区分 | 入力 | 期待 |
|----|------|------|------|
| TC-CI-01 | 正常 | `ci.yml` の `pull_request.branches` | `main`, `develop`, `dev-*`, `cursor/**` |
| TC-CI-02 | 正常 | `ci.yml` の `paths-ignore` | `docs/**`, `**/*.md` |
| TC-CI-03 | 正常 | `ci.yml` の `concurrency` | group が `ci-${{ github.event.pull_request.number \|\| github.ref }}`、`cancel-in-progress: true` |
| TC-CI-04 | 正常 | `ci.yml` の `on` | `workflow_dispatch` がある |
| TC-CI-05 | 正常 | `ci.yml` の job | 上流 PR（head `develop` / base `main`）を skip する job レベルの `if` |
| TC-CI-06 | 正常 | `ci.yml` の `run` 順 | `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` |
| TC-CI-07 | 正常 | `ci.yml` の runner / Node | `runs-on: ubuntu-latest`、Node 24、`cache: npm` |
| TC-CI-08 | 正常 | `fetch-holiday-csv.yml` の `on` | `schedule` と `workflow_dispatch` のみ。`pull_request` が無い |
| TC-CI-09 | 異常 | `ci.yml` のステップ | E2E 用の `run` が無い（E2E は CI に含めない） |

### TC-CI-01

- **入力:** `.gitea/workflows/ci.yml` の `pull_request.branches`
- **期待:** 開発ブランチと主要ブランチ、および cursor 作業ブランチが対象

### TC-CI-05

- **入力:** job 直下の `if`（ステップの `if` ではない）
- **期待:** `${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}`

### TC-CI-08

- **入力:** `.gitea/workflows/fetch-holiday-csv.yml` の `on`
- **期待:** 祝日 CSV 取得はスケジュールと手動実行のみ。PR では起動しない

----

以上
