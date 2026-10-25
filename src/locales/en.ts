/**
 * English display titles for Japanese holiday names.
 *
 * Primary source for the 16 current national holidays:
 * Act on National Holidays (Act No. 178 of 1948), English translation on the
 * Japanese Law Translation Database System.
 * https://www.japaneselawtranslation.go.jp/en/laws/view/4846/en
 *
 * These translations are reference materials, not official texts.
 * https://www.japaneselawtranslation.go.jp/en/index/terms
 *
 * Substitute / citizens / CSV opaque labels are internal fixed translations
 * (no proper nouns in Article 3 of the Act translation).
 */

/** Japanese title → English display title */
export const enTitles: Readonly<Record<string, string>> = {
  // Article 2 (current) — copied from JLT Act on National Holidays
  元日: "New Year's Day",
  成人の日: 'Coming-of-Age Day',
  建国記念の日: 'National Foundation Commemoration Day',
  天皇誕生日: "Emperor's Birthday",
  春分の日: 'Vernal Equinox Day',
  昭和の日: 'Showa Day',
  憲法記念日: 'Constitution Memorial Day',
  みどりの日: 'Greenery Day',
  こどもの日: "Children's Day",
  海の日: 'Marine Day',
  山の日: 'Mountain Day',
  敬老の日: 'Respect for the Aged Day',
  秋分の日: 'Autumnal Equinox Day',
  スポーツの日: 'Sports Day',
  文化の日: 'Culture Day',
  勤労感謝の日: 'Labor Thanksgiving Day',

  // Internal fixed translations (Article 3 has no proper English names)
  振替休日: 'Substitute Holiday',
  国民の休日: "Citizens' Holiday",

  // Government CSV opaque label「休日」(covers substitute and citizens holidays)
  休日: 'Public Holiday',

  // Historical Japanese title key (former Act name before Sports Day rename)
  体育の日: 'Health and Sports Day',

  // One-off / no official English: Hepburn romaji, ASCII only, no macrons
  即位礼正殿の儀: 'Sokuirei Seiden no Gi',
  大喪の礼: 'Taiso no Rei',
  結婚の儀: 'Kekkon no Gi',
  '休日（祝日扱い）': 'Kyujitsu (Shukujitsu Atsukai)',
  '体育の日（スポーツの日）': 'Taiiku no Hi (Supotsu no Hi)',
}


export type CsvHolidayCorrespondence = {
  /** Titles used by harenohi compute path for the same legal mechanism */
  computeTitles: readonly string[]
  /** English label when the CSV/override title is literally「休日」 */
  en: string
  note: string
}

/**
 * Correspondence between government CSV「休日」and compute-path titles.
 * CSV does not distinguish substitute vs citizens holidays by name.
 */
export const csvHolidayCorrespondence: Readonly<
  Record<'休日', CsvHolidayCorrespondence>
> = {
  休日: {
    computeTitles: ['振替休日', '国民の休日'],
    en: 'Public Holiday',
    note: 'Government CSV uses 休日 for both substitute and citizens holidays',
  },
}
