# @b4m/harenohi

祝日演算ライブラリ（TypeScript / npm）。当面は日本の祝日。社内 Gitea レジストリ（`@b4m`）で配布し、公開時に `@b4moss/harenohi` へ移す。

詳細は [`docs/`](docs/) を正本とする。

| 文書 | 内容 |
|------|------|
| [docs/README.md](docs/README.md) | 目的・スコープ・技術方針（pillar） |
| [docs/roadmap.md](docs/roadmap.md) | 版・マイルストーン |
| [docs/plans/](docs/plans/) | これからやる内容（未実装仕様） |
| [docs/specs/](docs/specs/) | 実装済み仕様 |
| [docs/charter/](docs/charter/) | 開発憲章（[b4moss/charter](https://github.com/b4moss/charter) 由来） |
| [`.npmrc`](.npmrc) | `@b4m` → 社内 registry（トークンは環境変数） |
| [docs/specs/npm-publish.md](docs/specs/npm-publish.md) | 社内 npm 公開（`vX.Y.Z` タグ / Actions） |
| [`.devcontainer/`](.devcontainer/) | 開発コンテナ（Node 24） |

## 表示用タイトル（英語）

コアの `Holiday.title` は日本語のまま。表示用の英名は別エントリ:

```ts
import { getHolidaysOfYear } from '@b4m/harenohi'
import { getDisplayTitle } from '@b4m/harenohi/locales'

const holidays = getHolidaysOfYear(2026)
getDisplayTitle(holidays[0]!, 'en')
```

現行16祝日の英名は、日本法令外国語訳データベースの「国民の祝日に関する法律（[Act on National Holidays](https://www.japaneselawtranslation.go.jp/en/laws/view/4846/en)）」英訳を第一の正とする。**参考訳であり正文ではない**（[Terms of Use](https://www.japaneselawtranslation.go.jp/en/index/terms)）。詳細は [docs/specs/display-title-i18n.md](docs/specs/display-title-i18n.md)。

----

以上
