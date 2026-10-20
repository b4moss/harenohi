export type HolidayEntry = { title: string; date: string }

export function parseLine(
  line: string
): { year: number; entry: HolidayEntry } | null

export function parseCsvText(csv: string): Record<number, HolidayEntry[]>

export function decodeCsvBuffer(buf: Buffer): string

export function writeOverrides(byYear: Record<number, HolidayEntry[]>): number[]
