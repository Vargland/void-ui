#!/usr/bin/env node
/**
 * draw-button.js
 * Creates a Button component showcase frame in the Figma file
 * using the current void-ui tokens as inline fills/strokes.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
config({ path: resolve(ROOT, '.env') })

const TOKEN    = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
const API      = 'https://api.figma.com/v1'

async function figma(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'X-Figma-Token': TOKEN, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const json = await res.json()
  if (!res.ok || json.err) {
    console.error('Figma API error:', JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

// ─── Token values (from base.json + theme.json) ───────────────────────────────

const C = {
  // backgrounds
  bgBase:    { r: 0.039, g: 0.039, b: 0.039, a: 1 }, // #0a0a0a
  bgSurface: { r: 0.102, g: 0.102, b: 0.102, a: 1 }, // #1a1a1a
  bgOverlay: { r: 0.141, g: 0.141, b: 0.141, a: 1 }, // #242424

  // borders
  borderDefault: { r: 0.180, g: 0.180, b: 0.180, a: 1 }, // #2e2e2e
  borderStrong:  { r: 0.322, g: 0.322, b: 0.322, a: 1 }, // #525252

  // text
  textPrimary:  { r: 0.961, g: 0.961, b: 0.961, a: 1 }, // #f5f5f5
  textMuted:    { r: 0.451, g: 0.451, b: 0.451, a: 1 }, // #737373
  textDisabled: { r: 0.322, g: 0.322, b: 0.322, a: 1 }, // #525252
  textInverse:  { r: 0.039, g: 0.039, b: 0.039, a: 1 }, // #0a0a0a

  // actions
  actionPrimary:      { r: 0.400, g: 0.400, b: 1.000, a: 1 }, // #6666ff
  actionPrimaryHover: { r: 0.533, g: 0.533, b: 1.000, a: 1 }, // #8888ff
  actionSecondary:    { r: 0.180, g: 0.180, b: 0.180, a: 1 }, // #2e2e2e
  actionSecHover:     { r: 0.239, g: 0.239, b: 0.239, a: 1 }, // #3d3d3d

  // status
  error: { r: 0.937, g: 0.267, b: 0.267, a: 1 }, // #ef4444

  // transparent
  transparent: { r: 0, g: 0, b: 0, a: 0 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _id = 1
const uid = () => `new:${_id++}`

function text(content, { x, y, color, size = 13, weight = 500, opacity = 1 }) {
  return {
    id: uid(),
    type: 'TEXT',
    name: content,
    x, y,
    width: 200,
    height: size * 1.5,
    opacity,
    characters: content,
    style: {
      fontFamily:   'Inter',
      fontPostScriptName: weight >= 600 ? 'Inter-SemiBold' : weight >= 500 ? 'Inter-Medium' : 'Inter-Regular',
      fontWeight:   weight,
      fontSize:     size,
      lineHeightPx: size * 1.5,
      letterSpacing: 0,
      textAlignHorizontal: 'LEFT',
    },
    fills: [{ type: 'SOLID', color, opacity }],
  }
}

function rect({ id, name, x, y, w, h, fill, stroke, strokeWeight = 1, radius = 4, opacity = 1 }) {
  return {
    id: id || uid(),
    type: 'RECTANGLE',
    name,
    x, y,
    width: w,
    height: h,
    opacity,
    cornerRadius: radius,
    fills: fill ? [{ type: 'SOLID', color: fill }] : [],
    strokes: stroke ? [{ type: 'SOLID', color: stroke }] : [],
    strokeWeight,
    strokeAlign: 'INSIDE',
  }
}

function group(name, children, { x = 0, y = 0 } = {}) {
  // Compute bounding box
  const minX = Math.min(...children.map(c => c.x))
  const minY = Math.min(...children.map(c => c.y))
  const maxX = Math.max(...children.map(c => c.x + (c.width || 100)))
  const maxY = Math.max(...children.map(c => c.y + (c.height || 36)))
  return {
    id: uid(),
    type: 'GROUP',
    name,
    x: x + minX,
    y: y + minY,
    width: maxX - minX,
    height: maxY - minY,
    fills: [],
    children,
  }
}

// ─── Button builder ───────────────────────────────────────────────────────────

function button({ label, x, y, variant = 'primary', size = 'md', disabled = false, loading = false }) {
  const sizes = {
    sm: { h: 28, px: 12, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, fontSize: 15, radius: 6 },
  }
  const s = sizes[size]
  const textWidth = label.length * (s.fontSize * 0.6)
  const w = textWidth + s.px * 2

  const variantStyles = {
    primary:   { fill: C.actionPrimary,   stroke: null,                textColor: C.textInverse  },
    secondary: { fill: C.actionSecondary, stroke: C.borderDefault,     textColor: C.textPrimary  },
    ghost:     { fill: C.transparent,     stroke: null,                textColor: C.textPrimary  },
    danger:    { fill: C.error,            stroke: null,                textColor: C.textInverse  },
  }

  const vs = variantStyles[variant]
  const opacity = disabled ? 0.4 : 1
  const bgId = uid()

  const bg = rect({
    id: bgId,
    name: `bg-${variant}`,
    x, y,
    w, h: s.h,
    fill: vs.fill,
    stroke: vs.stroke,
    radius: s.radius,
    opacity,
  })

  const labelNode = text(loading ? '⟳ ' + label : label, {
    x: x + s.px,
    y: y + (s.h - s.fontSize * 1.4) / 2,
    color: vs.textColor,
    size: s.fontSize,
    weight: 500,
    opacity,
  })

  return [bg, labelNode]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎨  Drawing Button component in Figma...')

  // Get page id
  const file = await figma('GET', `/files/${FILE_KEY}?depth=1`)
  const pageId = file.document.children[0].id
  console.log(`   Page: "${file.document.children[0].name}" (${pageId})`)

  // ── Layout constants ────────────────────────────────────────────────────────
  const PAD   = 48
  const GAP_X = 24
  const GAP_Y = 20
  const ROW_H = 44
  const SECTION_GAP = 48

  const children = []

  // ── Background canvas ───────────────────────────────────────────────────────
  const canvasW = 860
  const canvasH = 680

  children.push(rect({
    name: 'canvas-bg',
    x: 0, y: 0,
    w: canvasW, h: canvasH,
    fill: C.bgBase,
    radius: 12,
  }))

  // ── Title ───────────────────────────────────────────────────────────────────
  children.push(text('Button', {
    x: PAD, y: PAD,
    color: C.textPrimary,
    size: 22,
    weight: 600,
  }))
  children.push(text('@void-ui/library — v0.1.0', {
    x: PAD, y: PAD + 32,
    color: C.textMuted,
    size: 12,
    weight: 400,
  }))

  let curY = PAD + 80

  // ── Section: Variants ────────────────────────────────────────────────────────
  children.push(text('VARIANTS', {
    x: PAD, y: curY,
    color: C.textMuted,
    size: 11,
    weight: 600,
  }))
  curY += 24

  const variants = ['primary', 'secondary', 'ghost', 'danger']
  let curX = PAD
  for (const v of variants) {
    const nodes = button({ label: v.charAt(0).toUpperCase() + v.slice(1), x: curX, y: curY, variant: v })
    children.push(...nodes)
    curX += nodes[0].width + GAP_X
  }
  curY += ROW_H + SECTION_GAP

  // ── Section: Sizes ───────────────────────────────────────────────────────────
  children.push(text('SIZES', {
    x: PAD, y: curY,
    color: C.textMuted,
    size: 11,
    weight: 600,
  }))
  curY += 24

  curX = PAD
  const sizeBaseY = curY
  for (const [sz, szLabel] of [['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']]) {
    const sizes = { sm: { h: 28 }, md: { h: 36 }, lg: { h: 44 } }
    const offsetY = sizeBaseY + (44 - sizes[sz].h) / 2
    const nodes = button({ label: szLabel, x: curX, y: offsetY, variant: 'primary', size: sz })
    children.push(...nodes)
    curX += nodes[0].width + GAP_X
  }
  curY += 44 + SECTION_GAP

  // ── Section: States ──────────────────────────────────────────────────────────
  children.push(text('STATES', {
    x: PAD, y: curY,
    color: C.textMuted,
    size: 11,
    weight: 600,
  }))
  curY += 24

  curX = PAD
  const states = [
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary', disabled: true },
    { label: 'Loading',  variant: 'primary', loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]
  for (const s of states) {
    const nodes = button({ ...s, x: curX, y: curY })
    children.push(...nodes)
    curX += nodes[0].width + GAP_X
  }
  curY += ROW_H + SECTION_GAP

  // ── Section: All variants grid ───────────────────────────────────────────────
  children.push(text('ALL VARIANTS × SIZES', {
    x: PAD, y: curY,
    color: C.textMuted,
    size: 11,
    weight: 600,
  }))
  curY += 24

  for (const v of variants) {
    curX = PAD
    for (const [sz] of [['sm'], ['md'], ['lg']]) {
      const nodes = button({ label: v, x: curX, y: curY, variant: v, size: sz })
      children.push(...nodes)
      curX += nodes[0].width + GAP_X
    }
    // disabled
    const disabledNodes = button({ label: 'disabled', x: curX, y: curY, variant: v, disabled: true })
    children.push(...disabledNodes)
    curY += ROW_H + GAP_Y
  }

  // ── Build frame ───────────────────────────────────────────────────────────────
  const frame = {
    type: 'FRAME',
    name: '🔘 Button',
    x: 100,
    y: 100,
    width: canvasW,
    height: curY + PAD,
    fills: [{ type: 'SOLID', color: C.bgBase }],
    cornerRadius: 12,
    children,
  }

  // ── POST to Figma ─────────────────────────────────────────────────────────────
  const payload = {
    nodes: [{ ...frame, parentId: pageId }],
  }

  const result = await figma('POST', `/files/${FILE_KEY}/nodes`, payload)
  console.log('\n✅  Button frame created in Figma!')
  console.log(`   Open: https://www.figma.com/design/${FILE_KEY}`)
}

main().catch(err => {
  console.error('❌  Error:', err.message)
  process.exit(1)
})
