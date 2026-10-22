---
title: "ci-cd"
type: Spec
status: draft
timestamp: 2026-10-22
---

# CI/CD 運用

憲章 [charter/ci-cd.md](../charter/ci-cd.md) の、このパッケージでの実装。契約テストは [tests/ci](../tests/ci/README.md)。

## CI（`.gitea/workflows/ci.yml`）

- 起動: `pull_request`（`main` / `develop` / `dev-*` / `cursor/**`）と `workflow_dispatch`
- `paths-ignore`: `docs/**`, `**/*.md`
- `concurrency`: `ci-${{ github.event.pull_request.number || github.ref }}`、`cancel-in-progress: true`
- 上流 PR（head が `develop`、base が `main`）は job の `if` で skip する
- 手順: `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build`
- Node 24、`actions/setup-node` の `cache: npm`、`runs-on: ubuntu-latest`
- E2E は含めない。手動実行用の E2E ワークフローも現状は置かない（UI を持たないライブラリのため）

## 祝日 CSV 取得（`.gitea/workflows/fetch-holiday-csv.yml`）

- `schedule` と `workflow_dispatch` のみ。`pull_request` では起動しない

## Lint

- `npm run lint`（`eslint .`）
- 設定は `eslint.config.js`（`@eslint/js` と `typescript-eslint` の recommended、`dist/` と `node_modules/` を無視）

----

以上
