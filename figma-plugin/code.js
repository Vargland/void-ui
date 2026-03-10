/**
 * void-ui Figma Plugin
 * Draws all 8 components with exact token values from packages/tokens/dist/variables.css
 *
 * Install: Figma Desktop → Plugins → Development → Import plugin from manifest
 * Select:  figma-plugin/manifest.json
 */

// ─── Resolved token values (from dist/variables.css) ─────────────────────────

const T = {
  // Primitives
  neutral0:   { r:0.039, g:0.039, b:0.039 }, // #0a0a0a  — bg base
  neutral50:  { r:0.067, g:0.067, b:0.067 }, // #111111
  neutral100: { r:0.102, g:0.102, b:0.102 }, // #1a1a1a  — surface
  neutral150: { r:0.141, g:0.141, b:0.141 }, // #242424  — overlay
  neutral200: { r:0.180, g:0.180, b:0.180 }, // #2e2e2e  — border, action-secondary
  neutral300: { r:0.239, g:0.239, b:0.239 }, // #3d3d3d  — border-strong
  neutral400: { r:0.322, g:0.322, b:0.322 }, // #525252  — text-disabled
  neutral500: { r:0.451, g:0.451, b:0.451 }, // #737373  — text-muted
  neutral600: { r:0.639, g:0.639, b:0.639 }, // #a3a3a3  — text-secondary
  neutral700: { r:0.831, g:0.831, b:0.831 }, // #d4d4d4
  neutral900: { r:0.961, g:0.961, b:0.961 }, // #f5f5f5  — text-primary, white

  void600:    { r:0.400, g:0.400, b:1.000 }, // #6666ff  — action-primary
  void700:    { r:0.533, g:0.533, b:1.000 }, // #8888ff  — action-primary-hover
  void500:    { r:0.267, g:0.267, b:0.867 }, // #4444dd  — action-primary-active

  success500: { r:0.133, g:0.773, b:0.369 }, // #22c55e
  warning500: { r:0.961, g:0.620, b:0.043 }, // #f59e0b
  error500:   { r:0.937, g:0.267, b:0.267 }, // #ef4444
}

// Semantic aliases
const S = {
  bg:               T.neutral0,
  surface:          T.neutral100,
  overlay:          T.neutral150,
  borderDefault:    T.neutral200,
  borderSubtle:     T.neutral150,
  borderStrong:     T.neutral300,
  borderFocus:      T.void600,
  textPrimary:      T.neutral900,
  textSecondary:    T.neutral600,
  textMuted:        T.neutral500,
  textDisabled:     T.neutral400,
  textInverse:      T.neutral0,
  textAccent:       T.void600,
  actionPrimary:    T.void600,
  actionPrimaryHv:  T.void700,
  actionPrimaryAct: T.void500,
  actionSecondary:  T.neutral200,
  actionSecondaryHv:T.neutral300,
  statusSuccess:    T.success500,
  statusWarning:    T.warning500,
  statusError:      T.error500,
}

// Spacing (px values from --void-space-*)
const SPACE = { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64 }

// Radius (px from --void-radius-*)
const RADIUS = { none:0, sm:2, md:4, lg:8, xl:12, full:9999 }

// Font sizes (px from --void-font-size-*)
const FS = { xs:11, sm:13, base:14, md:16, lg:18, xl:20, '2xl':24, '3xl':30, '4xl':36 }

// Button sizes (from base.scss)
const BTN = {
  sm: { h:28, px:SPACE[3], fs:FS.sm,  icon:14, gap:SPACE[1], r:RADIUS.md },
  md: { h:36, px:SPACE[4], fs:FS.base,icon:16, gap:SPACE[2], r:RADIUS.md },
  lg: { h:44, px:SPACE[6], fs:FS.md,  icon:18, gap:SPACE[2], r:RADIUS.lg },
}

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

function solid(c, a = 1) { return [{ type: 'SOLID', color: c, opacity: a }] }

function mkFrame(name, x, y, w, h) {
  const f = figma.createFrame()
  f.name = name; f.x = x; f.y = y; f.resize(w, h)
  f.fills = solid(S.surface)
  f.strokes = solid(S.borderDefault); f.strokeWeight = 1
  f.cornerRadius = RADIUS.xl
  f.clipsContent = false
  return f
}

function mkRect(parent, name, x, y, w, h, fill, stroke, radius = RADIUS.md, opacity = 1) {
  const r = figma.createRectangle()
  parent.appendChild(r)
  r.name = name; r.x = x; r.y = y; r.resize(Math.max(1,w), Math.max(1,h))
  r.fills = fill ? solid(fill, opacity) : []
  if (stroke) { r.strokes = solid(stroke); r.strokeWeight = 1 }
  r.cornerRadius = radius
  return r
}

function mkText(parent, content, x, y, size, color, weight = 'Regular') {
  const t = figma.createText()
  parent.appendChild(t)
  t.fontName = { family: 'Inter', style: weight }
  t.fontSize = size
  t.characters = String(content)
  t.fills = solid(color)
  t.x = x; t.y = y
  return t
}

function sectionLbl(parent, content, x, y) {
  return mkText(parent, content, x, y, 10, S.textMuted, 'Semi Bold')
}

function componentHeader(parent, name, props) {
  mkText(parent, name, SPACE[8], SPACE[8], FS.xl, S.textPrimary, 'Bold')
  mkText(parent, props, SPACE[8], SPACE[8] + 28, FS.xs, S.textMuted, 'Regular')
}

// ─── Button ───────────────────────────────────────────────────────────────────

function drawButton(page) {
  const PAD = SPACE[8]
  const f = mkFrame('🔘 Button', 0, 0, 780, 480)
  page.appendChild(f)
  componentHeader(f, 'Button', 'variant · size · loading · iconBefore · iconAfter · fullWidth · as')

  // ── Variants
  sectionLbl(f, 'VARIANTS', PAD, 90)
  const variants = [
    { name:'primary',   bg:S.actionPrimary,   fg:S.textInverse,  border:null              },
    { name:'secondary', bg:S.actionSecondary,  fg:S.textPrimary,  border:S.borderDefault   },
    { name:'ghost',     bg:null,               fg:S.textPrimary,  border:null              },
    { name:'outlined',  bg:null,               fg:S.actionPrimary,border:S.actionPrimary   },
    { name:'danger',    bg:S.statusError,      fg:S.textInverse,  border:null              },
  ]
  let cx = PAD
  for (const v of variants) {
    const lbl = v.name.charAt(0).toUpperCase() + v.name.slice(1)
    const w = BTN.md.px * 2 + lbl.length * 8
    mkRect(f, `Button/${v.name}/md`, cx, 106, w, BTN.md.h, v.bg, v.border, BTN.md.r)
    mkText(f, lbl, cx + BTN.md.px - 4, 106 + (BTN.md.h - BTN.md.fs) / 2, BTN.md.fs, v.fg, 'Medium')
    cx += w + SPACE[2]
  }

  // ── Sizes
  sectionLbl(f, 'SIZES', PAD, 170)
  cx = PAD
  for (const [s, cfg] of Object.entries(BTN)) {
    const lbl = s.toUpperCase()
    const w = cfg.px * 2 + lbl.length * 8
    mkRect(f, `Button/primary/${s}`, cx, 186, w, cfg.h, S.actionPrimary, null, cfg.r)
    mkText(f, lbl, cx + cfg.px - 4, 186 + (cfg.h - cfg.fs) / 2, cfg.fs, S.textInverse, 'Medium')
    cx += w + SPACE[2]
  }

  // ── States
  sectionLbl(f, 'STATES', PAD, 254)
  const states = [
    { lbl:'Default',    bg:S.actionPrimary,    fg:S.textInverse, op:1   },
    { lbl:'Hover',      bg:S.actionPrimaryHv,  fg:S.textInverse, op:1   },
    { lbl:'Active',     bg:S.actionPrimaryAct, fg:S.textInverse, op:1   },
    { lbl:'Disabled',   bg:S.actionPrimary,    fg:S.textInverse, op:0.4 },
    { lbl:'Loading ↻',  bg:S.actionPrimaryHv,  fg:S.textInverse, op:1   },
  ]
  cx = PAD
  for (const st of states) {
    const w = 106
    const r = mkRect(f, `Button/primary/md/${st.lbl.toLowerCase()}`, cx, 270, w, BTN.md.h, st.bg, null, BTN.md.r)
    r.opacity = st.op
    mkText(f, st.lbl, cx + BTN.md.px - 4, 270 + (BTN.md.h - BTN.md.fs) / 2, BTN.md.fs, st.fg, 'Medium')
    cx += w + SPACE[2]
  }

  // ── Icons
  sectionLbl(f, 'WITH ICONS', PAD, 338)
  cx = PAD
  for (const [lbl, w] of [['← Before', 110],['After →', 110],['← Both →', 118]]) {
    mkRect(f, 'Button/primary/icon', cx, 354, w, BTN.md.h, S.actionPrimary, null, BTN.md.r)
    mkText(f, lbl, cx + BTN.md.px - 4, 354 + (BTN.md.h - BTN.md.fs) / 2, BTN.md.fs, S.textInverse, 'Medium')
    cx += w + SPACE[2]
  }

  // ── Full width
  sectionLbl(f, 'FULL WIDTH', PAD, 418)
  mkRect(f, 'Button/primary/fullWidth', PAD, 434, 780 - PAD*2, BTN.md.h, S.actionPrimary, null, BTN.md.r)
  mkText(f, 'Full Width Button', 780/2 - 56, 434 + (BTN.md.h - BTN.md.fs)/2, BTN.md.fs, S.textInverse, 'Medium')

  return f
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function drawBadge(page) {
  const PAD = SPACE[8]
  const f = mkFrame('🏷 Badge', 820, 0, 600, 340)
  page.appendChild(f)
  componentHeader(f, 'Badge', 'variant · tone · size · dot')

  const tones = ['default','success','warning','error','info']
  const toneC = {
    default: S.textMuted,
    success: S.statusSuccess,
    warning: S.statusWarning,
    error:   S.statusError,
    info:    T.void600,
  }
  const BADGE_H = { sm:20, md:24 }
  const BADGE_FS = { sm:FS.xs, md:FS.sm }
  const BADGE_PX = { sm:SPACE[2], md:SPACE[3] }

  // Variants × Tones
  sectionLbl(f, 'VARIANTS × TONES', PAD, 90)
  let row = 0
  for (const v of ['solid','subtle','outlined']) {
    mkText(f, v, PAD, 106 + row*60, FS.xs, S.textMuted, 'Medium')
    let cx = PAD + 68
    for (const t of tones) {
      const c = toneC[t]
      const w = 80; const h = BADGE_H.md
      const bg   = v === 'solid' ? c : null
      const border = v === 'outlined' ? c : null
      const bgOp   = v === 'subtle' ? 0.15 : 1
      const r = mkRect(f, `Badge/${v}/${t}`, cx, 118 + row*60, w, h, bg || (v==='subtle' ? c : null), border, RADIUS.full, v==='subtle' ? bgOp : 1)
      if (v === 'subtle') r.fills = solid(c, 0.15)
      const fg = v === 'solid' ? S.textInverse : c
      mkText(f, t, cx + BADGE_PX.md, 118 + row*60 + (h - BADGE_FS.md)/2, BADGE_FS.md, fg, 'Medium')
      cx += w + SPACE[2]
    }
    row++
  }

  // Sizes
  sectionLbl(f, 'SIZES', PAD, 284)
  let cx = PAD
  for (const s of ['sm','md']) {
    const h = BADGE_H[s]; const w = 56
    mkRect(f, `Badge/solid/default/${s}`, cx, 300, w, h, S.textMuted, null, RADIUS.full)
    mkText(f, s, cx + BADGE_PX[s], 300 + (h - BADGE_FS[s])/2, BADGE_FS[s], S.textInverse, 'Medium')
    cx += 72
  }

  // Dot
  sectionLbl(f, 'DOT', 280, 284)
  cx = 316
  for (const t of tones) {
    mkRect(f, `Badge/dot/${t}`, cx, 302, 8, 8, toneC[t], null, RADIUS.full)
    cx += 20
  }

  return f
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function drawAvatar(page) {
  const PAD = SPACE[8]
  const f = mkFrame('👤 Avatar', 0, 520, 560, 380)
  page.appendChild(f)
  componentHeader(f, 'Avatar', 'size · shape · status · src · initials')

  // Sizes
  sectionLbl(f, 'SIZES', PAD, 90)
  const avatarSizes = { xs:24, sm:32, md:40, lg:48, xl:64 }
  let cx = PAD
  for (const [s, p] of Object.entries(avatarSizes)) {
    mkRect(f, `Avatar/${s}/circle`, cx, 106, p, p, S.actionPrimary, null, RADIUS.full)
    mkText(f, 'GR', cx + Math.floor(p*.2), 106 + Math.floor(p*.28), Math.max(9, Math.floor(p/3.2)), S.textInverse, 'Semi Bold')
    mkText(f, s, cx, 106+p+4, FS.xs, S.textMuted)
    cx += p + SPACE[3]
  }

  // Shapes
  sectionLbl(f, 'SHAPES', PAD, 200)
  cx = PAD
  for (const [sh, r] of [['circle',RADIUS.full],['square',RADIUS.sm],['rounded',RADIUS.lg]]) {
    mkRect(f, `Avatar/md/${sh}`, cx, 216, 40, 40, S.actionPrimary, null, r)
    mkText(f, 'GR', cx + 10, 228, FS.sm, S.textInverse, 'Semi Bold')
    mkText(f, sh, cx, 260, FS.xs, S.textMuted)
    cx += 60
  }

  // Status
  sectionLbl(f, 'STATUS', PAD, 282)
  const statuses = { online:S.statusSuccess, offline:S.textMuted, busy:S.statusError, away:S.statusWarning }
  cx = PAD
  for (const [st, c] of Object.entries(statuses)) {
    mkRect(f, `Avatar/md/${st}`, cx, 298, 40, 40, S.overlay, S.borderDefault, RADIUS.full)
    mkText(f, 'GR', cx+10, 310, FS.sm, S.textPrimary, 'Medium')
    mkRect(f, `Status/${st}`, cx+30, 328, 10, 10, c, null, RADIUS.full)
    mkText(f, st, cx, 342, FS.xs, S.textMuted)
    cx += 60
  }

  return f
}

// ─── Typography ───────────────────────────────────────────────────────────────

function drawTypography(page) {
  const PAD = SPACE[8]
  const f = mkFrame('✍️ Typography', 600, 520, 520, 580)
  page.appendChild(f)
  componentHeader(f, 'Typography', 'as · size · color · weight · leading · tracking · mono · truncate')

  sectionLbl(f, 'SIZE SCALE', PAD, 90)
  const scale = [
    ['4xl',36,'Bold'],['3xl',30,'Bold'],['2xl',24,'Semi Bold'],
    ['xl',20,'Semi Bold'],['lg',18,'Medium'],['md',16,'Regular'],
    ['base',14,'Regular'],['sm',13,'Regular'],['xs',11,'Regular'],
  ]
  let cy = 106
  for (const [s, px, w] of scale) {
    mkText(f, `${s} — The void`, PAD, cy, px, S.textPrimary, w)
    mkText(f, `${px}px`, 440, cy + (px-FS.xs)/2, FS.xs, S.textMuted)
    cy += px + SPACE[2]
  }

  sectionLbl(f, 'COLORS', PAD, cy + SPACE[2])
  cy += 20
  for (const [c, col] of [
    ['primary',  S.textPrimary],
    ['secondary',S.textSecondary],
    ['muted',    S.textMuted],
    ['disabled', S.textDisabled],
    ['accent',   S.textAccent],
  ]) {
    mkText(f, `${c} — Sample text`, PAD, cy, FS.base, col)
    cy += 24
  }

  f.resize(520, cy + PAD)
  return f
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function drawDivider(page) {
  const PAD = SPACE[8]
  const W = 400
  const f = mkFrame('➖ Divider', 0, 940, W + PAD*2, 300)
  page.appendChild(f)
  componentHeader(f, 'Divider', 'orientation · variant · label · labelAlign · flush')

  sectionLbl(f, 'VARIANTS', PAD, 90)
  let cy = 106
  for (const v of ['solid','dashed','dotted']) {
    mkText(f, v, PAD, cy, FS.xs, S.textMuted, 'Medium')
    mkRect(f, `Divider/${v}`, PAD, cy + 14, W, 1, S.borderDefault, null, RADIUS.none)
    cy += 40
  }

  sectionLbl(f, 'WITH LABEL', PAD, cy + SPACE[2])
  cy += 20
  mkRect(f, 'Divider/label/left', PAD, cy + 8, 110, 1, S.borderDefault, null, RADIUS.none)
  mkText(f, 'Section', PAD + 118, cy, FS.sm, S.textMuted)
  mkRect(f, 'Divider/label/right', PAD + 172, cy + 8, W - 172, 1, S.borderDefault, null, RADIUS.none)
  cy += 36

  sectionLbl(f, 'VERTICAL', PAD, cy + SPACE[2])
  cy += 20
  mkRect(f, 'Divider/vertical/solid',  PAD,      cy, 1, 60, S.borderDefault, null, RADIUS.none)
  mkRect(f, 'Divider/vertical/dashed', PAD + 16, cy, 1, 60, S.borderSubtle,  null, RADIUS.none)

  return f
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function drawSpinner(page) {
  const PAD = SPACE[8]
  const f = mkFrame('⏳ Spinner', 480, 940, 500, 300)
  page.appendChild(f)
  componentHeader(f, 'Spinner', 'variant · size')

  sectionLbl(f, 'VARIANTS × SIZES', PAD, 90)
  const spinSizes = { xs:16, sm:20, md:24, lg:32, xl:40 }
  let row = 0
  for (const v of ['ring','dots','pulse']) {
    mkText(f, v, PAD, 106 + row*72, FS.xs, S.textMuted, 'Medium')
    let cx = PAD + 48
    for (const [s, p] of Object.entries(spinSizes)) {
      // Track (muted ring)
      mkRect(f, `Spinner/${v}/${s}/track`, cx, 118 + row*72, p, p, null, S.borderDefault, RADIUS.full)
      // Arc (primary quarter)
      const arc = Math.ceil(p/4)
      mkRect(f, `Spinner/${v}/${s}/arc`, cx, 118 + row*72, arc, arc, S.actionPrimary, null, Math.ceil(arc/2))
      mkText(f, s, cx, 118 + row*72 + p + 4, FS.xs, S.textMuted)
      cx += p + SPACE[4]
    }
    row++
  }

  return f
}

// ─── TextField ───────────────────────────────────────────────────────────────

function drawTextField(page) {
  const PAD = SPACE[8]
  const TF_H = { sm:32, md:40, lg:48 }
  const f = mkFrame('📝 TextField', 0, 1280, 820, 340)
  page.appendChild(f)
  componentHeader(f, 'TextField', 'size · state · label · hint · error · prefix · suffix · fullWidth')

  const stateC = {
    default: S.borderDefault,
    error:   S.statusError,
    success: S.statusSuccess,
    warning: S.statusWarning,
  }

  // States
  sectionLbl(f, 'STATES', PAD, 90)
  let cx = PAD
  for (const s of ['default','error','success','warning']) {
    const w = 174
    mkText(f, 'Label', cx, 106, FS.xs, S.textSecondary, 'Medium')
    mkRect(f, `TextField/${s}`, cx, 120, w, TF_H.md, S.overlay, stateC[s], RADIUS.md)
    mkText(f, 'Placeholder…', cx + SPACE[3], 120 + (TF_H.md - FS.base)/2, FS.base, S.textMuted)
    const hintColor = s === 'default' ? S.textMuted : stateC[s]
    const hintText  = s === 'error' ? '✗ Error message' : 'Hint text'
    mkText(f, hintText, cx, 166, FS.xs, hintColor)
    cx += w + SPACE[2]
  }

  // Sizes
  sectionLbl(f, 'SIZES', PAD, 196)
  cx = PAD
  for (const [s, h] of Object.entries(TF_H)) {
    const w = 174
    mkRect(f, `TextField/default/${s}`, cx, 212, w, h, S.overlay, S.borderDefault, RADIUS.md)
    mkText(f, s, cx + SPACE[3], 212 + (h - FS.base)/2, FS.base, S.textMuted)
    cx += w + SPACE[2]
  }

  // With prefix / suffix
  sectionLbl(f, 'PREFIX · SUFFIX', PAD, 284)
  // Prefix
  mkRect(f, 'TextField/prefix', PAD, 300, 220, TF_H.md, S.overlay, S.borderDefault, RADIUS.md)
  mkText(f, '✉', PAD + SPACE[3], 300 + (TF_H.md - FS.base)/2 - 1, FS.base, S.textMuted)
  mkText(f, 'user@example.com', PAD + SPACE[6], 300 + (TF_H.md - FS.base)/2, FS.base, S.textMuted)
  // Suffix
  mkRect(f, 'TextField/suffix', PAD + 236, 300, 220, TF_H.md, S.overlay, S.borderDefault, RADIUS.md)
  mkText(f, 'Search…', PAD + 248, 300 + (TF_H.md - FS.base)/2, FS.base, S.textMuted)
  mkText(f, '⌕', PAD + 424, 300 + (TF_H.md - FS.base)/2 - 1, FS.base, S.textMuted)

  return f
}

// ─── Stack ────────────────────────────────────────────────────────────────────

function drawStack(page) {
  const PAD = SPACE[8]
  const f = mkFrame('📦 Stack', 860, 1280, 440, 300)
  page.appendChild(f)
  componentHeader(f, 'Stack', 'as · direction · gap · align · justify · wrap · full')

  // Row
  sectionLbl(f, 'ROW  gap=4 (16px)', PAD, 90)
  let cx = PAD
  for (let i = 1; i <= 4; i++) {
    mkRect(f, `Stack/row/item${i}`, cx, 106, 68, 32, S.overlay, S.borderDefault, RADIUS.md)
    mkText(f, `Item ${i}`, cx + SPACE[2], 106 + (32-FS.xs)/2, FS.xs, S.textSecondary)
    cx += 68 + SPACE[4]
  }

  // Column
  sectionLbl(f, 'COLUMN  gap=2 (8px)', PAD, 162)
  let cy = 178
  for (let i = 1; i <= 3; i++) {
    mkRect(f, `Stack/col/item${i}`, PAD, cy, 140, 28, S.overlay, S.borderDefault, RADIUS.md)
    mkText(f, `Item ${i}`, PAD + SPACE[3], cy + (28-FS.xs)/2, FS.xs, S.textSecondary)
    cy += 28 + SPACE[2]
  }

  // Justify variants
  sectionLbl(f, 'JUSTIFY OPTIONS', 240, 162)
  cy = 178
  for (const j of ['start','center','end','space-between','space-around','space-evenly']) {
    mkText(f, j, 240, cy, FS.xs, S.textMuted)
    cy += 18
  }

  return f
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function run() {
  await loadFonts()

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
  figma.closePlugin('✅ void-ui — 8 components drawn with exact token values')
}

run().catch(err => figma.closePlugin(`❌ ${err.message}`))
