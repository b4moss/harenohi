---
title: "api"
type: Plan
status: 仕様詳細
milestone: v1.0.0
timestamp: 2026-10-20
---

# 公開 API（v1.0.0）

状態: 仕様詳細（未実装）。実装後は `specs/` へ移す。

## 設計方針

- 引数の日付は文字列 `YYYY-MM-DD`（ゼロ埋め）。時刻・タイムゾーンは扱わない
- v1 は日本の国民の祝日のみ。ロケール引数は持たない（U-07 決定）
- 参照実装（`shikata-kohki-life`）の関数群を基にするが、パッケージ公開に耐える命名・型・エラー／警告を明示する
- 副作用なし（純関数）。ネットワーク I/O はランタイム API に含めない（データ更新はビルド / Actions）

## 型

```ts
/** 1件の祝日（または法令上の休日） */
export interface Holiday {
  /** 表示名（例: "元日", "振替休日", "国民の休日"） */
  title: string
  /** YYYY-MM-DD */
  date: string
}

export type HolidayList = Holiday[]
```

`title` は政府 CSV / 法令上の呼称に合わせる。英語名は v1 では出さない。

## 関数

### `getHolidaysOfYear(year: number): HolidayList`

その年の祝日・振替休日・国民の休日を、日付昇順で返す。

- `year` は整数の西暦
- 対象年にオーバーライドがあればそれを返す（演算しない）。CSV override は **1955 年以降**（入手可能年）に限る（N-D1。2026-10-20 PO 承認）
- なければ演算して返す。**1948〜1954** は政府 CSV が無いため **祝日法に基づく演算**で求める（N-D1）
- 対象開始年より前の年の扱いは [open-questions.md](open-questions.md) U-02 / D-15 および N-H1 決定: **エラーにせず空配列（祝日なし）を返す**。警告は第 2 引数 `options.onWarning?` に届ける（未指定時は何もしない）

### `getHolidaysOfMonth(year: number, month: number): HolidayList`

`getHolidaysOfYear` の結果を、その月（1–12）で絞り込む。

- `month` は 1–12。範囲外はエラー

### `getHoliday(date: string): Holiday | null`

その日が祝日等なら 1 件、でなければ `null`。

- `date` が `YYYY-MM-DD` でない、または暦として不正ならエラー（`null` に落とさない。参照実装は `null` だが、パッケージでは不正入力と「祝日でない」を分ける）

### `isHoliday(date: string): boolean`

`getHoliday(date) !== null` と同等。不正入力はエラー。

## エラーと警告

| 状況 | 振る舞い |
|------|----------|
| 日付文字列が形式不正 | 投げる（推奨型名: `HolidayInputError`） |
| 存在しない暦日（例: `2025-02-30`） | 同上 |
| `month` が 1–12 外 | 同上 |
| `year` が整数でない | 同上 |
| `year` が対象開始年（1948）より前 | **エラーにしない。** 空配列を返す。警告は `options.onWarning?` へ（N-H1 / U-02 / D-15） |

```ts
options?: { onWarning?: (w: { code: 'YEAR_BEFORE_MIN'; year: number; message: string }) => void }
```

`onWarning` 未指定時は警告を出さず空配列のみ（既存の 1 引数呼び出しを壊さない）。

ランタイムのネットワークエラーは公開 API に出ない。

## 互換性

- `v0.x`: 破壊的変更可
- `v1.x`: 上記シグネチャと `Holiday` 形を安定とみなす。フィールド追加は MINOR、削除・改名は MAJOR
- 返却配列の順序（日付昇順）は安定契約とする
- 同一日に複数名称があり得る場合の扱いは [japan-holidays.md](japan-holidays.md)（推奨: 日付一意。振替・国民の休日は別日）

## エントリポイント

- パッケージルートから上記を named export
- TypeScript 型定義を同梱
- モジュール形式は U-08 決定どおり ESM + 型定義

## テスト観点（API）

- 正常系: 既知の年・月・日で期待一覧 / 1 件 / true|false
- 異常系: 不正日付、範囲外 month
- 境界: 1948 年より前（空結果＋任意の onWarning）、**1948〜1954（演算）**、**1955 以降で override がある年（演算しない）**、うるう日を含む年、年末年始、GW（橋渡し休日）

詳細のテスト仕様書は実装着手時に `docs/tests/` へ書く（憲章 TDD）。

----

以上
