#!/usr/bin/env node
/**
 * pull-from-figma.js
 * Reads Variables from Figma and writes back to
 * packages/tokens/tokens/base.json + theme.json
 *
 * Usage:
 *   node figma-sync/pull-from-figma.js
 *
 * Required env vars (in .env at repo root):
 *   FIGMA_TOKEN    — Personal Access Token from Figma Settings
 *   FIGMA_FILE_KEY — File key from the Figma URL
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

config({ path: resolve(ROOT, '.env') })

// ─── Config ────────────────────────────────────────────────────────────────

const TOKEN    = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY

if (!TOKEN || !FILE_KEY) {
  console.error('❌  Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env')
  process.exit(1)
}

const API = 'https://api.figma.com/v1'

// ─── Helpers ───────────────────────────────────────────────────────────────

async function figma(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'X-Figma-Token': TOKEN },
  })
  const json = await res.json()
  if (!res.ok) {
    console.error(`❌  Figma API error [${res.status}]:`, JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

/** Converts Figma RGBA (0–1) to hex string */
function figmaColorToHex({ r, g, b, a = 1 }) {
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0')
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  return a < 1 ? `${hex}${toHex(a)}` : hex
}

/** Sets a value in a nested object using a slash-separated path */
function setNested(obj, path, value) {
  const parts = path.split('/')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

/** Maps Figma resolvedType back to Style Dictionary token type */
function figmaTypeToTokenType(resolvedType, varName) {
  if (resolvedType === 'COLOR') return 'color'
  if (resolvedType === 'FLOAT') {
    if (varName.startsWith('space/'))        return 'spacing'
    if (varName.startsWith('font/size/'))    return 'fontSizes'
    if (varName.startsWith('font/weight/'))  return 'fontWeights'
    if (varName.startsWith('font/lineHeight/')) return 'lineHeights'
    if (varName.startsWith('radius/'))       return 'borderRadius'
    return 'spacing'
  }
  if (resolvedType === 'STRING') {
    if (varName.startsWith('font/family/'))  return 'fontFamilies'
    if (varName.startsWith('font/letterSpacing/')) return 'letterSpacing'
    if (varName.startsWith('shadow/'))       return 'boxShadow'
    if (varName.startsWith('transition/'))   return 'other'
    if (varName.startsWith('zIndex/'))       return 'other'
    return 'other'
  }
  return 'other'
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄  Fetching variables from Figma...')

  const data = await figma(`/files/${FILE_KEY}/variables/local`)

  const collections = data.meta?.variableCollections ?? {}
  const variables   = data.meta?.variables ?? {}

  console.log(`   ✓ ${Object.keys(collections).length} collections`)
  console.log(`   ✓ ${Object.keys(variables).length} variables`)

  // Build collectionId → name lookup
  const collectionNameById = {}
  for (const [id, col] of Object.entries(collections)) {
    collectionNameById[id] = col.name
  }

  // Build variableId → variable lookup (for alias resolution)
  const variableById = variables

  const baseOut  = {}
  const themeOut = {}

  for (const variable of Object.values(variables)) {
    const collectionName = collectionNameById[variable.variableCollectionId]
    const isBase  = collectionName === 'Primitives'
    const isTheme = collectionName === 'Semantic'

    if (!isBase && !isTheme) continue

    const varName = variable.name  // e.g. "color/void/500"
    const modeId  = Object.keys(variable.valuesByMode)[0]
    const raw     = variable.valuesByMode[modeId]

    let value
    let type = figmaTypeToTokenType(variable.resolvedType, varName)

    // Alias variable → resolve to reference format
    if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
      const refVar = variableById[raw.id]
      if (refVar) {
        // Convert slash path back to dot notation for theme.json references
        const dotPath = refVar.name.replace(/\//g, '.')
        value = `{${dotPath}}`
      } else {
        continue
      }
    } else {
      // Concrete value
      switch (variable.resolvedType) {
        case 'COLOR':
          value = figmaColorToHex(raw)
          break
        case 'FLOAT':
          // Re-attach unit based on type
          if (type === 'spacing' || type === 'borderRadius') {
            value = `${raw}px`
          } else if (type === 'lineHeights') {
            value = String(raw)
          } else {
            value = `${raw}px`
          }
          break
        case 'STRING':
          value = String(raw)
          break
        default:
          value = String(raw)
      }
    }

    const token = { value, type }

    if (isBase) {
      setNested(baseOut, varName, token)
    } else {
      setNested(themeOut, varName, token)
    }
  }

  // ── Write files ───────────────────────────────────────────────────────────

  const basePath  = resolve(ROOT, 'packages/tokens/tokens/base.json')
  const themePath = resolve(ROOT, 'packages/tokens/tokens/theme.json')

  if (Object.keys(baseOut).length > 0) {
    writeFileSync(basePath, JSON.stringify(baseOut, null, 2) + '\n')
    console.log(`\n✅  base.json updated  (${countLeaves(baseOut)} tokens)`)
  } else {
    console.log('\n⚠️   No Primitives collection found in Figma — base.json unchanged')
  }

  if (Object.keys(themeOut).length > 0) {
    writeFileSync(themePath, JSON.stringify(themeOut, null, 2) + '\n')
    console.log(`✅  theme.json updated (${countLeaves(themeOut)} tokens)`)
  } else {
    console.log('⚠️   No Semantic collection found in Figma — theme.json unchanged')
  }

  console.log('\n💡  Run `npm run build:tokens` to rebuild CSS/JS/SCSS output.')
}

function countLeaves(obj) {
  let count = 0
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object' && 'value' in v) count++
    else if (v && typeof v === 'object') count += countLeaves(v)
  }
  return count
}

main().catch(err => {
  console.error('❌  Unexpected error:', err)
  process.exit(1)
})
