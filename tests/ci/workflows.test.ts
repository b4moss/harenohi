import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')

function readWorkflow(name: string): string {
  return readFileSync(join(root, '.gitea/workflows', name), 'utf8')
}

function readGithubWorkflow(name: string): string {
  return readFileSync(join(root, '.github/workflows', name), 'utf8')
}

/** トップレベルキー（行頭）から次のトップレベルキー手前まで */
function topLevelBlock(yml: string, key: string): string {
  const lines = yml.split('\n')
  const start = lines.findIndex((line) => line === `${key}:` || line.startsWith(`${key}:`))
  if (start < 0) return ''
  const out = [lines[start]!]
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (/^[A-Za-z0-9_-]+:/.test(line)) break
    out.push(line)
  }
  return out.join('\n')
}

/** `key:` の直後に続く、より深いインデントの `- item` 一覧 */
function listItems(block: string, key: string): string[] {
  const lines = block.split('\n')
  const idx = lines.findIndex((line) => line.trim() === `${key}:` || line.trim().startsWith(`${key}:`))
  if (idx < 0) return []
  const keyIndent = lines[idx]!.match(/^ */)?.[0].length ?? 0
  const items: string[] = []
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (line.trim() === '' || line.trim().startsWith('#')) continue
    const indent = line.match(/^ */)?.[0].length ?? 0
    if (indent <= keyIndent) break
    const item = line.match(/^\s+-\s+(.+)$/)
    if (!item) break
    items.push(item[1]!.trim().replace(/^['"]|['"]$/g, ''))
  }
  return items
}

function jobBlock(yml: string, jobName: string): string {
  const lines = yml.split('\n')
  const start = lines.findIndex((line) => line === `  ${jobName}:`)
  if (start < 0) return ''
  const out = [lines[start]!]
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (/^ {2}[A-Za-z0-9_-]+:/.test(line)) break
    out.push(line)
  }
  return out.join('\n')
}

function runCommands(yml: string): string[] {
  return [...yml.matchAll(/^[ \t]+run:[ \t]*(.+)$/gm)].map((match) =>
    match[1]!.trim().replace(/^['"]|['"]$/g, ''),
  )
}

const UPSTREAM_SKIP_IF =
  "${{ !(github.event_name == 'pull_request' && github.head_ref == 'develop' && github.base_ref == 'main') }}"

describe('CI workflow contract', () => {
  const ci = readWorkflow('ci.yml')
  const onBlock = topLevelBlock(ci, 'on')
  const concurrency = topLevelBlock(ci, 'concurrency')
  const job = jobBlock(ci, 'test')

  it('TC-CI-01: pull_request targets main, develop, dev-*, and cursor/**', () => {
    const pr = onBlock.slice(onBlock.indexOf('pull_request:'))
    expect(listItems(pr, 'branches')).toEqual(['main', 'develop', 'dev-*', 'cursor/**'])
  })

  it('TC-CI-02: docs and markdown do not trigger CI', () => {
    const pr = onBlock.slice(onBlock.indexOf('pull_request:'))
    expect(listItems(pr, 'paths-ignore')).toEqual(['docs/**', '**/*.md'])
  })

  it('TC-CI-03: in-progress runs on the same PR or ref are cancelled', () => {
    expect(concurrency).toMatch(
      /^ {2}group: ci-\$\{\{ github\.event\.pull_request\.number \|\| github\.ref \}\}$/m,
    )
    expect(concurrency).toMatch(/^ {2}cancel-in-progress: true$/m)
  })

  it('TC-CI-04: workflow_dispatch remains available', () => {
    expect(onBlock).toMatch(/^ {2}workflow_dispatch:/m)
  })

  it('TC-CI-05: develop to main is skipped at job level', () => {
    const lines = job.split('\n')
    const ifIndex = lines.findIndex((line) => line.includes('if:'))
    const stepsIndex = lines.findIndex((line) => line.trim() === 'steps:')
    expect(lines[ifIndex]).toBe(`    if: ${UPSTREAM_SKIP_IF}`)
    expect(ifIndex).toBeGreaterThan(-1)
    expect(ifIndex).toBeLessThan(stepsIndex)
  })

  it('TC-CI-06: steps run npm ci, lint, typecheck, test, then build', () => {
    expect(runCommands(job)).toEqual([
      'npm ci',
      'npm run lint',
      'npm run typecheck',
      'npm test',
      'npm run build',
    ])
  })

  it('TC-CI-07: ubuntu-latest, Node 24, and npm cache', () => {
    expect(job).toMatch(/^ {4}runs-on: ubuntu-latest$/m)
    expect(job).toMatch(/^ {10}node-version: ['"]24['"]$/m)
    expect(job).toMatch(/^ {10}cache: npm$/m)
  })

  it('TC-CI-09: CI steps do not run E2E', () => {
    const commands = runCommands(job).join('\n')
    expect(commands).not.toMatch(/\be2e\b|playwright|cypress/i)
  })
})

describe('fetch-holiday-csv workflow contract', () => {
  const yml = readWorkflow('fetch-holiday-csv.yml')
  const onBlock = topLevelBlock(yml, 'on')

  it('TC-CI-08: schedule and workflow_dispatch only, no pull_request', () => {
    expect(onBlock).toMatch(/^ {2}schedule:/m)
    expect(onBlock).toMatch(/^ {2}workflow_dispatch:/m)
    expect(onBlock).not.toMatch(/pull_request:/)
  })
})

describe('GitHub publish.yml contract (npmjs)', () => {
  const yml = readGithubWorkflow('publish.yml')
  const onBlock = topLevelBlock(yml, 'on')
  const permissions = topLevelBlock(yml, 'permissions')
  const job = jobBlock(yml, 'publish')

  it('TC-PUB-01: tag push trigger is plain vX.Y.Z only', () => {
    expect(onBlock).toMatch(/tags:/)
    expect(onBlock).toMatch(/v\[0-9\]\+\.\[0-9\]\+\.\[0-9\]\+/)
    expect(onBlock).not.toMatch(/workflow_dispatch/)
  })

  it('TC-PUB-02: permissions include id-token: write and contents: read', () => {
    expect(permissions).toMatch(/^ {2}contents: read$/m)
    expect(permissions).toMatch(/^ {2}id-token: write$/m)
  })

  it('TC-PUB-03: verifies tag matches package.json and src/version.ts', () => {
    expect(yml).toMatch(/package\.json version/)
    expect(yml).toMatch(/src\/version\.ts/)
    expect(yml).toMatch(/does not match tag/)
  })

  it('TC-PUB-04: publishes with --access public (and provenance)', () => {
    expect(yml).toMatch(/npm publish --access public --provenance/)
  })

  it('TC-PUB-05: ubuntu-latest, environment npm-publish, Node 24 registry-url', () => {
    expect(job).toMatch(/^ {4}runs-on: ubuntu-latest$/m)
    expect(job).toMatch(/^ {4}environment: npm-publish$/m)
    expect(yml).toMatch(/node-version: ['"]24['"]/)
    expect(yml).toMatch(/registry-url: ['"]https:\/\/registry\.npmjs\.org['"]/)
  })
})

describe('Gitea npm-publish.yml contract (internal @b4m coexistence)', () => {
  const yml = readWorkflow('npm-publish.yml')

  it('TC-PUB-GITEA-01: temporarily rewrites name to @b4m/harenohi and uses --registry', () => {
    expect(yml).toMatch(/@b4m\/harenohi/)
    expect(yml).toMatch(/--registry/)
    expect(yml).toMatch(/temporary name for internal publish/)
  })
})
