/**
 * void-ui Figma Plugin v2
 * Uses AutoLayout frames — colors, radius and spacing from exact token values
 */

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
  bg:               { r:0.039, g:0.039, b:0.039 }, // #0a0a0a
  surface:          { r:0.102, g:0.102, b:0.102 }, // #1a1a1a
  overlay:          { r:0.141, g:0.141, b:0.141 }, // #242424
  borderDefault:    { r:0.180, g:0.180, b:0.180 }, // #2e2e2e
  borderStrong:     { r:0.239, g:0.239, b:0.239 }, // #3d3d3d
  textPrimary:      { r:0.961, g:0.961, b:0.961 }, // #f5f5f5
  textSecondary:    { r:0.639, g:0.639, b:0.639 }, // #a3a3a3
  textMuted:        { r:0.451, g:0.451, b:0.451 }, // #737373
  textDisabled:     { r:0.322, g:0.322, b:0.322 }, // #525252
  textInverse:      { r:0.039, g:0.039, b:0.039 }, // #0a0a0a
  actionPrimary:    { r:0.400, g:0.400, b:1.000 }, // #6666ff
  actionPrimaryHv:  { r:0.533, g:0.533, b:1.000 }, // #8888ff
  actionPrimaryAct: { r:0.267, g:0.267, b:0.867 }, // #4444dd
  actionSecondary:  { r:0.180, g:0.180, b:0.180 }, // #2e2e2e
  success:          { r:0.133, g:0.773, b:0.369 }, // #22c55e
  warning:          { r:0.961, g:0.620, b:0.043 }, // #f59e0b
  error:            { r:0.937, g:0.267, b:0.267 }, // #ef4444
  info:             { r:0.400, g:0.400, b:1.000 }, // #6666ff
}

const R = { none:0, sm:2, md:4, lg:8, xl:12, full:9999 }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rgb(c, a) {
  if (!c) return []
  return [{ type: 'SOLID', color: c, opacity: a !== undefined ? a : 1 }]
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ])
}

// AutoLayout frame — sizes itself to content
function af(name, dir, gap, pH, pV, fill, fillOpacity, border, radius) {
  const f = figma.createFrame()
  f.name = name || 'frame'
  f.layoutMode = dir === 'row' ? 'HORIZONTAL' : 'VERTICAL'
  f.primaryAxisSizingMode = 'AUTO'
  f.counterAxisSizingMode = 'AUTO'
  f.itemSpacing = gap || 0
  f.paddingLeft = pH || 0; f.paddingRight = pH || 0
  f.paddingTop = pV || 0;  f.paddingBottom = pV || 0
  f.fills = fill ? rgb(fill, fillOpacity) : []
  if (border) { f.strokes = rgb(border); f.strokeWeight = 1; f.strokeAlign = 'INSIDE' }
  if (radius !== undefined) f.cornerRadius = radius
  f.clipsContent = false
  return f
}

// Text node
function t(content, size, color, weight) {
  const n = figma.createText()
  n.fontName = { family: 'Inter', style: weight || 'Regular' }
  n.fontSize = size || 14
  n.characters = String(content)
  n.fills = rgb(color || C.textPrimary)
  return n
}

// Rectangle
function rct(name, w, h, fill, fillOp, border, radius) {
  const r = figma.createRectangle()
  r.name = name || 'rect'
  r.resize(Math.max(1, w), Math.max(1, h))
  r.fills = fill ? rgb(fill, fillOp) : []
  if (border) { r.strokes = rgb(border); r.strokeWeight = 1; r.strokeAlign = 'INSIDE' }
  if (radius !== undefined) r.cornerRadius = radius
  return r
}

// Button component
function btn(label, bg, fg, border, h, px, fs, radius, opacity) {
  const f = af('Button', 'row', 6, px, 0, bg, 1, border, radius)
  f.primaryAxisAlignItems = 'CENTER'
  f.counterAxisAlignItems = 'CENTER'
  f.counterAxisSizingMode = 'FIXED'
  f.resize(10, h) // height fixed, width AUTO
  f.primaryAxisSizingMode = 'AUTO'
  f.appendChild(t(label, fs, fg, 'Medium'))
  if (opacity !== undefined && opacity < 1) f.opacity = opacity
  return f
}

// Card (component showcase wrapper)
function card(name) {
  const f = af(name, 'col', 0, 24, 24, C.surface, 1, C.borderDefault, R.xl)
  return f
}

// Row of items with a label above
function section(label, dir) {
  const wrap = af('section', 'col', 6, 0, 0, null, 1, null, 0)
  wrap.appendChild(t(label, 10, C.textMuted, 'SemiBold'))
  const inner = af('items', dir || 'row', 8, 0, 0, null, 1, null, 0)
  inner.counterAxisAlignItems = 'CENTER'
  wrap.appendChild(inner)
  return { wrap, inner }
}

function header(parent, name, props) {
  const col = af('header', 'col', 4, 0, 0, null, 1, null, 0)
  col.appendChild(t(name, 18, C.textPrimary, 'Bold'))
  col.appendChild(t(props, 11, C.textMuted, 'Regular'))
  parent.appendChild(col)
  // spacer
  const sp = rct('sp', 1, 16, null)
  parent.appendChild(sp)
}

function addSec(parent, label, dir, builder) {
  const { wrap, inner } = section(label, dir)
  builder(inner)
  parent.appendChild(wrap)
  const sp = rct('sp', 1, 4, null)
  parent.appendChild(sp)
}

// ─── Button ───────────────────────────────────────────────────────────────────

function drawButton() {
  const c = card('🔘 Button')
  header(c, 'Button', 'variant · size · loading · iconBefore · iconAfter · fullWidth · as')

  addSec(c, 'VARIANTS', 'row', (row) => {
    row.appendChild(btn('Primary',   C.actionPrimary,  C.textInverse,  null,             36, 16, 14, R.md))
    row.appendChild(btn('Secondary', C.actionSecondary, C.textPrimary,  C.borderDefault,  36, 16, 14, R.md))
    row.appendChild(btn('Ghost',     null,              C.textPrimary,  null,             36, 16, 14, R.md))
    row.appendChild(btn('Outlined',  null,              C.actionPrimary, C.actionPrimary, 36, 16, 14, R.md))
    row.appendChild(btn('Danger',    C.error,           C.textInverse,  null,             36, 16, 14, R.md))
  })

  addSec(c, 'SIZES', 'row', (row) => {
    row.appendChild(btn('SM', C.actionPrimary, C.textInverse, null, 28, 12, 13, R.md))
    row.appendChild(btn('MD', C.actionPrimary, C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(btn('LG', C.actionPrimary, C.textInverse, null, 44, 24, 16, R.lg))
  })

  addSec(c, 'STATES', 'row', (row) => {
    row.appendChild(btn('Default',  C.actionPrimary,    C.textInverse, null, 36, 16, 14, R.md, 1.0))
    row.appendChild(btn('Hover',    C.actionPrimaryHv,  C.textInverse, null, 36, 16, 14, R.md, 1.0))
    row.appendChild(btn('Active',   C.actionPrimaryAct, C.textInverse, null, 36, 16, 14, R.md, 1.0))
    row.appendChild(btn('Disabled', C.actionPrimary,    C.textInverse, null, 36, 16, 14, R.md, 0.4))
  })

  return c
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function mkBadge(label, variant, toneColor) {
  let fill = null, fillOp = 1, border = null, fg = toneColor
  if (variant === 'solid')    { fill = toneColor; fg = C.textInverse }
  if (variant === 'subtle')   { fill = toneColor; fillOp = 0.15 }
  if (variant === 'outlined') { border = toneColor }

  const f = af('Badge', 'row', 0, 8, 0, fill, fillOp, border, R.full)
  f.primaryAxisAlignItems = 'CENTER'
  f.counterAxisAlignItems = 'CENTER'
  f.counterAxisSizingMode = 'FIXED'
  f.resize(10, 22)
  f.primaryAxisSizingMode = 'AUTO'
  f.appendChild(t(label, 12, fg, 'Medium'))
  return f
}

function drawBadge() {
  const c = card('🏷 Badge')
  header(c, 'Badge', 'variant · tone · size · dot')

  const tones = [
    ['default', C.textMuted],
    ['success', C.success],
    ['warning', C.warning],
    ['error',   C.error],
    ['info',    C.info],
  ]

  for (const variant of ['solid', 'subtle', 'outlined']) {
    addSec(c, variant.toUpperCase(), 'row', (row) => {
      for (const [tone, color] of tones) {
        row.appendChild(mkBadge(tone, variant, color))
      }
    })
  }

  addSec(c, 'DOT', 'row', (row) => {
    for (const [, color] of tones) {
      row.appendChild(rct('dot', 8, 8, color, 1, null, R.full))
    }
  })

  return c
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function mkAvatar(size, shape, statusColor) {
  const p = { xs:24, sm:32, md:40, lg:48, xl:64 }[size] || 40
  const radius = shape === 'square' ? R.sm : shape === 'rounded' ? R.lg : R.full

  const wrap = figma.createFrame()
  wrap.name = `Avatar/${size}`
  wrap.resize(p, p)
  wrap.fills = rgb(C.actionPrimary)
  wrap.cornerRadius = radius
  wrap.clipsContent = false

  const initials = t('GR', Math.max(9, Math.floor(p / 3.2)), C.textInverse, 'SemiBold')
  initials.x = Math.floor(p * 0.18)
  initials.y = Math.floor(p * 0.26)
  wrap.appendChild(initials)

  if (statusColor) {
    const dot = rct('status', 10, 10, statusColor, 1, C.surface, R.full)
    dot.strokes = rgb(C.surface)
    dot.strokeWeight = 2
    dot.x = p - 12
    dot.y = p - 12
    wrap.appendChild(dot)
  }

  return wrap
}

function drawAvatar() {
  const c = card('👤 Avatar')
  header(c, 'Avatar', 'size · shape · status · src · initials')

  addSec(c, 'SIZES', 'row', (row) => {
    row.counterAxisAlignItems = 'CENTER'
    for (const s of ['xs','sm','md','lg','xl']) row.appendChild(mkAvatar(s, 'circle', null))
  })

  addSec(c, 'SHAPES', 'row', (row) => {
    row.appendChild(mkAvatar('md', 'circle', null))
    row.appendChild(mkAvatar('md', 'square', null))
    row.appendChild(mkAvatar('md', 'rounded', null))
  })

  addSec(c, 'STATUS', 'row', (row) => {
    row.appendChild(mkAvatar('md', 'circle', C.success))
    row.appendChild(mkAvatar('md', 'circle', C.textMuted))
    row.appendChild(mkAvatar('md', 'circle', C.error))
    row.appendChild(mkAvatar('md', 'circle', C.warning))
  })

  return c
}

// ─── Typography ───────────────────────────────────────────────────────────────

function drawTypography() {
  const c = card('✍️ Typography')
  header(c, 'Typography', 'as · size · color · weight · leading · tracking · mono · truncate')

  addSec(c, 'SIZE SCALE', 'col', (col) => {
    col.itemSpacing = 8
    const scale = [
      [36,'4xl — The void','Bold'],
      [30,'3xl — The void','Bold'],
      [24,'2xl — The void','SemiBold'],
      [20,'xl — The void','SemiBold'],
      [18,'lg — The void','Medium'],
      [16,'md — The void','Regular'],
      [14,'base — The void','Regular'],
      [13,'sm — The void','Regular'],
      [11,'xs — The void','Regular'],
    ]
    for (const [sz, lbl, w] of scale) col.appendChild(t(lbl, sz, C.textPrimary, w))
  })

  addSec(c, 'COLORS', 'col', (col) => {
    col.itemSpacing = 8
    for (const [lbl, color] of [
      ['primary — Sample text',   C.textPrimary],
      ['secondary — Sample text', C.textSecondary],
      ['muted — Sample text',     C.textMuted],
      ['disabled — Sample text',  C.textDisabled],
      ['accent — Sample text',    C.actionPrimary],
    ]) col.appendChild(t(lbl, 14, color))
  })

  return c
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function drawDivider() {
  const c = card('➖ Divider')
  header(c, 'Divider', 'orientation · variant · label · labelAlign · flush')

  addSec(c, 'LINES', 'col', (col) => {
    col.itemSpacing = 12
    for (const v of ['solid','dashed','dotted']) {
      const row = af(v, 'col', 4, 0, 0, null, 1, null, 0)
      row.appendChild(t(v, 11, C.textMuted, 'Medium'))
      row.appendChild(rct(`line/${v}`, 320, 1, C.borderDefault))
      col.appendChild(row)
    }
  })

  addSec(c, 'WITH LABEL', 'row', (row) => {
    row.counterAxisAlignItems = 'CENTER'
    row.appendChild(rct('l', 80, 1, C.borderDefault))
    row.appendChild(t('Section', 12, C.textMuted, 'Medium'))
    row.appendChild(rct('r', 80, 1, C.borderDefault))
  })

  addSec(c, 'VERTICAL', 'row', (row) => {
    row.counterAxisAlignItems = 'MIN'
    row.appendChild(rct('v1', 1, 48, C.borderDefault))
    row.appendChild(rct('spacer', 8, 1, null))
    row.appendChild(rct('v2', 1, 48, C.textMuted))
  })

  return c
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function mkSpinner(size) {
  const p = { xs:16, sm:20, md:24, lg:32, xl:40 }[size] || 24
  const sw = Math.max(2, Math.floor(p / 10))

  const wrap = figma.createFrame()
  wrap.name = `Spinner/${size}`
  wrap.resize(p, p)
  wrap.fills = []
  wrap.clipsContent = false

  // track: full circle border
  const track = rct('track', p, p, null, 1, C.borderDefault, R.full)
  track.fills = []
  track.strokes = rgb(C.borderDefault)
  track.strokeWeight = sw
  track.strokeAlign = 'INSIDE'
  wrap.appendChild(track)

  // arc: colored quarter
  const qs = Math.ceil(p / 2)
  const arc = rct('arc', qs, qs, C.actionPrimary, 1, null, Math.ceil(qs / 2))
  arc.x = 0; arc.y = 0
  wrap.appendChild(arc)

  return wrap
}

function drawSpinner() {
  const c = card('⏳ Spinner')
  header(c, 'Spinner', 'variant · size')

  addSec(c, 'SIZES', 'row', (row) => {
    row.counterAxisAlignItems = 'CENTER'
    for (const s of ['xs','sm','md','lg','xl']) row.appendChild(mkSpinner(s))
  })

  return c
}

// ─── TextField ───────────────────────────────────────────────────────────────

function mkTextField(state, size) {
  const h = { sm:32, md:40, lg:48 }[size] || 40
  const borderC = { default:C.borderDefault, error:C.error, success:C.success, warning:C.warning }[state] || C.borderDefault
  const hintC   = state === 'default' ? C.textMuted : borderC

  const col = af('tf', 'col', 4, 0, 0, null, 1, null, 0)
  col.appendChild(t('Label', 11, C.textSecondary, 'Medium'))

  // input
  const inp = af('input', 'row', 0, 12, 0, C.overlay, 1, borderC, R.md)
  inp.counterAxisAlignItems = 'CENTER'
  inp.counterAxisSizingMode = 'FIXED'
  inp.primaryAxisSizingMode = 'FIXED'
  inp.resize(170, h)
  inp.appendChild(t('Placeholder…', 14, C.textMuted, 'Regular'))
  col.appendChild(inp)

  col.appendChild(t(state === 'error' ? '✗ Error message' : 'Hint text', 11, hintC, 'Regular'))
  return col
}

function drawTextField() {
  const c = card('📝 TextField')
  header(c, 'TextField', 'size · state · label · hint · error · prefix · suffix · fullWidth')

  addSec(c, 'STATES', 'row', (row) => {
    row.counterAxisAlignItems = 'MIN'
    for (const s of ['default','error','success','warning']) row.appendChild(mkTextField(s, 'md'))
  })

  addSec(c, 'SIZES', 'row', (row) => {
    row.counterAxisAlignItems = 'MIN'
    for (const s of ['sm','md','lg']) row.appendChild(mkTextField('default', s))
  })

  return c
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function drawStack() {
  const c = card('📦 Stack')
  header(c, 'Stack', 'as · direction · gap · align · justify · wrap · full')

  addSec(c, 'ROW  gap=4 (16px)', 'row', (row) => {
    for (let i = 1; i <= 4; i++) {
      const item = af(`item${i}`, 'row', 0, 12, 6, C.overlay, 1, C.borderDefault, R.md)
      item.appendChild(t(`Item ${i}`, 11, C.textSecondary, 'Regular'))
      row.appendChild(item)
    }
  })

  addSec(c, 'COLUMN  gap=2 (8px)', 'col', (col) => {
    col.itemSpacing = 8
    for (let i = 1; i <= 3; i++) {
      const item = af(`item${i}`, 'row', 0, 12, 6, C.overlay, 1, C.borderDefault, R.md)
      item.appendChild(t(`Item ${i}`, 11, C.textSecondary, 'Regular'))
      col.appendChild(item)
    }
  })

  return c
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function layoutGrid(cards) {
  const COLS = 3
  const GAP  = 40
  let col = 0, rowY = 0, rowMaxH = 0
  const colX = [0, 0, 0]

  for (const card of cards) {
    figma.currentPage.appendChild(card)
    card.x = colX[col]
    card.y = rowY
    rowMaxH = Math.max(rowMaxH, card.height)
    colX[col] += card.width + GAP
    col++
    if (col >= COLS) {
      col = 0
      rowY += rowMaxH + GAP
      rowMaxH = 0
      colX[0] = 0; colX[1] = (cards[0] ? cards[0].width + GAP : 0) + (cards[3] ? cards[3].width + GAP : 0)
    }
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function run() {
  await loadFonts()

  const names = ['🔘 Button','🏷 Badge','👤 Avatar','✍️ Typography','➖ Divider','⏳ Spinner','📝 TextField','📦 Stack']
  figma.currentPage.children.filter(n => names.includes(n.name)).forEach(n => n.remove())

  const cards = [
    drawButton(),
    drawBadge(),
    drawAvatar(),
    drawTypography(),
    drawDivider(),
    drawSpinner(),
    drawTextField(),
    drawStack(),
  ]

  // Simple grid layout
  const COLS = 3, GAP = 40
  let col = 0, x = 0, y = 0, rowH = 0
  const rowStartX = [0]

  for (const card of cards) {
    figma.currentPage.appendChild(card)
    card.x = x
    card.y = y
    rowH = Math.max(rowH, card.height)
    x += card.width + GAP
    col++
    if (col >= COLS) {
      col = 0; x = 0; y += rowH + GAP; rowH = 0
    }
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.filter(n => names.includes(n.name)))
  figma.closePlugin('✅ void-ui — 8 componentes con AutoLayout y estilos exactos')
}

run().catch(err => figma.closePlugin(`❌ ${err.message}`))
