/** 1件の祝日（または法令上の休日） */
export interface Holiday {
  /** 表示名（例: "元日", "振替休日", "国民の休日"） */
  title: string
  /** YYYY-MM-DD */
  date: string
}

export type HolidayList = Holiday[]

export type HolidayWarning = {
  code: 'YEAR_BEFORE_MIN'
  year: number
  message: string
}

export type HolidayQueryOptions = {
  onWarning?: (w: HolidayWarning) => void
}
