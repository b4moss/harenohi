import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('scaffold (v0.1.0)', () => {
  it('TC-SCAF-03: package name is @b4m/harenohi', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      name: string
      publishConfig?: { registry?: string }
    }
    expect(pkg.name).toBe('@b4m/harenohi')
    expect(pkg.publishConfig?.registry).toBe(
      'https://git.b4m.jp/api/packages/b4m-packages/npm/'
    )
  })

  it('TC-SCAF-04: exports and types are ESM-oriented', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      type?: string
      types?: string
      exports?: { '.': { types?: string; import?: string } }
    }
    expect(pkg.type).toBe('module')
    expect(pkg.types).toBe('./dist/index.d.ts')
    expect(pkg.exports?.['.']?.types).toBe('./dist/index.d.ts')
    expect(pkg.exports?.['.']?.import).toBe('./dist/index.js')
    expect(pkg.exports?.['.']?.import?.endsWith('.cjs')).toBe(false)
  })

  it('placeholder export module loads', async () => {
    const mod = await import('../src/index.ts')
    expect(mod).toBeTypeOf('object')
  })
})
