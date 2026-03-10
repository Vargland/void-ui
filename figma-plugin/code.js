/**
 * void-ui Figma Plugin v3
 * AutoLayout only — no absolute positioning, no orphan nodes
 */

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
  surface:          { r:0.102, g:0.102, b:0.102 }, // #1a1a1a
  overlay:          { r:0.141, g:0.141, b:0.141 }, // #242424
  borderDefault:    { r:0.180, g:0.180, b:0.180 }, // #2e2e2e
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
}

const R = { none:0, sm:2, md:4, lg:8, xl:12, full:9999 }

// ─── Primitives ───────────────────────────────────────────────────────────────

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ])
}

function solid(color, opacity) {
  return [{ type: 'SOLID', color, opacity: opacity || 1 }]
}

// AutoLayout frame, sizes to content by default
function frame(opts) {
  const f = figma.createFrame()
  f.name = opts.name || 'frame'
  f.layoutMode = opts.dir === 'row' ? 'HORIZONTAL' : 'VERTICAL'
  f.itemSpacing = opts.gap || 0
  f.paddingLeft = f.paddingRight = opts.pH || 0
  f.paddingTop = f.paddingBottom = opts.pV || 0
  f.primaryAxisSizingMode = opts.wFix ? 'FIXED' : 'AUTO'
  f.counterAxisSizingMode = opts.hFix ? 'FIXED' : 'AUTO'
  f.primaryAxisAlignItems = opts.mainAlign || 'MIN'
  f.counterAxisAlignItems = opts.crossAlign || 'MIN'
  f.fills = opts.fill ? solid(opts.fill, opts.fillOp) : []
  if (opts.border) { f.strokes = solid(opts.border); f.strokeWeight = 1; f.strokeAlign = 'INSIDE' }
  if (opts.radius !== undefined) f.cornerRadius = opts.radius
  f.clipsContent = false
  if (opts.w && opts.h) f.resize(opts.w, opts.h)
  else if (opts.w) f.resize(opts.w, f.height || 1)
  else if (opts.h) f.resize(f.width || 1, opts.h)
  return f
}

function text(str, size, color, weight) {
  const n = figma.createText()
  n.fontName = { family: 'Inter', style: weight || 'Regular' }
  n.fontSize = size || 14
  n.characters = String(str)
  n.fills = solid(color || C.textPrimary)
  return n
}

function box(opts) {
  const r = figma.createRectangle()
  r.name = opts.name || 'rect'
  r.resize(Math.max(1, opts.w), Math.max(1, opts.h))
  r.fills = opts.fill ? solid(opts.fill, opts.fillOp) : []
  if (opts.border) { r.strokes = solid(opts.border); r.strokeWeight = opts.sw || 1; r.strokeAlign = 'INSIDE' }
  if (opts.radius !== undefined) r.cornerRadius = opts.radius
  if (opts.opacity !== undefined) r.opacity = opts.opacity
  return r
}

// ─── Component helpers ────────────────────────────────────────────────────────

// Card wrapper — dark surface with border, vertical stack
function card(name) {
  return frame({ name, dir: 'col', gap: 16, pH: 24, pV: 24, fill: C.surface, border: C.borderDefault, radius: R.xl })
}

// Section title + row/col of items
function section(parent, label, dir, gap, builder) {
  const wrap = frame({ name: label, dir: 'col', gap: 8 })
  wrap.appendChild(text(label, 10, C.textMuted, 'SemiBold'))
  const inner = frame({ name: 'items', dir: dir || 'row', gap: gap || 8, crossAlign: 'CENTER' })
  builder(inner)
  wrap.appendChild(inner)
  parent.appendChild(wrap)
}

function cardHeader(parent, name, props) {
  const wrap = frame({ name: 'header', dir: 'col', gap: 4 })
  wrap.appendChild(text(name, 18, C.textPrimary, 'Bold'))
  wrap.appendChild(text(props, 11, C.textMuted, 'Regular'))
  parent.appendChild(wrap)
}

// ─── Button ───────────────────────────────────────────────────────────────────

function mkBtn(label, bg, fg, border, h, px, fs, radius, opacity) {
  const f = frame({
    name: 'Button/' + label,
    dir: 'row', gap: 6,
    pH: px, h,
    hFix: true,
    mainAlign: 'CENTER', crossAlign: 'CENTER',
    fill: bg, border, radius,
  })
  f.appendChild(text(label, fs, fg, 'Medium'))
  if (opacity !== undefined && opacity < 1) f.opacity = opacity
  return f
}

function drawButton() {
  const c = card('🔘 Button')
  cardHeader(c, 'Button', 'variant · size · loading · iconBefore · iconAfter · fullWidth · as')

  section(c, 'VARIANTS', 'row', 8, (row) => {
    row.appendChild(mkBtn('Primary',   C.actionPrimary,  C.textInverse,  null,              36, 16, 14, R.md))
    row.appendChild(mkBtn('Secondary', C.actionSecondary, C.textPrimary, C.borderDefault,   36, 16, 14, R.md))
    row.appendChild(mkBtn('Ghost',     null,              C.textPrimary,  null,             36, 16, 14, R.md))
    row.appendChild(mkBtn('Outlined',  null,              C.actionPrimary, C.actionPrimary, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Danger',    C.error,           C.textInverse,  null,             36, 16, 14, R.md))
  })

  section(c, 'SIZES', 'row', 8, (row) => {
    row.appendChild(mkBtn('SM', C.actionPrimary, C.textInverse, null, 28, 12, 13, R.md))
    row.appendChild(mkBtn('MD', C.actionPrimary, C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('LG', C.actionPrimary, C.textInverse, null, 44, 24, 16, R.lg))
  })

  section(c, 'STATES', 'row', 8, (row) => {
    row.appendChild(mkBtn('Default',  C.actionPrimary,    C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Hover',    C.actionPrimaryHv,  C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Active',   C.actionPrimaryAct, C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Disabled', C.actionPrimary,    C.textInverse, null, 36, 16, 14, R.md, 0.4))
  })

  return c
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function mkBadge(label, variant, color) {
  let fill = null, fillOp = 1, border = null, fg = color
  if (variant === 'solid')    { fill = color; fg = C.textInverse }
  if (variant === 'subtle')   { fill = color; fillOp = 0.15 }
  if (variant === 'outlined') { border = color }

  const f = frame({
    name: 'Badge/' + variant + '/' + label,
    dir: 'row', gap: 0,
    pH: 8, h: 22,
    hFix: true,
    mainAlign: 'CENTER', crossAlign: 'CENTER',
    fill, fillOp, border, radius: R.full,
  })
  f.appendChild(text(label, 12, fg, 'Medium'))
  return f
}

function drawBadge() {
  const c = card('🏷 Badge')
  cardHeader(c, 'Badge', 'variant · tone · size · dot')

  const tones = [
    ['default', C.textMuted],
    ['success', C.success],
    ['warning', C.warning],
    ['error',   C.error],
    ['info',    C.actionPrimary],
  ]

  for (const variant of ['solid', 'subtle', 'outlined']) {
    section(c, variant.toUpperCase(), 'row', 6, (row) => {
      for (const [tone, color] of tones) {
        row.appendChild(mkBadge(tone, variant, color))
      }
    })
  }

  section(c, 'DOT', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'CENTER'
    for (const [, color] of tones) {
      row.appendChild(box({ name: 'dot', w: 8, h: 8, fill: color, radius: R.full }))
    }
  })

  return c
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function mkAvatar(size, shape, statusColor) {
  const p = { xs:24, sm:32, md:40, lg:48, xl:64 }[size] || 40
  const radius = shape === 'square' ? R.sm : shape === 'rounded' ? R.lg : R.full

  // Use a plain frame (not autolayout) so we can position the status dot
  const wrap = figma.createFrame()
  wrap.name = 'Avatar/' + size
  wrap.resize(p, p)
  wrap.fills = solid(C.actionPrimary)
  wrap.cornerRadius = radius
  wrap.clipsContent = false

  const initials = text('GR', Math.max(9, Math.floor(p / 3.2)), C.textInverse, 'SemiBold')
  initials.x = Math.floor(p * 0.18)
  initials.y = Math.floor(p * 0.26)
  wrap.appendChild(initials)

  if (statusColor) {
    const dot = box({ name: 'status', w: 10, h: 10, fill: statusColor, border: C.surface, sw: 2, radius: R.full })
    dot.x = p - 12
    dot.y = p - 12
    wrap.appendChild(dot)
  }

  return wrap
}

function drawAvatar() {
  const c = card('👤 Avatar')
  cardHeader(c, 'Avatar', 'size · shape · status · src · initials')

  section(c, 'SIZES', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'CENTER'
    for (const s of ['xs','sm','md','lg','xl']) row.appendChild(mkAvatar(s, 'circle', null))
  })

  section(c, 'SHAPES', 'row', 12, (row) => {
    row.appendChild(mkAvatar('md', 'circle',  null))
    row.appendChild(mkAvatar('md', 'square',  null))
    row.appendChild(mkAvatar('md', 'rounded', null))
  })

  section(c, 'STATUS', 'row', 12, (row) => {
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
  cardHeader(c, 'Typography', 'as · size · color · weight · leading · tracking · mono · truncate')

  section(c, 'SIZE SCALE', 'col', 6, (col) => {
    for (const [sz, lbl, w] of [
      [36,'4xl — The void','Bold'],
      [30,'3xl — The void','Bold'],
      [24,'2xl — The void','SemiBold'],
      [20,'xl — The void','SemiBold'],
      [18,'lg — The void','Medium'],
      [16,'md — The void','Regular'],
      [14,'base — The void','Regular'],
      [13,'sm — The void','Regular'],
      [11,'xs — The void','Regular'],
    ]) col.appendChild(text(lbl, sz, C.textPrimary, w))
  })

  section(c, 'COLORS', 'col', 8, (col) => {
    for (const [lbl, color] of [
      ['primary — Sample text',   C.textPrimary],
      ['secondary — Sample text', C.textSecondary],
      ['muted — Sample text',     C.textMuted],
      ['disabled — Sample text',  C.textDisabled],
      ['accent — Sample text',    C.actionPrimary],
    ]) col.appendChild(text(lbl, 14, color))
  })

  return c
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function drawDivider() {
  const c = card('➖ Divider')
  cardHeader(c, 'Divider', 'orientation · variant · label · labelAlign · flush')

  section(c, 'LINES', 'col', 12, (col) => {
    for (const v of ['solid','dashed','dotted']) {
      const row = frame({ name: v, dir: 'col', gap: 4 })
      row.appendChild(text(v, 11, C.textMuted, 'Medium'))
      row.appendChild(box({ name: 'line', w: 300, h: 1, fill: C.borderDefault }))
      col.appendChild(row)
    }
  })

  section(c, 'WITH LABEL', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'CENTER'
    row.appendChild(box({ name: 'left',  w: 80, h: 1, fill: C.borderDefault }))
    row.appendChild(text('Section', 12, C.textMuted, 'Medium'))
    row.appendChild(box({ name: 'right', w: 80, h: 1, fill: C.borderDefault }))
  })

  section(c, 'VERTICAL', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'MIN'
    row.appendChild(box({ name: 'v1', w: 1, h: 48, fill: C.borderDefault }))
    row.appendChild(box({ name: 'v2', w: 1, h: 48, fill: C.textMuted }))
  })

  return c
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function mkSpinner(size) {
  const p = { xs:16, sm:20, md:24, lg:32, xl:40 }[size] || 24
  const sw = Math.max(2, Math.floor(p / 10))

  const wrap = figma.createFrame()
  wrap.name = 'Spinner/' + size
  wrap.resize(p, p)
  wrap.fills = []
  wrap.clipsContent = false

  // Track ring — use Ellipse (native circle, avoids strokeAlign issues on Rectangle)
  const track = figma.createEllipse()
  track.name = 'track'
  track.resize(p, p)
  track.fills = []
  track.strokes = solid(C.borderDefault)
  track.strokeWeight = sw
  track.strokeAlign = 'INSIDE'
  wrap.appendChild(track)

  // Arc — small filled ellipse representing the spinning part
  const qs = Math.ceil(p / 2)
  const arc = figma.createEllipse()
  arc.name = 'arc'
  arc.resize(qs, qs)
  arc.fills = solid(C.actionPrimary)
  arc.strokes = []
  arc.x = 0
  arc.y = 0
  wrap.appendChild(arc)

  return wrap
}

function drawSpinner() {
  const c = card('⏳ Spinner')
  cardHeader(c, 'Spinner', 'variant · size')

  section(c, 'SIZES', 'row', 12, (row) => {
    row.counterAxisAlignItems = 'CENTER'
    for (const s of ['xs','sm','md','lg','xl']) row.appendChild(mkSpinner(s))
  })

  return c
}

// ─── TextField ───────────────────────────────────────────────────────────────

function mkTextField(state, size) {
  const heights = { sm:32, md:40, lg:48 }
  const h = heights[size] || 40
  const borderC = { default:C.borderDefault, error:C.error, success:C.success, warning:C.warning }[state] || C.borderDefault
  const hintC   = state === 'default' ? C.textMuted : borderC
  const hintTxt = state === 'error' ? '✗ Error message' : 'Hint text'

  const col = frame({ name: 'TF/' + state + '/' + size, dir: 'col', gap: 4 })
  col.appendChild(text('Label', 11, C.textSecondary, 'Medium'))

  // Input box — fixed 170×h
  const inp = figma.createFrame()
  inp.name = 'input'
  inp.resize(170, h)
  inp.layoutMode = 'HORIZONTAL'
  inp.primaryAxisSizingMode = 'FIXED'
  inp.counterAxisSizingMode = 'FIXED'
  inp.primaryAxisAlignItems = 'MIN'
  inp.counterAxisAlignItems = 'CENTER'
  inp.paddingLeft = inp.paddingRight = 12
  inp.paddingTop = inp.paddingBottom = 0
  inp.fills = solid(C.overlay)
  inp.strokes = solid(borderC)
  inp.strokeWeight = 1
  inp.strokeAlign = 'INSIDE'
  inp.cornerRadius = R.md
  inp.clipsContent = false
  inp.appendChild(text('Placeholder…', 14, C.textMuted, 'Regular'))
  col.appendChild(inp)

  col.appendChild(text(hintTxt, 11, hintC, 'Regular'))
  return col
}

function drawTextField() {
  const c = card('📝 TextField')
  cardHeader(c, 'TextField', 'size · state · label · hint · error · prefix · suffix · fullWidth')

  section(c, 'STATES', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'MIN'
    for (const s of ['default','error','success','warning']) row.appendChild(mkTextField(s, 'md'))
  })

  section(c, 'SIZES', 'row', 8, (row) => {
    row.counterAxisAlignItems = 'MIN'
    for (const s of ['sm','md','lg']) row.appendChild(mkTextField('default', s))
  })

  return c
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function drawStack() {
  const c = card('📦 Stack')
  cardHeader(c, 'Stack', 'as · direction · gap · align · justify · wrap · full')

  section(c, 'ROW  gap=4 (16px)', 'row', 16, (row) => {
    for (let i = 1; i <= 4; i++) {
      const item = frame({ name: 'item' + i, dir: 'row', gap: 0, pH: 12, pV: 6, fill: C.overlay, border: C.borderDefault, radius: R.md })
      item.appendChild(text('Item ' + i, 11, C.textSecondary, 'Regular'))
      row.appendChild(item)
    }
  })

  section(c, 'COLUMN  gap=2 (8px)', 'col', 8, (col) => {
    for (let i = 1; i <= 3; i++) {
      const item = frame({ name: 'item' + i, dir: 'row', gap: 0, pH: 12, pV: 6, fill: C.overlay, border: C.borderDefault, radius: R.md })
      item.appendChild(text('Item ' + i, 11, C.textSecondary, 'Regular'))
      col.appendChild(item)
    }
  })

  return c
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function run() {
  await loadFonts()

  const NAMES = ['🔘 Button','🏷 Badge','👤 Avatar','✍️ Typography','➖ Divider','⏳ Spinner','📝 TextField','📦 Stack']
  figma.currentPage.children.filter(n => NAMES.includes(n.name)).forEach(n => n.remove())

  const drawFns = [
    ['🔘 Button',      drawButton],
    ['🏷 Badge',       drawBadge],
    ['👤 Avatar',      drawAvatar],
    ['✍️ Typography',  drawTypography],
    ['➖ Divider',     drawDivider],
    ['⏳ Spinner',     drawSpinner],
    ['📝 TextField',   drawTextField],
    ['📦 Stack',       drawStack],
  ]

  const cards = []
  for (const [name, fn] of drawFns) {
    try {
      console.log('drawing: ' + name)
      const c = fn()
      console.log('done: ' + name + ' w=' + c.width + ' h=' + c.height)
      cards.push(c)
    } catch (e) {
      const msg = (e && e.message) ? e.message : String(e)
      figma.notify('FAIL ' + name + ': ' + msg, { error: true, timeout: 10000 })
      console.error('FAIL ' + name, e)
    }
  }

  // Grid layout: 3 columns
  const COLS = 3, GAP = 40
  let col = 0, x = 0, y = 0, rowH = 0

  for (const card of cards) {
    figma.currentPage.appendChild(card)
    card.x = x
    card.y = y
    rowH = Math.max(rowH, card.height)
    x += card.width + GAP
    col++
    if (col >= COLS) { col = 0; x = 0; y += rowH + GAP; rowH = 0 }
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children.filter(n => NAMES.includes(n.name)))
  figma.closePlugin(`✅ void-ui — ${cards.length}/8 componentes`)
}

run().catch(err => figma.closePlugin(`❌ ${err.message}`))
