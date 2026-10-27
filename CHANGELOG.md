# Changelog

このプロジェクトの主な変更を版ごとに記す。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に近い。

## [Unreleased]

## [0.4.2] - 2026-10-27

### Changed

- GitHub Actions `publish.yml` に `workflow_dispatch` を追加。GitHub への push mirror（`git push --mirror`）はタグ push イベントを起こさないため、ミラー後に `gh workflow run publish.yml --ref vX.Y.Z` で npmjs 公開する。ガード（`refs/tags/vX.Y.Z` かつ `package.json` / `src/version.ts` 一致、`environment: npm-publish`、`--provenance`）は維持。0.4.1 は社内レジストリのみ公開済み。

## [0.4.1] - 2026-10-26

### Changed

- npmjs.org 公開の準備。公開名 `@b4moss/harenohi`、MIT、GitHub Actions の `publish.yml` から公開。機能変更なし。

## [0.4.0] - 2026-10-22

### Added

- 表示用英語タイトル（`@b4moss/harenohi/locales` / `locales/en`）
- 日本祝日演算 API・政府 CSV オーバーライド・CI / 社内 publish ワークフロー

[Unreleased]: https://github.com/b4moss/harenohi/compare/v0.4.2...HEAD
[0.4.2]: https://github.com/b4moss/harenohi/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/b4moss/harenohi/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/b4moss/harenohi/releases/tag/v0.4.0
