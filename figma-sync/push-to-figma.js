#!/usr/bin/env node
/**
 * push-to-figma.js
 * Reads packages/tokens/tokens/base.json + theme.json
 * and creates/updates Figma Variables via the REST API.
 *
 * Usage:
 *   node figma-sync/push-to-figma.js
 *
 * Required env vars (in .env at repo root):
 *   FIGMA_TOKEN   — Personal Access Token from Figma Settings
 *   FIGMA_FILE_KEY — File key from the Figma URL
 */

import { readFileSync } from 'fs'
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

async function figma(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'X-Figma-Token': TOKEN,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const json = await res.json()

  if (!res.ok) {
    console.error(`❌  Figma API error [${res.status}]:`, JSON.stringify(json, null, 2))
    process.exit(1)
  }

  return json
}

/** Converts hex color to Figma RGBA (0–1 range) */
function hexToFigmaColor(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const a = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) / 255 : 1
  return { r, g, b, a }
}

/** Flattens nested token object into dot-notation paths
 *  { color: { void: { 500: { value: '#...' } } } }
 *  → { 'color/void/500': { value: '#...', type: 'color' } }
 */
function flattenTokens(obj, prefix = '') {
  const result = {}
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}/${key}` : key
    if (val && typeof val === 'object' && 'value' in val) {
      result[path] = val
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenTokens(val, path))
    }
  }
  return result
}

/** Resolve theme.json references like "{color.void.600}" → actual value from base */
function resolveReference(ref, baseFlat) {
  const match = ref.match(/^\{(.+)\}$/)
  if (!match) return ref
  const dotPath = match[1].replace(/\./g, '/')
  return baseFlat[dotPath]?.value ?? ref
}

// ─── Collection definitions ─────────────────────────────────────────────────
// Each collection maps to a Figma Variable Collection

const COLLECTIONS = {
  'Primitives': 'base',
  'Semantic':   'theme',
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄  Reading token files...')

  const base  = JSON.parse(readFileSync(resolve(ROOT, 'packages/tokens/tokens/base.json'),  'utf8'))
  const theme = JSON.parse(readFileSync(resolve(ROOT, 'packages/tokens/tokens/theme.json'), 'utf8'))

  const baseFlat  = flattenTokens(base)
  const themeFlat = flattenTokens(theme)

  console.log(`   ✓ base.json  — ${Object.keys(baseFlat).length} tokens`)
  console.log(`   ✓ theme.json — ${Object.keys(themeFlat).length} tokens`)

  // ── 1. Get existing collections ───────────────────────────────────────────
  console.log('\n🔄  Fetching existing Figma variables...')
  const existing = await figma('GET', `/files/${FILE_KEY}/variables/local`)

  const existingCollections = existing.meta?.variableCollections ?? {}
  const existingVariables   = existing.meta?.variables ?? {}

  // Build lookup: collectionName → id
  const collectionIdByName = {}
  for (const [id, col] of Object.entries(existingCollections)) {
    collectionIdByName[col.name] = id
  }

  // Build lookup: "collectionId/varName" → variableId
  const variableIdByKey = {}
  for (const [id, v] of Object.entries(existingVariables)) {
    variableIdByKey[`${v.variableCollectionId}/${v.name}`] = id
  }

  console.log(`   ✓ Found ${Object.keys(existingCollections).length} existing collections`)
  console.log(`   ✓ Found ${Object.keys(existingVariables).length} existing variables`)

  // ── 2. Build POST payload ─────────────────────────────────────────────────

  const variableCollections = []
  const variables           = []
  const variableModeValues  = []

  // We use temp IDs for newly created collections/modes
  let tempId = 1
  const newTempId = () => `temp-${tempId++}`

  for (const [collectionName, tokenSource] of Object.entries(COLLECTIONS)) {
    const tokens = tokenSource === 'base' ? baseFlat : themeFlat

    const existingColId = collectionIdByName[collectionName]
    let collectionId    = existingColId
    let modeId

    if (!existingColId) {
      // Create new collection
      collectionId = newTempId()
      variableCollections.push({
        action: 'CREATE',
        id: collectionId,
        name: collectionName,
        initialModeId: newTempId(),
      })
      modeId = variableCollections.at(-1).initialModeId
    } else {
      // Use first mode of existing collection
      modeId = existingCollections[existingColId].modes?.[0]?.modeId
    }

    for (const [tokenPath, token] of Object.entries(tokens)) {
      const varName    = tokenPath          // e.g. "color/void/500"
      const existingVarId = variableIdByKey[`${collectionId}/${varName}`]
      let variableId   = existingVarId
      const resolvedType = resolveType(token.type)

      if (!existingVarId) {
        // Create variable
        variableId = newTempId()
        variables.push({
          action:     'CREATE',
          id:          variableId,
          name:        varName,
          variableCollectionId: collectionId,
          resolvedType,
        })
      }

      // Resolve value
      let rawValue = token.value
      if (tokenSource === 'theme') {
        rawValue = resolveReference(rawValue, baseFlat)
      }

      const value = buildFigmaValue(resolvedType, rawValue)
      if (value === null) continue

      variableModeValues.push({
        action:     'UPDATE',
        variableId,
        modeId,
        value,
      })
    }
  }

  if (!variables.length && !variableModeValues.length) {
    console.log('\n✅  Nothing to update — Figma is already in sync.')
    return
  }

  // ── 3. POST to Figma ──────────────────────────────────────────────────────
  console.log(`\n🚀  Pushing to Figma...`)
  console.log(`   Collections : ${variableCollections.length} to create`)
  console.log(`   Variables   : ${variables.length} to create`)
  console.log(`   Mode values : ${variableModeValues.length} to update`)

  const payload = {
    variableCollections,
    variables,
    variableModeValues,
  }

  const result = await figma('POST', `/files/${FILE_KEY}/variables`, payload)

  if (result.error) {
    console.error('❌  Push failed:', result.error)
    process.exit(1)
  }

  console.log('\n✅  Done! Variables pushed to Figma successfully.')
  console.log(`   Open: https://www.figma.com/design/${FILE_KEY}`)
}

// ─── Type helpers ────────────────────────────────────────────────────────────

function resolveType(tokenType) {
  switch (tokenType) {
    case 'color':        return 'COLOR'
    case 'spacing':
    case 'fontSizes':
    case 'borderRadius':
    case 'lineHeights':  return 'FLOAT'
    case 'fontFamilies':
    case 'fontWeights':
    case 'letterSpacing':
    case 'boxShadow':
    case 'other':        return 'STRING'
    default:             return 'STRING'
  }
}

function buildFigmaValue(resolvedType, rawValue) {
  if (rawValue === undefined || rawValue === null) return null

  switch (resolvedType) {
    case 'COLOR': {
      if (typeof rawValue !== 'string' || !rawValue.startsWith('#')) return null
      return hexToFigmaColor(rawValue)
    }
    case 'FLOAT': {
      const num = parseFloat(String(rawValue))
      return isNaN(num) ? null : num
    }
    case 'STRING': {
      return String(rawValue)
    }
    default:
      return String(rawValue)
  }
}

main().catch(err => {
  console.error('❌  Unexpected error:', err)
  process.exit(1)
})
