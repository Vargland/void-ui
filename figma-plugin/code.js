// void-ui Figma Plugin — code.js

const T = {
  bgBase:        { r: 0.039, g: 0.039, b: 0.039 },
  textPrimary:   { r: 0.961, g: 0.961, b: 0.961 },
  textMuted:     { r: 0.451, g: 0.451, b: 0.451 },
  textInverse:   { r: 0.039, g: 0.039, b: 0.039 },
  borderDefault: { r: 0.180, g: 0.180, b: 0.180 },
  primary:       { r: 0.400, g: 0.400, b: 1.000 },
  secondary:     { r: 0.180, g: 0.180, b: 0.180 },
  danger:        { r: 0.937, g: 0.267, b: 0.267 },
}

const FONT_BOLD     = { family: 'Inter', style: 'Bold' }
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }
const FONT_MEDIUM   = { family: 'Inter', style: 'Medium' }
const FONT_REGULAR  = { family: 'Inter', style: 'Regular' }

function solid(c) { return [{ type: 'SOLID', color: c }] }

// Approximate char width for Inter Medium at given fontSize
function approxWidth(text, fontSize) {
  return Math.ceil(text.length * fontSize * 0.52)
}

// Create a text node and append it to parent BEFORE setting characters
// (Figma requires the node to be in the document before assigning characters)
function makeText(parent, { fontName, fontSize, fills, characters, textAutoResize = 'WIDTH_AND_HEIGHT', letterSpacing, opacity }) {
  const node = figma.createText()
  parent.appendChild(node)           // ← must be in doc first
  node.fontName       = fontName
  node.fontSize       = fontSize
  node.fills          = fills
  node.textAutoResize = textAutoResize
  if (letterSpacing !== undefined) node.letterSpacing = letterSpacing
  if (opacity !== undefined)       node.opacity = opacity
  node.characters     = characters   // ← set last, after font & parent
  return node
}

function makeButton(root, { label, variant = 'primary', size = 'md', disabled = false, loading = false }, x, y) {
  const S = {
    sm: { h: 28, px: 12, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, fontSize: 15, radius: 6 },
  }[size]

  const STYLE = {
    primary:   { bg: T.primary,   text: T.textInverse, border: null },
    secondary: { bg: T.secondary, text: T.textPrimary, border: T.borderDefault },
    ghost:     { bg: null,        text: T.textPrimary, border: null },
    danger:    { bg: T.danger,    text: T.textInverse, border: null },
  }[variant]

  const displayLabel = loading ? label + '  ↻' : label
  const textW = approxWidth(displayLabel, S.fontSize)
  const btnW  = textW + S.px * 2

  // Frame — append to root first so child nodes are in the document
  const frame = figma.createFrame()
  frame.name         = `Button/${variant}/${size}${disabled ? '/disabled' : ''}${loading ? '/loading' : ''}`
  frame.x            = x
  frame.y            = y
  root.appendChild(frame)            // ← in doc before resize/style
  frame.resize(btnW, S.h)
  frame.cornerRadius = S.radius
  frame.opacity      = disabled ? 0.4 : 1
  frame.fills        = STYLE.bg ? solid(STYLE.bg) : []
  frame.clipsContent = false
  if (STYLE.border) {
    frame.strokes      = solid(STYLE.border)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  }

  // Label — append to frame (already in doc) before setting characters
  const labelNode = makeText(frame, {
    fontName:  FONT_MEDIUM,
    fontSize:  S.fontSize,
    fills:     solid(STYLE.text),
    characters: displayLabel,
  })
  labelNode.x = S.px
  labelNode.y = Math.round((S.h - S.fontSize * 1.4) / 2)

  return btnW
}

async function main() {
  await figma.loadFontAsync(FONT_BOLD)
  await figma.loadFontAsync(FONT_SEMIBOLD)
  await figma.loadFontAsync(FONT_MEDIUM)
  await figma.loadFontAsync(FONT_REGULAR)

  const PAD         = 48
  const GAP_X       = 8
  const GAP_Y       = 14
  const SECTION_GAP = 36
  const LABEL_MB    = 14
  const CANVAS_W    = 900
  const page        = figma.currentPage

  // Remove previous
  const prev = page.children.find(n => n.name === '🔘 Button')
  if (prev) prev.remove()

  // Root frame — append to page immediately
  const root = figma.createFrame()
  root.name         = '🔘 Button'
  root.x            = 300
  root.y            = 300
  page.appendChild(root)             // ← in doc before anything else
  root.fills        = solid(T.bgBase)
  root.cornerRadius = 12
  root.clipsContent = false
  root.resize(CANVAS_W, 100)        // temporary height, resized at end

  let y = PAD

  // Title
  const title = makeText(root, {
    fontName:   FONT_BOLD,
    fontSize:   22,
    fills:      solid(T.textPrimary),
    characters: 'Button',
  })
  title.x = PAD; title.y = y
  y += 28 + 6

  // Subtitle
  const sub = makeText(root, {
    fontName:   FONT_REGULAR,
    fontSize:   12,
    fills:      solid(T.textMuted),
    characters: '@void-ui/library',
  })
  sub.x = PAD; sub.y = y
  y += 18 + SECTION_GAP

  function addLabel(text) {
    const lbl = makeText(root, {
      fontName:      FONT_SEMIBOLD,
      fontSize:      10,
      fills:         solid(T.textMuted),
      characters:    text,
      letterSpacing: { value: 1.5, unit: 'PIXELS' },
      opacity:       0.7,
    })
    lbl.x = PAD; lbl.y = y
    y += 14 + LABEL_MB
  }

  function addRow(buttons) {
    let x = PAD
    let maxH = 0
    const H = { sm: 28, md: 36, lg: 44 }
    for (const btn of buttons) {
      const h = H[btn.size || 'md']
      const w = makeButton(root, btn, x, y)
      x += w + GAP_X
      maxH = Math.max(maxH, h)
    }
    y += maxH + GAP_Y
  }

  // ── VARIANTS ────────────────────────────────────────────────────────────────
  addLabel('VARIANTS')
  addRow([
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ])
  y += SECTION_GAP

  // ── SIZES ───────────────────────────────────────────────────────────────────
  addLabel('SIZES')
  addRow([
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ])
  y += SECTION_GAP

  // ── STATES ──────────────────────────────────────────────────────────────────
  addLabel('STATES')
  addRow([
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ])
  y += SECTION_GAP

  // ── ALL VARIANTS × SIZES ────────────────────────────────────────────────────
  addLabel('ALL VARIANTS × SIZES')
  for (const v of ['primary', 'secondary', 'ghost', 'danger']) {
    addRow([
      { label: `${v} sm`,  variant: v, size: 'sm' },
      { label: `${v} md`,  variant: v, size: 'md' },
      { label: `${v} lg`,  variant: v, size: 'lg' },
      { label: 'disabled', variant: v, disabled: true },
      { label: 'loading',  variant: v, loading: true },
    ])
  }
  y += PAD

  // Resize root to actual content height
  root.resize(CANVAS_W, y)
  root.clipsContent = true

  figma.viewport.scrollAndZoomIntoView([root])
  figma.notify('✅  Button showcase ready!')
  figma.closePlugin()
}

main().catch(err => {
  figma.notify('❌  ' + err.message, { error: true })
  console.error(err)
  figma.closePlugin()
})
