# @b4moss/harenohi

[![npm version](https://img.shields.io/npm/v/@b4moss/harenohi.svg)](https://www.npmjs.com/package/@b4moss/harenohi)

祝日演算ライブラリ（TypeScript / npm）。当面は日本の祝日。

```bash
npm install @b4moss/harenohi
```

詳細は [`docs/`](docs/) を正本とする。

| 文書 | 内容 |
|------|------|
| [docs/README.md](docs/README.md) | 目的・スコープ・技術方針（pillar） |
| [docs/roadmap.md](docs/roadmap.md) | 版・マイルストーン |
| [docs/plans/](docs/plans/) | これからやる内容（未実装仕様） |
| [docs/specs/](docs/specs/) | 実装済み仕様 |
| 開発憲章 | AGENTS.md の「開発憲章（charter）」節 → [b4moss/charter v1](https://github.com/b4moss/charter/tree/v1/docs/charter) |
| [docs/specs/npm-publish.md](docs/specs/npm-publish.md) | npmjs.org 公開と社内レジストリ併存 |
| [NOTICE](NOTICE) | 同梱データの出典と利用規約 |
| [`.devcontainer/`](.devcontainer/) | 開発コンテナ（Node 24） |

## 使い方

```ts
import { getHolidaysOfYear } from '@b4moss/harenohi'
import { getDisplayTitle } from '@b4moss/harenohi/locales'

const holidays = getHolidaysOfYear(2026)
getDisplayTitle(holidays[0]!, 'en')
```

現行16祝日の英名は、日本法令外国語訳データベースの「国民の祝日に関する法律（[Act on National Holidays](https://www.japaneselawtranslation.go.jp/en/laws/view/4846/en)）」英訳を第一の正とする。**参考訳であり正文ではない**（[Terms of Use](https://www.japaneselawtranslation.go.jp/en/index/terms)）。詳細は [docs/specs/display-title-i18n.md](docs/specs/display-title-i18n.md)。同梱データの出典は [NOTICE](NOTICE)。

## 社内レジストリ（任意）

社内 Gitea Packages では当面 `@b4m/harenohi` としても公開する（npmjs の `@b4moss/harenohi` と併存）。手順は [docs/specs/npm-publish.md](docs/specs/npm-publish.md)。

----

以上
