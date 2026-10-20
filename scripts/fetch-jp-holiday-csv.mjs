import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const outPath = path.join(
  projectRoot,
  'src',
  'data',
  'jp-holiday',
  'source',
  'syukujitsu.csv'
)

/** 内閣府「国民の祝日」CSV */
export const JP_HOLIDAY_CSV_URL =
  'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv'

async function main() {
  const res = await fetch(JP_HOLIDAY_CSV_URL)
  if (!res.ok) {
    console.error(`Failed to fetch CSV: HTTP ${res.status} ${res.statusText}`)
    process.exit(1)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
  console.log(`wrote ${outPath} (${buf.length} bytes)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
