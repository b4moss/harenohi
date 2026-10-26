---
title: "display-title-i18n"
type: Spec
status: draft
timestamp: 2026-10-22
---

# 祝日名の表示用多言語（en）

Issue #10 / W-T1〜W-T8。コア API の `Holiday.title`（日本語）は変えず、表示用タイトルを別エントリで提供する（semver MINOR 相当）。

## エントリ

| subpath | 内容 |
|---------|------|
| `@b4moss/harenohi` | 既存 API のみ。`title` は日本語 |
| `@b4moss/harenohi/locales` | `getDisplayTitle` および英名マップの再エクスポート |
| `@b4moss/harenohi/locales/en` | 英語タイトルマップ・CSV「休日」対応表 |

## API

```ts
import { getDisplayTitle } from '@b4moss/harenohi/locales'
import { enTitles, csvHolidayCorrespondence } from '@b4moss/harenohi/locales/en'

getDisplayTitle(holiday, 'en') // 英訳または日本語フォールバック
getDisplayTitle(holiday)       // 日本語 title のまま
```

- `locale` は必須にしない
- 未対応ロケール・訳欠落は **日本語へフォールバック**（エラーにしない）
- v1 時点でサポートする表示ロケールは **en のみ**

## 英語名の出典（W-T1 / W-T8）

現行16祝日の英名の第一の正は、日本法令外国語訳データベースの「国民の祝日に関する法律（Act on National Holidays）」英訳である。

- 条文: https://www.japaneselawtranslation.go.jp/en/laws/view/4846/en
- 利用規約: https://www.japaneselawtranslation.go.jp/en/index/terms

**参考訳であり正文ではない。** 正文は日本語の法令のみ。

## 振替・国民の休日・CSV「休日」（W-T2）

法令英訳第3条に固有英名はない。社内固定訳:

| 日本語 | 英語 | 備考 |
|--------|------|------|
| 振替休日 | Substitute Holiday | 演算パスの名称 |
| 国民の休日 | Citizens' Holiday | 演算パスの名称 |
| 休日 | Public Holiday | 政府 CSV / override の不透明ラベル |

`csvHolidayCorrespondence['休日']` は、CSV の「休日」が演算側の `振替休日` / `国民の休日` のどちらにも当たり得ることを示す。

## 歴史名・一回限り（W-T7）

日本語の正式 `title` をキーに訳を引く。override 年も同様。

### 歴史名（法令英訳あり）

| 日本語 | en |
|--------|-----|
| 体育の日 | Health and Sports Day |

（スポーツの日改称前の日本語名キー。旧称用。PO 承認 2026-10-22）

### 一回限り・英訳なし → ローマ字（PO 決定 2026-10-22）

法令・観光公式などの固有英名が無い名称は、**発音に寄せたヘボン式ローマ字**で `en` を返す。

#### 表記ルール

- ヘボン式を基本とする
- **ASCII のみ**（長音記号・マクロン・サーカムフレックスは使わない。例: ō → `o`）
- 助詞「の」は `no`（小文字）
- 各語の先頭は大文字（Title Case）。括弧内も同様
- 全角括弧 `（）` は半角 `()` に置き換える
- カタカナ外来語もヘボン式に写す（例: スポーツ → `Supotsu`）
- 対応表に無い将来の未知名称は **日本語フォールバック**（W-T4。エラーにしない）

#### 対応表

| 日本語 | en（ローマ字） |
|--------|----------------|
| 即位礼正殿の儀 | Sokuirei Seiden no Gi |
| 大喪の礼 | Taiso no Rei |
| 結婚の儀 | Kekkon no Gi |
| 休日（祝日扱い） | Kyujitsu (Shukujitsu Atsukai) |
| 体育の日（スポーツの日） | Taiiku no Hi (Supotsu no Hi) |

## U-07 との関係

U-07（国・ロケール引数なし）は **コアの祝日演算 API** に対する決定のまま。表示名の `locale` は本仕様の追加 API のみで、既存 `getHolidaysOfYear` 等には付けない。

テスト仕様: [../tests/i18n/display-title.md](../tests/i18n/display-title.md)

----

以上
