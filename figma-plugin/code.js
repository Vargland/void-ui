// void-ui Figma Plugin — code.js
// Replicates the AllVariants story from Storybook exactly

const T = {
  bgBase:          { r: 0.039, g: 0.039, b: 0.039 }, // #0a0a0a
  bgSurface:       { r: 0.102, g: 0.102, b: 0.102 }, // #1a1a1a
  borderDefault:   { r: 0.180, g: 0.180, b: 0.180 }, // #2e2e2e
  borderStrong:    { r: 0.322, g: 0.322, b: 0.322 }, // #525252
  textPrimary:     { r: 0.961, g: 0.961, b: 0.961 }, // #f5f5f5
  textMuted:       { r: 0.451, g: 0.451, b: 0.451 }, // #737373
  textInverse:     { r: 0.039, g: 0.039, b: 0.039 }, // #0a0a0a
  // primary: #6666ff
  primary:         { r: 0.400, g: 0.400, b: 1.000 },
  primaryHover:    { r: 0.533, g: 0.533, b: 1.000 }, // #8888ff
  // secondary: #2e2e2e
  secondary:       { r: 0.180, g: 0.180, b: 0.180 },
  // danger: #ef4444
  danger:          { r: 0.937, g: 0.267, b: 0.267 },
  dangerDark:      { r: 0.420, g: 0.082, b: 0.082 }, // dark red for loading bg
}

const FONT_BOLD     = { family: 'Inter', style: 'Bold' }
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }
const FONT_MEDIUM   = { family: 'Inter', style: 'Medium' }
const FONT_REGULAR  = { family: 'Inter', style: 'Regular' }

function solid(color, opacity = 1) {
  return [{ type: 'SOLID', color, opacity }]
}

// ─── Button builder ───────────────────────────────────────────────────────────

function makeButton({ label, variant = 'primary', size = 'md', disabled = false, loading = false }) {
  const SIZE_MAP = {
    sm: { h: 28, px: 12, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, fontSize: 15, radius: 6 },
  }

  const s = SIZE_MAP[size]

  // ── Colors per variant ──────────────────────────────────────────────────────
  let bgColor, bgOpacity = 1, textColor, hasBorder = false, borderColor

  if (variant === 'primary') {
    bgColor    = T.primary
    textColor  = T.textInverse
    if (loading) bgColor = T.primaryHover
  } else if (variant === 'secondary') {
    bgColor    = T.secondary
    textColor  = T.textPrimary
    hasBorder  = true
    borderColor = T.borderDefault
  } else if (variant === 'ghost') {
    bgColor    = null
    textColor  = T.textPrimary
  } else if (variant === 'danger') {
    bgColor    = T.danger
    textColor  = T.textInverse
    if (loading) bgColor = T.dangerDark
  }

  const opacity = disabled ? 0.4 : 1

  // ── Label text ──────────────────────────────────────────────────────────────
  const displayLabel = loading ? label + '  ↻' : label
  const labelNode = figma.createText()
  labelNode.fontName       = FONT_MEDIUM
  labelNode.fontSize       = s.fontSize
  labelNode.characters     = displayLabel
  labelNode.fills          = solid(textColor)
  labelNode.textAutoResize = 'WIDTH_AND_HEIGHT'

  // ── Frame ───────────────────────────────────────────────────────────────────
  const btnW = labelNode.width + s.px * 2
  const frame = figma.createFrame()
  frame.name         = `Button/${variant}/${size}${disabled ? '/disabled' : ''}${loading ? '/loading' : ''}`
  frame.resize(btnW, s.h)
  frame.cornerRadius = s.radius
  frame.opacity      = opacity
  frame.fills        = bgColor ? solid(bgColor) : []
  frame.clipsContent = false

  if (hasBorder) {
    frame.strokes      = solid(borderColor)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  } else {
    frame.strokes = []
  }

  frame.appendChild(labelNode)
  labelNode.x = s.px
  labelNode.y = Math.round((s.h - labelNode.height) / 2)

  return frame
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Load all fonts upfront
  await figma.loadFontAsync(FONT_BOLD)
  await figma.loadFontAsync(FONT_SEMIBOLD)
  await figma.loadFontAsync(FONT_MEDIUM)
  await figma.loadFontAsync(FONT_REGULAR)

  const PAD         = 48
  const GAP_X       = 8
  const GAP_Y       = 16
  const SECTION_GAP = 40
  const LABEL_MB    = 16
  const CANVAS_W    = 900
  const page        = figma.currentPage

  // Remove previous
  const prev = page.children.find(n => n.name === '🔘 Button')
  if (prev) prev.remove()

  const nodes = []   // { node, x, y }
  let y = PAD

  function placeNode(node, x) {
    nodes.push({ node, x, y })
  }

  // ── Title ──────────────────────────────────────────────────────────────────
  const title = figma.createText()
  title.fontName = FONT_BOLD; title.fontSize = 22
  title.characters = 'Button'; title.fills = solid(T.textPrimary)
  title.textAutoResize = 'WIDTH_AND_HEIGHT'
  placeNode(title, PAD); y += title.height + 6

  const sub = figma.createText()
  sub.fontName = FONT_REGULAR; sub.fontSize = 12
  sub.characters = '@void-ui/library'; sub.fills = solid(T.textMuted)
  sub.textAutoResize = 'WIDTH_AND_HEIGHT'
  placeNode(sub, PAD); y += sub.height + SECTION_GAP

  // ── Section helper ────────────────────────────────────────────────────────
  function sectionLabel(text) {
    const lbl = figma.createText()
    lbl.fontName = FONT_SEMIBOLD; lbl.fontSize = 10
    lbl.characters = text; lbl.fills = solid(T.textMuted)
    lbl.opacity = 0.7; lbl.textAutoResize = 'WIDTH_AND_HEIGHT'
    lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' }
    return lbl
  }

  function addSection(title, rows) {
    const lbl = sectionLabel(title)
    placeNode(lbl, PAD); y += lbl.height + LABEL_MB

    for (const row of rows) {
      let x = PAD
      let maxH = 0
      for (const props of row) {
        const btn = makeButton(props)
        nodes.push({ node: btn, x, y })
        x += btn.width + GAP_X
        maxH = Math.max(maxH, btn.height)
      }
      y += maxH + GAP_Y
    }
    y += SECTION_GAP
  }

  // ── Variants ─────────────────────────────────────────────────────────────
  addSection('VARIANTS', [[
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ]])

  // ── Sizes ─────────────────────────────────────────────────────────────────
  addSection('SIZES', [[
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ]])

  // ── States ────────────────────────────────────────────────────────────────
  addSection('STATES', [[
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]])

  // ── All variants × sizes (matches Storybook AllVariants story exactly) ────
  addSection('ALL VARIANTS × SIZES',
    ['primary', 'secondary', 'ghost', 'danger'].map(v => [
      { label: `${v} sm`, variant: v, size: 'sm' },
      { label: `${v} md`, variant: v, size: 'md' },
      { label: `${v} lg`, variant: v, size: 'lg' },
      { label: 'disabled', variant: v, disabled: true },
      { label: 'loading',  variant: v, loading: true },
    ])
  )

  // ── Build root frame ───────────────────────────────────────────────────────
  const CANVAS_H = y + PAD
  const root = figma.createFrame()
  root.name = '🔘 Button'
  root.resize(CANVAS_W, CANVAS_H)
  root.fills = solid(T.bgBase)
  root.cornerRadius = 12
  root.clipsContent = true
  root.x = 300; root.y = 300

  for (const { node, x, y: ny } of nodes) {
    root.appendChild(node)
    node.x = x; node.y = ny
  }

  page.appendChild(root)
  figma.viewport.scrollAndZoomIntoView([root])
  figma.notify('✅  Button showcase — matches Storybook!')
  figma.closePlugin()
}

main().catch(err => {
  figma.notify('❌  ' + err.message, { error: true })
  console.error(err)
  figma.closePlugin()
})
