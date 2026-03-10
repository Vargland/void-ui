/**
 * void-ui Figma Plugin v4
 * Based on confirmed Figma Plugin API constraints:
 * - strokeAlign NOT supported on Ellipse — only Frame/Rectangle
 * - layoutMode must be set BEFORE sizing modes
 * - resize() after layoutMode + sizing modes for FIXED frames
 * - x/y on children only works if parent has NO layoutMode (plain frame)
 */

const C = {
  surface:       { r:0.102, g:0.102, b:0.102 },
  overlay:       { r:0.141, g:0.141, b:0.141 },
  border:        { r:0.180, g:0.180, b:0.180 },
  textPrimary:   { r:0.961, g:0.961, b:0.961 },
  textSecondary: { r:0.639, g:0.639, b:0.639 },
  textMuted:     { r:0.451, g:0.451, b:0.451 },
  textDisabled:  { r:0.322, g:0.322, b:0.322 },
  textInverse:   { r:0.039, g:0.039, b:0.039 },
  primary:       { r:0.400, g:0.400, b:1.000 },
  primaryHv:     { r:0.533, g:0.533, b:1.000 },
  primaryAct:    { r:0.267, g:0.267, b:0.867 },
  secondary:     { r:0.180, g:0.180, b:0.180 },
  success:       { r:0.133, g:0.773, b:0.369 },
  warning:       { r:0.961, g:0.620, b:0.043 },
  error:         { r:0.937, g:0.267, b:0.267 },
}

const R = { none:0, sm:2, md:4, lg:8, xl:12, full:9999 }

// ─── Font loading ─────────────────────────────────────────────────────────────

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family:'Inter', style:'Regular' }),
    figma.loadFontAsync({ family:'Inter', style:'Medium' }),
    figma.loadFontAsync({ family:'Inter', style:'Semi Bold' }),
    figma.loadFontAsync({ family:'Inter', style:'Bold' }),
  ])
}

// ─── Node factories ───────────────────────────────────────────────────────────

function solidFill(c, a) {
  return [{ type:'SOLID', color:c, opacity: a || 1 }]
}

// AutoLayout frame — correct order: layoutMode → sizingModes → resize
function autoFrame(name, dir, gap, pH, pV) {
  const f = figma.createFrame()
  f.name = name
  f.layoutMode = dir === 'row' ? 'HORIZONTAL' : 'VERTICAL'
  f.itemSpacing = gap || 0
  f.paddingLeft = f.paddingRight = pH || 0
  f.paddingTop = f.paddingBottom = pV || 0
  f.primaryAxisSizingMode = 'AUTO'
  f.counterAxisSizingMode = 'AUTO'
  f.primaryAxisAlignItems = 'MIN'
  f.counterAxisAlignItems = 'MIN'
  f.fills = []
  f.clipsContent = false
  return f
}

// Plain frame — no AutoLayout, absolute child positioning works
function plainFrame(name, w, h) {
  const f = figma.createFrame()
  f.name = name
  f.resize(w, h)
  f.fills = []
  f.clipsContent = false
  return f
}

function txt(str, size, color, weight) {
  const n = figma.createText()
  n.fontName = { family:'Inter', style: weight || 'Regular' }
  n.fontSize = size || 14
  n.characters = String(str)
  n.fills = solidFill(color || C.textPrimary)
  return n
}

function rect(name, w, h, fill, fillOp, borderColor, radius) {
  const r = figma.createRectangle()
  r.name = name || 'rect'
  r.resize(Math.max(1, w), Math.max(1, h))
  r.fills = fill ? solidFill(fill, fillOp) : []
  if (borderColor) { r.strokes = solidFill(borderColor); r.strokeWeight = 1; r.strokeAlign = 'INSIDE' }
  if (radius !== undefined) r.cornerRadius = radius
  return r
}

// ─── Card / Section helpers ───────────────────────────────────────────────────

function card(name) {
  const f = autoFrame(name, 'col', 16, 24, 24)
  f.fills = solidFill(C.surface)
  f.strokes = solidFill(C.border)
  f.strokeWeight = 1
  f.strokeAlign = 'INSIDE'
  f.cornerRadius = R.xl
  return f
}

function cardHeader(parent, name, props) {
  const wrap = autoFrame('header', 'col', 4, 0, 0)
  wrap.appendChild(txt(name, 18, C.textPrimary, 'Bold'))
  wrap.appendChild(txt(props, 11, C.textMuted, 'Regular'))
  parent.appendChild(wrap)
}

function section(parent, label, dir, gap, crossAlign, builder) {
  const wrap = autoFrame(label, 'col', 8, 0, 0)
  wrap.appendChild(txt(label, 10, C.textMuted, 'Semi Bold'))
  const inner = autoFrame('items', dir || 'row', gap || 8, 0, 0)
  inner.counterAxisAlignItems = crossAlign || 'CENTER'
  builder(inner)
  wrap.appendChild(inner)
  parent.appendChild(wrap)
}

// ─── Button ───────────────────────────────────────────────────────────────────

function mkBtn(label, bg, fg, borderColor, height, px, fs, radius, opacity) {
  // Build as AutoLayout row, FIXED height
  const f = autoFrame('btn/' + label, 'row', 6, px, 0)
  // Set FIXED height AFTER layoutMode is set, BEFORE adding children
  f.counterAxisSizingMode = 'FIXED'
  f.resize(f.width || 1, height)
  f.primaryAxisAlignItems = 'CENTER'
  f.counterAxisAlignItems = 'CENTER'
  f.fills = bg ? solidFill(bg) : []
  if (borderColor) { f.strokes = solidFill(borderColor); f.strokeWeight = 1; f.strokeAlign = 'INSIDE' }
  f.cornerRadius = radius || 0
  f.appendChild(txt(label, fs, fg, 'Medium'))
  if (opacity !== undefined && opacity < 1) f.opacity = opacity
  return f
}

function drawButton() {
  const c = card('🔘 Button')
  cardHeader(c, 'Button', 'variant · size · loading · iconBefore · iconAfter · fullWidth · as')

  section(c, 'VARIANTS', 'row', 8, 'CENTER', function(row) {
    row.appendChild(mkBtn('Primary',   C.primary,   C.textInverse, null,       36, 16, 14, R.md))
    row.appendChild(mkBtn('Secondary', C.secondary, C.textPrimary, C.border,   36, 16, 14, R.md))
    row.appendChild(mkBtn('Ghost',     null,        C.textPrimary, null,       36, 16, 14, R.md))
    row.appendChild(mkBtn('Outlined',  null,        C.primary,     C.primary,  36, 16, 14, R.md))
    row.appendChild(mkBtn('Danger',    C.error,     C.textInverse, null,       36, 16, 14, R.md))
  })

  section(c, 'SIZES', 'row', 8, 'CENTER', function(row) {
    row.appendChild(mkBtn('SM', C.primary, C.textInverse, null, 28, 12, 13, R.md))
    row.appendChild(mkBtn('MD', C.primary, C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('LG', C.primary, C.textInverse, null, 44, 24, 16, R.lg))
  })

  section(c, 'STATES', 'row', 8, 'CENTER', function(row) {
    row.appendChild(mkBtn('Default',  C.primary,    C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Hover',    C.primaryHv,  C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Active',   C.primaryAct, C.textInverse, null, 36, 16, 14, R.md))
    row.appendChild(mkBtn('Disabled', C.primary,    C.textInverse, null, 36, 16, 14, R.md, 0.4))
  })

  return c
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function mkBadge(label, variant, color) {
  var fill = null, fillOp = 1, borderColor = null, fg = color
  if (variant === 'solid')    { fill = color; fg = C.textInverse }
  if (variant === 'subtle')   { fill = color; fillOp = 0.15 }
  if (variant === 'outlined') { borderColor = color }

  const f = autoFrame('badge', 'row', 0, 8, 0)
  f.counterAxisSizingMode = 'FIXED'
  f.resize(f.width || 1, 22)
  f.primaryAxisAlignItems = 'CENTER'
  f.counterAxisAlignItems = 'CENTER'
  f.fills = fill ? solidFill(fill, fillOp) : []
  if (borderColor) { f.strokes = solidFill(borderColor); f.strokeWeight = 1; f.strokeAlign = 'INSIDE' }
  f.cornerRadius = R.full
  f.appendChild(txt(label, 12, fg, 'Medium'))
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
    ['info',    C.primary],
  ]

  var variants = ['solid', 'subtle', 'outlined']
  for (var vi = 0; vi < variants.length; vi++) {
    var variant = variants[vi]
    section(c, variant.toUpperCase(), 'row', 6, 'CENTER', function(v) {
      return function(row) {
        for (var ti = 0; ti < tones.length; ti++) {
          row.appendChild(mkBadge(tones[ti][0], v, tones[ti][1]))
        }
      }
    }(variant))
  }

  section(c, 'DOT', 'row', 8, 'CENTER', function(row) {
    for (var i = 0; i < tones.length; i++) {
      row.appendChild(rect('dot', 8, 8, tones[i][1], 1, null, R.full))
    }
  })

  return c
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function mkAvatar(size, shape, statusColor) {
  var sizes = { xs:24, sm:32, md:40, lg:48, xl:64 }
  var p = sizes[size] || 40
  var radius = shape === 'square' ? R.sm : (shape === 'rounded' ? R.lg : R.full)

  // Plain frame — no AutoLayout so we can use absolute x/y on children
  var wrap = plainFrame('Avatar/' + size, p, p)
  wrap.fills = solidFill(C.primary)
  wrap.cornerRadius = radius

  var initials = txt('GR', Math.max(9, Math.floor(p / 3.2)), C.textInverse, 'Semi Bold')
  initials.x = Math.floor(p * 0.18)
  initials.y = Math.floor(p * 0.26)
  wrap.appendChild(initials)

  if (statusColor) {
    var dot = rect('status', 10, 10, statusColor, 1, null, R.full)
    dot.x = p - 12
    dot.y = p - 12
    wrap.appendChild(dot)
    // Add white border by drawing another circle behind
    var dotBg = rect('statusBg', 14, 14, C.surface, 1, null, R.full)
    dotBg.x = p - 14
    dotBg.y = p - 14
    wrap.insertChild(wrap.children.length - 1, dotBg)
  }

  return wrap
}

function drawAvatar() {
  const c = card('👤 Avatar')
  cardHeader(c, 'Avatar', 'size · shape · status · src · initials')

  section(c, 'SIZES', 'row', 8, 'CENTER', function(row) {
    var ss = ['xs','sm','md','lg','xl']
    for (var i = 0; i < ss.length; i++) row.appendChild(mkAvatar(ss[i], 'circle', null))
  })

  section(c, 'SHAPES', 'row', 12, 'CENTER', function(row) {
    row.appendChild(mkAvatar('md', 'circle',  null))
    row.appendChild(mkAvatar('md', 'square',  null))
    row.appendChild(mkAvatar('md', 'rounded', null))
  })

  section(c, 'STATUS', 'row', 12, 'CENTER', function(row) {
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

  section(c, 'SIZE SCALE', 'col', 6, 'MIN', function(col) {
    var scale = [
      [36,'4xl — The void','Bold'],
      [30,'3xl — The void','Bold'],
      [24,'2xl — The void','Semi Bold'],
      [20,'xl — The void','Semi Bold'],
      [18,'lg — The void','Medium'],
      [16,'md — The void','Regular'],
      [14,'base — The void','Regular'],
      [13,'sm — The void','Regular'],
      [11,'xs — The void','Regular'],
    ]
    for (var i = 0; i < scale.length; i++) {
      col.appendChild(txt(scale[i][1], scale[i][0], C.textPrimary, scale[i][2]))
    }
  })

  section(c, 'COLORS', 'col', 8, 'MIN', function(col) {
    var colors = [
      ['primary — Sample text',   C.textPrimary],
      ['secondary — Sample text', C.textSecondary],
      ['muted — Sample text',     C.textMuted],
      ['disabled — Sample text',  C.textDisabled],
      ['accent — Sample text',    C.primary],
    ]
    for (var i = 0; i < colors.length; i++) {
      col.appendChild(txt(colors[i][0], 14, colors[i][1]))
    }
  })

  return c
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function drawDivider() {
  const c = card('➖ Divider')
  cardHeader(c, 'Divider', 'orientation · variant · label · labelAlign · flush')

  section(c, 'LINES', 'col', 12, 'MIN', function(col) {
    var variants = ['solid','dashed','dotted']
    for (var i = 0; i < variants.length; i++) {
      var row = autoFrame(variants[i], 'col', 4, 0, 0)
      row.appendChild(txt(variants[i], 11, C.textMuted, 'Medium'))
      row.appendChild(rect('line', 300, 1, C.border))
      col.appendChild(row)
    }
  })

  section(c, 'WITH LABEL', 'row', 8, 'CENTER', function(row) {
    row.appendChild(rect('left',  80, 1, C.border))
    row.appendChild(txt('Section', 12, C.textMuted, 'Medium'))
    row.appendChild(rect('right', 80, 1, C.border))
  })

  section(c, 'VERTICAL', 'row', 8, 'MIN', function(row) {
    row.appendChild(rect('v1', 1, 48, C.border))
    row.appendChild(rect('v2', 1, 48, C.textMuted))
  })

  return c
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function mkSpinner(size) {
  var sizes = { xs:16, sm:20, md:24, lg:32, xl:40 }
  var p = sizes[size] || 24
  var sw = Math.max(2, Math.floor(p / 10))

  // Plain frame — no AutoLayout, use absolute positioning for children
  var wrap = plainFrame('Spinner/' + size, p, p)

  // Track: Rectangle with cornerRadius (strokeAlign INSIDE works on Rectangle)
  var track = rect('track', p, p, null, 1, C.border, R.full)
  track.strokeWeight = sw
  track.x = 0; track.y = 0
  wrap.appendChild(track)

  // Arc: small filled rectangle (quarter circle visual)
  var qs = Math.ceil(p / 2)
  var arc = rect('arc', qs, qs, C.primary, 1, null, Math.ceil(qs / 2))
  arc.x = 0; arc.y = 0
  wrap.appendChild(arc)

  return wrap
}

function drawSpinner() {
  const c = card('⏳ Spinner')
  cardHeader(c, 'Spinner', 'variant · size')

  section(c, 'SIZES', 'row', 12, 'CENTER', function(row) {
    var ss = ['xs','sm','md','lg','xl']
    for (var i = 0; i < ss.length; i++) row.appendChild(mkSpinner(ss[i]))
  })

  return c
}

// ─── TextField ───────────────────────────────────────────────────────────────

function mkTextField(state, size) {
  var heights = { sm:32, md:40, lg:48 }
  var h = heights[size] || 40
  var borderColors = { default:C.border, error:C.error, success:C.success, warning:C.warning }
  var borderC = borderColors[state] || C.border
  var hintC = state === 'default' ? C.textMuted : borderC
  var hintTxt = state === 'error' ? 'Error message' : 'Hint text'

  var col = autoFrame('TF', 'col', 4, 0, 0)
  col.appendChild(txt('Label', 11, C.textSecondary, 'Medium'))

  // Input: AutoLayout row, FIXED both axes
  var inp = autoFrame('input', 'row', 0, 12, 0)
  // Set FIXED sizing AFTER layoutMode, THEN resize
  inp.primaryAxisSizingMode = 'FIXED'
  inp.counterAxisSizingMode = 'FIXED'
  inp.resize(170, h)
  inp.primaryAxisAlignItems = 'MIN'
  inp.counterAxisAlignItems = 'CENTER'
  inp.fills = solidFill(C.overlay)
  inp.strokes = solidFill(borderC)
  inp.strokeWeight = 1
  inp.strokeAlign = 'INSIDE'
  inp.cornerRadius = R.md
  inp.appendChild(txt('Placeholder…', 14, C.textMuted, 'Regular'))
  col.appendChild(inp)

  col.appendChild(txt(hintTxt, 11, hintC, 'Regular'))
  return col
}

function drawTextField() {
  const c = card('📝 TextField')
  cardHeader(c, 'TextField', 'size · state · label · hint · error · prefix · suffix · fullWidth')

  section(c, 'STATES', 'row', 8, 'MIN', function(row) {
    var ss = ['default','error','success','warning']
    for (var i = 0; i < ss.length; i++) row.appendChild(mkTextField(ss[i], 'md'))
  })

  section(c, 'SIZES', 'row', 8, 'MIN', function(row) {
    var ss = ['sm','md','lg']
    for (var i = 0; i < ss.length; i++) row.appendChild(mkTextField('default', ss[i]))
  })

  return c
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function drawStack() {
  const c = card('📦 Stack')
  cardHeader(c, 'Stack', 'as · direction · gap · align · justify · wrap · full')

  section(c, 'ROW  gap=4 (16px)', 'row', 16, 'CENTER', function(row) {
    for (var i = 1; i <= 4; i++) {
      var item = autoFrame('item', 'row', 0, 12, 6)
      item.fills = solidFill(C.overlay)
      item.strokes = solidFill(C.border)
      item.strokeWeight = 1
      item.strokeAlign = 'INSIDE'
      item.cornerRadius = R.md
      item.appendChild(txt('Item ' + i, 11, C.textSecondary, 'Regular'))
      row.appendChild(item)
    }
  })

  section(c, 'COLUMN  gap=2 (8px)', 'col', 8, 'MIN', function(col) {
    for (var i = 1; i <= 3; i++) {
      var item = autoFrame('item', 'row', 0, 12, 6)
      item.fills = solidFill(C.overlay)
      item.strokes = solidFill(C.border)
      item.strokeWeight = 1
      item.strokeAlign = 'INSIDE'
      item.cornerRadius = R.md
      item.appendChild(txt('Item ' + i, 11, C.textSecondary, 'Regular'))
      col.appendChild(item)
    }
  })

  return c
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function run() {
  await loadFonts()

  var NAMES = ['🔘 Button','🏷 Badge','👤 Avatar','✍️ Typography','➖ Divider','⏳ Spinner','📝 TextField','📦 Stack']
  figma.currentPage.children.filter(function(n) { return NAMES.indexOf(n.name) !== -1 }).forEach(function(n) { n.remove() })

  var drawFns = [
    ['🔘 Button',     drawButton],
    ['🏷 Badge',      drawBadge],
    ['👤 Avatar',     drawAvatar],
    ['✍️ Typography', drawTypography],
    ['➖ Divider',    drawDivider],
    ['⏳ Spinner',    drawSpinner],
    ['📝 TextField',  drawTextField],
    ['📦 Stack',      drawStack],
  ]

  var cards = []
  for (var i = 0; i < drawFns.length; i++) {
    var name = drawFns[i][0]
    var fn   = drawFns[i][1]
    try {
      console.log('START ' + name)
      var c = fn()
      console.log('OK    ' + name + ' ' + Math.round(c.width) + 'x' + Math.round(c.height))
      cards.push(c)
    } catch(e) {
      var msg = e && e.message ? e.message : String(e)
      console.error('FAIL  ' + name + ': ' + msg)
      figma.notify('FAIL ' + name + ': ' + msg, { error:true, timeout:10000 })
    }
  }

  var COLS = 3, GAP = 40
  var col = 0, x = 0, y = 0, rowH = 0
  for (var j = 0; j < cards.length; j++) {
    figma.currentPage.appendChild(cards[j])
    cards[j].x = x
    cards[j].y = y
    rowH = Math.max(rowH, cards[j].height)
    x += cards[j].width + GAP
    col++
    if (col >= COLS) { col = 0; x = 0; y += rowH + GAP; rowH = 0 }
  }

  figma.viewport.scrollAndZoomIntoView(
    figma.currentPage.children.filter(function(n) { return NAMES.indexOf(n.name) !== -1 })
  )
  figma.closePlugin('void-ui ' + cards.length + '/8 componentes')
}

run().catch(function(err) { figma.closePlugin('ERROR: ' + err.message) })
