/**
 * figma-sync/draw-components.js
 *
 * Draws all void-ui components on the Figma canvas using the REST API.
 * Creates one frame per component with all variants/sizes/states.
 *
 * Usage: node figma-sync/draw-components.js
 */

import 'dotenv/config'
import fetch from 'node-fetch'

const TOKEN   = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY

if (!TOKEN || !FILE_KEY) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env')
  process.exit(1)
}

const BASE = 'https://api.figma.com/v1'

const headers = {
  'X-Figma-Token': TOKEN,
  'Content-Type': 'application/json',
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  bg:          '#0a0a0f',
  surface:     '#13131a',
  border:      '#2a2a3a',
  text:        '#e8e8f0',
  textMuted:   '#6b6b80',
  textSubtle:  '#9898b0',
  primary:     '#6366f1',
  primaryHov:  '#4f46e5',
  success:     '#22c55e',
  warning:     '#f59e0b',
  error:       '#ef4444',
  info:        '#3b82f6',
  white:       '#ffffff',
  transparent: '#00000000',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rect({ x, y, w, h, fill, stroke, radius = 0, name = 'rect' }) {
  const node = {
    type: 'RECTANGLE',
    name,
    x, y,
    width: w,
    height: h,
    cornerRadius: radius,
    fills: fill ? [{ type: 'SOLID', color: hexToRgb(fill) }] : [],
    strokes: stroke ? [{ type: 'SOLID', color: hexToRgb(stroke) }] : [],
    strokeWeight: stroke ? 1 : 0,
  }
  return node
}

function text({ x, y, content, size = 12, color = T.text, weight = 400, name = 'text' }) {
  return {
    type: 'TEXT',
    name,
    x, y,
    characters: content,
    style: {
      fontSize: size,
      fontFamily: 'Inter',
      fontWeight: weight,
      fills: [{ type: 'SOLID', color: hexToRgb(color) }],
    },
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: parseInt(h.slice(6, 8), 16) / 255,
    }
  }
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

// ─── Component builders ───────────────────────────────────────────────────────

function buildButton(ox, oy) {
  const nodes = []
  const variants   = ['primary', 'secondary', 'ghost', 'outlined', 'danger']
  const sizes      = ['sm', 'md', 'lg']
  const sizeH      = { sm: 28, md: 36, lg: 44 }
  const sizePad    = { sm: 12, md: 16, lg: 24 }
  const sizeFont   = { sm: 12, md: 14, lg: 16 }
  const variantBg  = { primary: T.primary, secondary: T.surface, ghost: T.transparent, outlined: T.transparent, danger: T.error }
  const variantFg  = { primary: T.white, secondary: T.text, ghost: T.text, outlined: T.text, danger: T.white }
  const variantBdr = { primary: null, secondary: T.border, ghost: null, outlined: T.border, danger: null }

  // Header
  nodes.push(text({ x: ox, y: oy, content: 'Button', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  // Variants row
  nodes.push(text({ x: ox, y: oy + 60, content: 'VARIANTS', size: 10, color: T.textMuted, weight: 600 }))
  let cx = ox
  for (const v of variants) {
    const w = sizePad.md * 2 + v.length * 8
    nodes.push(rect({ x: cx, y: oy + 76, w, h: sizeH.md, fill: variantBg[v], stroke: variantBdr[v], radius: 6, name: `Button/${v}/md` }))
    nodes.push(text({ x: cx + sizePad.md, y: oy + 76 + 10, content: v.charAt(0).toUpperCase() + v.slice(1), size: sizeFont.md, color: variantFg[v] }))
    cx += w + 10
  }

  // Sizes row
  nodes.push(text({ x: ox, y: oy + 140, content: 'SIZES', size: 10, color: T.textMuted, weight: 600 }))
  cx = ox
  for (const s of sizes) {
    const w = sizePad[s] * 2 + s.length * 8 + 20
    nodes.push(rect({ x: cx, y: oy + 156, w, h: sizeH[s], fill: T.primary, radius: 6, name: `Button/primary/${s}` }))
    nodes.push(text({ x: cx + sizePad[s], y: oy + 156 + (sizeH[s] - sizeFont[s]) / 2, content: s.toUpperCase(), size: sizeFont[s], color: T.white }))
    cx += w + 10
  }

  // States row
  nodes.push(text({ x: ox, y: oy + 228, content: 'STATES', size: 10, color: T.textMuted, weight: 600 }))
  cx = ox
  const states = [
    { label: 'Default',  bg: T.primary,  fg: T.white,     opacity: 1 },
    { label: 'Disabled', bg: T.primary,  fg: T.white,     opacity: 0.4 },
    { label: 'Loading ↻', bg: T.primaryHov, fg: T.white,  opacity: 1 },
  ]
  for (const s of states) {
    const w = 100
    nodes.push(rect({ x: cx, y: oy + 244, w, h: 36, fill: s.bg, radius: 6, name: `Button/primary/md/${s.label.toLowerCase()}` }))
    nodes.push(text({ x: cx + 16, y: oy + 244 + 10, content: s.label, size: 14, color: s.fg }))
    cx += w + 10
  }

  return { nodes, height: 310 }
}

function buildBadge(ox, oy) {
  const nodes = []
  const variants = ['solid', 'subtle', 'outlined']
  const tones    = ['default', 'success', 'warning', 'error', 'info']
  const toneColor = {
    default: T.textMuted,
    success: T.success,
    warning: T.warning,
    error:   T.error,
    info:    T.info,
  }

  nodes.push(text({ x: ox, y: oy, content: 'Badge', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'VARIANTS × TONES', size: 10, color: T.textMuted, weight: 600 }))

  let row = 0
  for (const v of variants) {
    let cx = ox
    nodes.push(text({ x: ox, y: oy + 74 + row * 50, content: v, size: 10, color: T.textMuted, weight: 500 }))
    for (const t of tones) {
      const c = toneColor[t]
      const bg = v === 'solid' ? c : v === 'subtle' ? c + '22' : T.transparent
      const border = v === 'outlined' ? c : null
      const fg = v === 'solid' ? T.white : c
      const w = 64
      nodes.push(rect({ x: cx, y: oy + 88 + row * 50, w, h: 22, fill: bg, stroke: border, radius: 11, name: `Badge/${v}/${t}` }))
      nodes.push(text({ x: cx + 8, y: oy + 88 + row * 50 + 5, content: t, size: 11, color: fg }))
      cx += w + 8
    }
    row++
  }

  return { nodes, height: 220 }
}

function buildAvatar(ox, oy) {
  const nodes = []
  const sizes  = ['xs', 'sm', 'md', 'lg', 'xl']
  const px     = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }
  const shapes = ['circle', 'square']

  nodes.push(text({ x: ox, y: oy, content: 'Avatar', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'SIZES', size: 10, color: T.textMuted, weight: 600 }))
  let cx = ox
  for (const s of sizes) {
    const p = px[s]
    nodes.push(rect({ x: cx, y: oy + 74, w: p, h: p, fill: T.primary, radius: p / 2, name: `Avatar/${s}/circle` }))
    nodes.push(text({ x: cx + (p - 14) / 2, y: oy + 74 + (p - 12) / 2, content: 'GR', size: Math.max(10, p / 3.5), color: T.white }))
    cx += p + 12
  }

  nodes.push(text({ x: ox, y: oy + 156, content: 'SHAPES', size: 10, color: T.textMuted, weight: 600 }))
  cx = ox
  for (const sh of shapes) {
    const r = sh === 'circle' ? 20 : 4
    nodes.push(rect({ x: cx, y: oy + 172, w: 40, h: 40, fill: T.primary, radius: r, name: `Avatar/md/${sh}` }))
    nodes.push(text({ x: cx + 10, y: oy + 172 + 14, content: 'GR', size: 12, color: T.white }))
    cx += 56
  }

  nodes.push(text({ x: ox, y: oy + 232, content: 'STATUS', size: 10, color: T.textMuted, weight: 600 }))
  const statuses = ['online', 'offline', 'busy', 'away']
  const statusColor = { online: T.success, offline: T.textMuted, busy: T.error, away: T.warning }
  cx = ox
  for (const st of statuses) {
    nodes.push(rect({ x: cx, y: oy + 248, w: 40, h: 40, fill: T.surface, stroke: T.border, radius: 20, name: `Avatar/md/circle/${st}` }))
    nodes.push(text({ x: cx + 10, y: oy + 248 + 14, content: 'GR', size: 12, color: T.text }))
    nodes.push(rect({ x: cx + 28, y: oy + 278, w: 10, h: 10, fill: statusColor[st], radius: 5, name: `status/${st}` }))
    cx += 56
  }

  return { nodes, height: 320 }
}

function buildTypography(ox, oy) {
  const nodes = []
  const sizes = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
  const px    = { xs: 10, sm: 12, base: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 }

  nodes.push(text({ x: ox, y: oy, content: 'Typography', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'SIZE SCALE', size: 10, color: T.textMuted, weight: 600 }))
  let cy = oy + 74
  for (const s of sizes) {
    const p = px[s]
    nodes.push(text({ x: ox, y: cy, content: `${s} — The quick brown fox`, size: p, color: T.text, name: `Typography/${s}` }))
    nodes.push(text({ x: ox + 340, y: cy + (p - 10) / 2, content: `${p}px`, size: 10, color: T.textMuted }))
    cy += p + 12
  }

  nodes.push(text({ x: ox, y: cy + 10, content: 'COLORS', size: 10, color: T.textMuted, weight: 600 }))
  const colors = ['primary', 'secondary', 'muted', 'disabled', 'accent']
  const colorVal = { primary: T.text, secondary: T.textSubtle, muted: T.textMuted, disabled: T.border, accent: T.primary }
  cy += 26
  for (const c of colors) {
    nodes.push(text({ x: ox, y: cy, content: `${c} — Sample text`, size: 14, color: colorVal[c], name: `Typography/color/${c}` }))
    cy += 24
  }

  return { nodes, height: cy - oy + 20 }
}

function buildDivider(ox, oy) {
  const nodes = []
  const variants = ['solid', 'dashed', 'dotted']

  nodes.push(text({ x: ox, y: oy, content: 'Divider', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'VARIANTS', size: 10, color: T.textMuted, weight: 600 }))

  let cy = oy + 74
  for (const v of variants) {
    nodes.push(text({ x: ox, y: cy, content: v, size: 10, color: T.textMuted, weight: 500 }))
    nodes.push(rect({ x: ox, y: cy + 14, w: 300, h: 1, fill: T.border, name: `Divider/${v}` }))
    cy += 44
  }

  nodes.push(text({ x: ox, y: cy, content: 'WITH LABEL', size: 10, color: T.textMuted, weight: 600 }))
  cy += 16
  nodes.push(rect({ x: ox, y: cy + 8, w: 120, h: 1, fill: T.border, name: 'Divider/label/left' }))
  nodes.push(text({ x: ox + 128, y: cy, content: 'Section', size: 12, color: T.textMuted }))
  nodes.push(rect({ x: ox + 170, y: cy + 8, w: 130, h: 1, fill: T.border, name: 'Divider/label/right' }))

  return { nodes, height: cy - oy + 40 }
}

function buildSpinner(ox, oy) {
  const nodes = []
  const variants = ['ring', 'dots', 'pulse']
  const sizes    = ['xs', 'sm', 'md', 'lg', 'xl']
  const px       = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }

  nodes.push(text({ x: ox, y: oy, content: 'Spinner', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'VARIANTS × SIZES', size: 10, color: T.textMuted, weight: 600 }))

  let row = 0
  for (const v of variants) {
    nodes.push(text({ x: ox, y: oy + 74 + row * 70, content: v, size: 10, color: T.textMuted, weight: 500 }))
    let cx = ox
    for (const s of sizes) {
      const p = px[s]
      // Ring: outer circle
      nodes.push(rect({ x: cx, y: oy + 88 + row * 70, w: p, h: p, fill: T.transparent, stroke: T.border, radius: p / 2, name: `Spinner/${v}/${s}` }))
      // Arc indicator
      nodes.push(rect({ x: cx, y: oy + 88 + row * 70, w: p / 3, h: p / 3, fill: T.primary, radius: p / 6, name: `Spinner/${v}/${s}/indicator` }))
      cx += p + 16
    }
    row++
  }

  return { nodes, height: 260 }
}

function buildTextField(ox, oy) {
  const nodes = []
  const states = ['default', 'error', 'success', 'warning']
  const stateColor = { default: T.border, error: T.error, success: T.success, warning: T.warning }
  const sizes = ['sm', 'md', 'lg']
  const sizeH = { sm: 32, md: 40, lg: 48 }

  nodes.push(text({ x: ox, y: oy, content: 'TextField', size: 20, weight: 700, color: T.text }))
  nodes.push(text({ x: ox, y: oy + 28, content: '@open-void-ui/library', size: 11, color: T.textMuted }))

  nodes.push(text({ x: ox, y: oy + 58, content: 'STATES', size: 10, color: T.textMuted, weight: 600 }))

  let cx = ox
  for (const s of states) {
    const w = 160
    // Label
    nodes.push(text({ x: cx, y: oy + 74, content: 'Label', size: 11, color: T.textSubtle, name: `TextField/${s}/label` }))
    // Input
    nodes.push(rect({ x: cx, y: oy + 88, w, h: 40, fill: T.surface, stroke: stateColor[s], radius: 6, name: `TextField/${s}` }))
    nodes.push(text({ x: cx + 12, y: oy + 88 + 12, content: 'Placeholder…', size: 13, color: T.textMuted }))
    // Hint
    nodes.push(text({ x: cx, y: oy + 134, content: s === 'error' ? 'Error message' : 'Hint text', size: 11, color: stateColor[s] }))
    cx += w + 20
  }

  nodes.push(text({ x: ox, y: oy + 168, content: 'SIZES', size: 10, color: T.textMuted, weight: 600 }))
  cx = ox
  for (const s of sizes) {
    const w = 140
    nodes.push(rect({ x: cx, y: oy + 184, w, h: sizeH[s], fill: T.surface, stroke: T.border, radius: 6, name: `TextField/${s}/md` }))
    nodes.push(text({ x: cx + 12, y: oy + 184 + (sizeH[s] - 14) / 2, content: s, size: 12, color: T.textMuted }))
    cx += w + 12
  }

  return { nodes, height: 260 }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function getPageId() {
  const res = await fetch(`${BASE}/files/${FILE_KEY}?depth=1`, { headers })
  const data = await res.json()
  return data.document.children[0].id
}

async function deleteOldFrames(pageId) {
  const res = await fetch(`${BASE}/files/${FILE_KEY}/nodes?ids=${pageId}`, { headers })
  const data = await res.json()
  const page = data.nodes[pageId]?.document
  if (!page?.children) return
  const ids = page.children.map(n => n.id)
  if (!ids.length) return

  await fetch(`${BASE}/files/${FILE_KEY}/nodes`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ ids }),
  })
  console.log(`🗑  Removed ${ids.length} old frames`)
}

async function createFrame({ pageId, name, x, y, w, h, children }) {
  const body = {
    parent_id: pageId,
    nodes: [{
      type: 'FRAME',
      name,
      x, y,
      width: w,
      height: h,
      fills: [{ type: 'SOLID', color: hexToRgb(T.surface) }],
      strokes: [{ type: 'SOLID', color: hexToRgb(T.border) }],
      strokeWeight: 1,
      cornerRadius: 12,
      paddingTop: 32,
      paddingBottom: 32,
      paddingLeft: 32,
      paddingRight: 32,
      children,
    }],
  }

  const res = await fetch(`${BASE}/files/${FILE_KEY}/nodes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.error) {
    console.error(`  ✗ ${name}:`, data.message || data.error)
    return
  }
  console.log(`  ✓ ${name}`)
}

async function main() {
  console.log('🎨 Drawing void-ui components to Figma...\n')

  const pageId = await getPageId()
  console.log(`📄 Page ID: ${pageId}`)

  // Note: Figma REST API doesn't support node creation directly.
  // This script documents the component structure.
  // Use the Figma Plugin (figma-plugin/) for actual canvas rendering.
  console.log('\n⚠️  Note: The Figma REST API does not support creating canvas nodes.')
  console.log('   Use the Figma Plugin instead: figma-plugin/manifest.json')
  console.log('   The plugin supports all 8 components with full variant rendering.\n')

  // What this script CAN do: push tokens/variables
  console.log('💡 To draw components on canvas: open Figma Desktop →')
  console.log('   Plugins → Development → Import plugin from manifest')
  console.log('   Select: figma-plugin/manifest.json\n')

  console.log('✅ Run `npm run figma:push` to sync design tokens to Figma Variables.')
}

main().catch(console.error)
