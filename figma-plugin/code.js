/**
 * void-ui Figma Plugin
 * Draws all 8 components on the canvas with all variants, sizes and states.
 *
 * Install: Figma Desktop → Plugins → Development → Import plugin from manifest
 * Select:  figma-plugin/manifest.json
 */

// ─── Color tokens ─────────────────────────────────────────────────────────────

const C = {
  bg:        { r: 0.039, g: 0.039, b: 0.059 },
  surface:   { r: 0.074, g: 0.074, b: 0.102 },
  surfaceEl: { r: 0.117, g: 0.117, b: 0.161 },
  border:    { r: 0.165, g: 0.165, b: 0.227 },
  text:      { r: 0.910, g: 0.910, b: 0.941 },
  textSub:   { r: 0.596, g: 0.596, b: 0.690 },
  textMuted: { r: 0.420, g: 0.420, b: 0.502 },
  primary:   { r: 0.388, g: 0.400, b: 0.945 },
  primaryHv: { r: 0.310, g: 0.275, b: 0.898 },
  success:   { r: 0.133, g: 0.773, b: 0.369 },
  warning:   { r: 0.961, g: 0.620, b: 0.043 },
  error:     { r: 0.937, g: 0.267, b: 0.267 },
  info:      { r: 0.231, g: 0.510, b: 0.965 },
  white:     { r: 1,     g: 1,     b: 1     },
}

function solid(c, a = 1) { return [{ type: 'SOLID', color: c, opacity: a }] }

// ─── Font loading ─────────────────────────────────────────────────────────────

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ])
}

// ─── Node helpers ─────────────────────────────────────────────────────────────

function frame(name, x, y, w, h, bg = C.surface) {
  const f = figma.createFrame()
  f.name = name; f.x = x; f.y = y
  f.resize(w, h)
  f.fills = solid(bg)
  f.strokes = solid(C.border)
  f.strokeWeight = 1
  f.cornerRadius = 12
  f.clipsContent = false
  return f
}

function rect(parent, name, x, y, w, h, fill, stroke = null, radius = 6) {
  const r = figma.createRectangle()
  parent.appendChild(r)
  r.name = name; r.x = x; r.y = y
  r.resize(w, h)
  r.fills = fill ? solid(fill) : []
  if (stroke) { r.strokes = solid(stroke); r.strokeWeight = 1 }
  r.cornerRadius = radius
  return r
}

function txt(parent, content, x, y, size, color, weight = 'Regular') {
  const t = figma.createText()
  parent.appendChild(t)
  t.fontName = { family: 'Inter', style: weight }
  t.fontSize = size
  t.characters = String(content)
  t.fills = solid(color)
  t.x = x; t.y = y
  return t
}

function label(parent, content, x, y) {
  return txt(parent, content, x, y, 10, C.textMuted, 'Semi Bold')
}

// ─── Button ───────────────────────────────────────────────────────────────────

function drawButton(page) {
  const f = frame('🔘 Button', 0, 0, 760, 460)
  page.appendChild(f)
  txt(f, 'Button', 32, 32, 22, C.text, 'Bold')
  txt(f, 'variant · size · loading · iconBefore · iconAfter · fullWidth', 32, 60, 11, C.textMuted)

  // Variants
  label(f, 'VARIANTS', 32, 90)
  const variants   = ['primary','secondary','ghost','outlined','danger']
  const varBg      = { primary: C.primary, secondary: C.surfaceEl, ghost: null, outlined: null, danger: C.error }
  const varFg      = { primary: C.white,   secondary: C.text,    ghost: C.text, outlined: C.text, danger: C.white }
  const varBdr     = { primary: null, secondary: C.border, ghost: null, outlined: C.border, danger: null }
  let cx = 32
  for (const v of variants) {
    const lbl = v.charAt(0).toUpperCase() + v.slice(1)
    const w = lbl.length * 8 + 32
    rect(f, `Button/${v}/md`, cx, 106, w, 36, varBg[v], varBdr[v], 6)
    txt(f, lbl, cx + 16, 119, 13, varFg[v], 'Medium')
    cx += w + 10
  }

  // Sizes
  label(f, 'SIZES', 32, 166)
  const sizeH = { sm:28, md:36, lg:44 }
  const sizeF = { sm:11, md:13, lg:15 }
  const sizeP = { sm:12, md:16, lg:20 }
  cx = 32
  for (const s of ['sm','md','lg']) {
    const lbl = s.toUpperCase(); const w = lbl.length * 9 + sizeP[s]*2
    rect(f, `Button/primary/${s}`, cx, 182, w, sizeH[s], C.primary, null, 6)
    txt(f, lbl, cx + sizeP[s], 182 + (sizeH[s]-sizeF[s])/2, sizeF[s], C.white, 'Medium')
    cx += w + 10
  }

  // States
  label(f, 'STATES', 32, 252)
  const stateData = [
    ['Default',   C.primary,   C.white, 1  ],
    ['Disabled',  C.primary,   C.white, 0.4],
    ['Loading ↻', C.primaryHv, C.white, 1  ],
    ['Secondary', C.surfaceEl, C.text,  1  ],
    ['Ghost',     null,        C.text,  1  ],
  ]
  cx = 32
  for (const [lbl, bg, fg, op] of stateData) {
    const w = 110
    const r = rect(f, `Button/state/${lbl.toLowerCase()}`, cx, 268, w, 36, bg, bg ? null : C.border, 6)
    r.opacity = op
    txt(f, lbl, cx + 16, 281, 13, fg, 'Medium')
    cx += w + 8
  }

  // Icons
  label(f, 'WITH ICONS', 32, 334)
  const iconEx = [['← Before', 110], ['After →', 110], ['← Both →', 120]]
  cx = 32
  for (const [lbl, w] of iconEx) {
    rect(f, 'Button/primary/icon', cx, 350, w, 36, C.primary, null, 6)
    txt(f, lbl, cx + 14, 363, 13, C.white, 'Medium')
    cx += w + 8
  }

  // Full width
  label(f, 'FULL WIDTH', 32, 412)
  rect(f, 'Button/primary/fullWidth', 32, 428, 696, 36, C.primary, null, 6)
  txt(f, 'Full Width Button', 32 + 296, 441, 13, C.white, 'Medium')

  return f
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function drawBadge(page) {
  const f = frame('🏷 Badge', 800, 0, 580, 340)
  page.appendChild(f)
  txt(f, 'Badge', 32, 32, 22, C.text, 'Bold')
  txt(f, 'variant · tone · size · dot', 32, 60, 11, C.textMuted)

  label(f, 'VARIANTS × TONES', 32, 90)
  const tones = ['default','success','warning','error','info']
  const toneC = { default: C.textMuted, success: C.success, warning: C.warning, error: C.error, info: C.info }
  const variants = ['solid','subtle','outlined']

  let row = 0
  for (const v of variants) {
    txt(f, v, 32, 106 + row*56, 10, C.textMuted, 'Medium')
    let cx = 90
    for (const t of tones) {
      const c = toneC[t]
      const w = 80; const h = 22
      const r = rect(f, `Badge/${v}/${t}`, cx, 118 + row*56, w, h, null, null, 11)
      if (v === 'solid')    { r.fills = solid(c) }
      else if (v === 'subtle')   { r.fills = solid(c, 0.15) }
      else                        { r.fills = []; r.strokes = solid(c); r.strokeWeight = 1 }
      const fg = v === 'solid' ? C.white : c
      txt(f, t, cx + 8, 118 + row*56 + 6, 10, fg, 'Medium')
      cx += w + 8
    }
    row++
  }

  // Sizes
  label(f, 'SIZES', 32, 280)
  let cx = 32
  for (const [s, h, fs] of [['sm',20,10],['md',24,12]]) {
    const r = rect(f, `Badge/solid/default/${s}`, cx, 296, 64, h, C.textMuted, null, h/2)
    txt(f, s, cx + 8, 296 + (h-fs)/2, fs, C.white, 'Medium')
    cx += 80
  }

  // Dot
  label(f, 'DOT', 240, 280)
  cx = 280
  for (const t of tones) {
    rect(f, `Badge/dot/${t}`, cx, 298, 8, 8, toneC[t], null, 4)
    cx += 20
  }

  return f
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function drawAvatar(page) {
  const f = frame('👤 Avatar', 0, 500, 560, 380)
  page.appendChild(f)
  txt(f, 'Avatar', 32, 32, 22, C.text, 'Bold')
  txt(f, 'size · shape · status · src · initials', 32, 60, 11, C.textMuted)

  // Sizes
  label(f, 'SIZES', 32, 90)
  const sizePx = { xs:24, sm:32, md:40, lg:48, xl:64 }
  let cx = 32
  for (const [s, p] of Object.entries(sizePx)) {
    rect(f, `Avatar/${s}/circle`, cx, 106, p, p, C.primary, null, p/2)
    txt(f, 'GR', cx + Math.floor(p*.2), 106 + Math.floor(p*.28), Math.max(9,Math.floor(p/3.2)), C.white, 'Semi Bold')
    txt(f, s, cx, 106+p+4, 9, C.textMuted)
    cx += p + 14
  }

  // Shapes
  label(f, 'SHAPES', 32, 194)
  cx = 32
  for (const [sh, rad] of [['circle',20],['square',6],['rounded',12]]) {
    rect(f, `Avatar/md/${sh}`, cx, 210, 40, 40, C.primary, null, rad)
    txt(f, 'GR', cx + 10, 222, 12, C.white, 'Semi Bold')
    txt(f, sh, cx, 254, 9, C.textMuted)
    cx += 60
  }

  // Status
  label(f, 'STATUS', 32, 278)
  const statuses  = ['online','offline','busy','away']
  const statusC   = { online: C.success, offline: C.textMuted, busy: C.error, away: C.warning }
  cx = 32
  for (const st of statuses) {
    rect(f, `Avatar/md/${st}`, cx, 294, 40, 40, C.surfaceEl, C.border, 20)
    txt(f, 'GR', cx + 10, 306, 12, C.text, 'Medium')
    rect(f, `Status/${st}`, cx+30, 324, 10, 10, statusC[st], null, 5)
    txt(f, st, cx, 338, 9, C.textMuted)
    cx += 60
  }

  return f
}

// ─── Typography ───────────────────────────────────────────────────────────────

function drawTypography(page) {
  const f = frame('✍️ Typography', 600, 500, 520, 600)
  page.appendChild(f)
  txt(f, 'Typography', 32, 32, 22, C.text, 'Bold')
  txt(f, 'size · color · weight · leading · tracking · mono · truncate', 32, 60, 11, C.textMuted)

  label(f, 'SIZE SCALE', 32, 90)
  const scale = [['4xl',36,'Bold'],['3xl',30,'Bold'],['2xl',24,'Semi Bold'],['xl',20,'Semi Bold'],['lg',18,'Medium'],['md',16,'Regular'],['base',14,'Regular'],['sm',12,'Regular'],['xs',10,'Regular']]
  let cy = 106
  for (const [s, px, w] of scale) {
    txt(f, `${s} — The void`, 32, cy, px, C.text, w)
    txt(f, `${px}px`, 440, cy + (px-10)/2, 10, C.textMuted)
    cy += px + 10
  }

  label(f, 'COLORS', 32, cy + 8)
  cy += 24
  for (const [c, col] of [['primary',C.text],['secondary',C.textSub],['muted',C.textMuted],['disabled',C.border],['accent',C.primary]]) {
    txt(f, `${c} — Sample text`, 32, cy, 14, col)
    cy += 24
  }

  f.resize(520, cy + 32)
  return f
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function drawDivider(page) {
  const f = frame('➖ Divider', 0, 920, 440, 280)
  page.appendChild(f)
  txt(f, 'Divider', 32, 32, 22, C.text, 'Bold')
  txt(f, 'orientation · variant · label · labelAlign · flush', 32, 60, 11, C.textMuted)

  label(f, 'VARIANTS', 32, 90)
  let cy = 106
  for (const v of ['solid','dashed','dotted']) {
    txt(f, v, 32, cy, 10, C.textMuted, 'Medium')
    rect(f, `Divider/${v}`, 32, cy + 14, 370, 1, C.border, null, 0)
    cy += 38
  }

  label(f, 'WITH LABEL', 32, cy + 8)
  cy += 24
  rect(f, 'Divider/label/left', 32, cy + 8, 110, 1, C.border, null, 0)
  txt(f, 'Section', 152, cy, 11, C.textMuted)
  rect(f, 'Divider/label/right', 200, cy + 8, 202, 1, C.border, null, 0)
  cy += 36

  label(f, 'VERTICAL', 32, cy + 8)
  cy += 24
  rect(f, 'Divider/vertical', 32, cy, 1, 60, C.border, null, 0)
  rect(f, 'Divider/vertical/dashed', 48, cy, 1, 60, C.border, null, 0)

  return f
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function drawSpinner(page) {
  const f = frame('⏳ Spinner', 480, 920, 500, 280)
  page.appendChild(f)
  txt(f, 'Spinner', 32, 32, 22, C.text, 'Bold')
  txt(f, 'variant · size', 32, 60, 11, C.textMuted)

  label(f, 'VARIANTS × SIZES', 32, 90)
  const sizePx = { xs:16, sm:20, md:24, lg:32, xl:40 }
  let row = 0
  for (const v of ['ring','dots','pulse']) {
    txt(f, v, 32, 106 + row*68, 10, C.textMuted, 'Medium')
    let cx = 80
    for (const [s, p] of Object.entries(sizePx)) {
      rect(f, `Spinner/${v}/${s}/track`, cx, 118 + row*68, p, p, null, C.border, p/2)
      rect(f, `Spinner/${v}/${s}/arc`,   cx, 118 + row*68, Math.ceil(p/4), Math.ceil(p/4), C.primary, null, Math.ceil(p/8))
      cx += p + 16
    }
    row++
  }

  return f
}

// ─── TextField ───────────────────────────────────────────────────────────────

function drawTextField(page) {
  const f = frame('📝 TextField', 0, 1240, 820, 320)
  page.appendChild(f)
  txt(f, 'TextField', 32, 32, 22, C.text, 'Bold')
  txt(f, 'size · state · label · hint · error · prefix · suffix · fullWidth', 32, 60, 11, C.textMuted)

  label(f, 'STATES', 32, 90)
  const stateC = { default: C.border, error: C.error, success: C.success, warning: C.warning }
  let cx = 32
  for (const s of ['default','error','success','warning']) {
    txt(f, 'Label', cx, 106, 11, C.textSub, 'Medium')
    rect(f, `TextField/${s}`, cx, 122, 170, 40, C.surfaceEl, stateC[s], 6)
    txt(f, 'Placeholder…', cx + 12, 134, 12, C.textMuted)
    txt(f, s === 'error' ? '✗ Error message' : 'Hint text', cx, 168, 10, stateC[s])
    cx += 190
  }

  label(f, 'SIZES', 32, 200)
  cx = 32
  for (const [s, h] of [['sm',32],['md',40],['lg',48]]) {
    rect(f, `TextField/default/${s}`, cx, 216, 170, h, C.surfaceEl, C.border, 6)
    txt(f, s, cx + 12, 216 + (h-12)/2, 11, C.textMuted)
    cx += 186
  }

  label(f, 'WITH PREFIX / SUFFIX', 32, 278)
  rect(f, 'TextField/prefix', 32, 294, 220, 40, C.surfaceEl, C.border, 6)
  txt(f, '✉', 44, 306, 14, C.textMuted)
  txt(f, 'user@example.com', 64, 306, 12, C.textMuted)
  rect(f, 'TextField/suffix', 268, 294, 220, 40, C.surfaceEl, C.border, 6)
  txt(f, 'Search…', 280, 306, 12, C.textMuted)
  txt(f, '⌕', 456, 306, 14, C.textMuted)

  return f
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function drawStack(page) {
  const f = frame('📦 Stack', 860, 1240, 420, 280)
  page.appendChild(f)
  txt(f, 'Stack', 32, 32, 22, C.text, 'Bold')
  txt(f, 'direction · gap · align · justify · wrap · full', 32, 60, 11, C.textMuted)

  label(f, 'ROW · gap=4', 32, 90)
  let cx = 32
  for (let i = 1; i <= 4; i++) {
    rect(f, `Stack/row/item${i}`, cx, 106, 68, 32, C.surfaceEl, C.border, 4)
    txt(f, `Item ${i}`, cx + 8, 116, 10, C.textSub)
    cx += 76
  }

  label(f, 'COLUMN · gap=2', 32, 162)
  let cy = 178
  for (let i = 1; i <= 3; i++) {
    rect(f, `Stack/col/item${i}`, 32, cy, 140, 28, C.surfaceEl, C.border, 4)
    txt(f, `Item ${i}`, 44, cy + 9, 10, C.textSub)
    cy += 36
  }

  label(f, 'JUSTIFY', 200, 162)
  cy = 178
  for (const j of ['start','center','end','space-between']) {
    txt(f, `justify="${j}"`, 200, cy, 10, C.textMuted)
    cy += 22
  }

  return f
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function run() {
  await loadFonts()

  // Remove existing void-ui frames
  const names = ['🔘 Button','🏷 Badge','👤 Avatar','✍️ Typography','➖ Divider','⏳ Spinner','📝 TextField','📦 Stack']
  figma.currentPage.children.filter(n => names.includes(n.name)).forEach(n => n.remove())

  const page = figma.currentPage

  drawButton(page)
  drawBadge(page)
  drawAvatar(page)
  drawTypography(page)
  drawDivider(page)
  drawSpinner(page)
  drawTextField(page)
  drawStack(page)

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children)
  figma.closePlugin('✅ All 8 void-ui components drawn!')
}

run().catch(err => figma.closePlugin(`❌ ${err.message}`))
