// void-ui Figma Plugin — code.js (runs in Figma sandbox)

const TOKENS = {
  bgBase:           { r: 0.039, g: 0.039, b: 0.039 },
  bgSurface:        { r: 0.102, g: 0.102, b: 0.102 },
  borderDefault:    { r: 0.180, g: 0.180, b: 0.180 },
  textPrimary:      { r: 0.961, g: 0.961, b: 0.961 },
  textMuted:        { r: 0.451, g: 0.451, b: 0.451 },
  textInverse:      { r: 0.039, g: 0.039, b: 0.039 },
  actionPrimary:    { r: 0.400, g: 0.400, b: 1.000 },
  actionSecondary:  { r: 0.180, g: 0.180, b: 0.180 },
  error:            { r: 0.937, g: 0.267, b: 0.267 },
}

const FONT_MEDIUM   = { family: 'Inter', style: 'Medium' }
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }

function solid(color) {
  return [{ type: 'SOLID', color }]
}

// ─── Text node ────────────────────────────────────────────────────────────────

async function makeText(content, { fontSize = 13, font = FONT_MEDIUM, color }) {
  await figma.loadFontAsync(font)
  const node = figma.createText()
  node.fontName   = font
  node.fontSize   = fontSize
  node.characters = content
  node.fills      = solid(color)
  node.textAutoResize = 'WIDTH_AND_HEIGHT'
  return node
}

// ─── Button ───────────────────────────────────────────────────────────────────

async function makeButton({ label, variant = 'primary', size = 'md', disabled = false, loading = false }) {
  const sizes = {
    sm: { h: 28, px: 12, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, fontSize: 15, radius: 6 },
  }
  const variantStyles = {
    primary:   { fill: TOKENS.actionPrimary,   stroke: null,                textColor: TOKENS.textInverse },
    secondary: { fill: TOKENS.actionSecondary, stroke: TOKENS.borderDefault, textColor: TOKENS.textPrimary },
    ghost:     { fill: null,                   stroke: null,                textColor: TOKENS.textPrimary },
    danger:    { fill: TOKENS.error,           stroke: null,                textColor: TOKENS.textInverse },
  }

  const s  = sizes[size]
  const vs = variantStyles[variant]

  // Load font first
  await figma.loadFontAsync(FONT_MEDIUM)

  // Label text
  const displayLabel = loading ? '↻  ' + label : label
  const labelNode = figma.createText()
  labelNode.fontName   = FONT_MEDIUM
  labelNode.fontSize   = s.fontSize
  labelNode.characters = displayLabel
  labelNode.fills      = solid(vs.textColor)
  labelNode.textAutoResize = 'WIDTH_AND_HEIGHT'

  // Measure text width after setting characters
  const textW = labelNode.width
  const btnW  = textW + s.px * 2

  // Button frame — use HORIZONTAL auto-layout
  const frame = figma.createFrame()
  frame.name   = `Button/${variant}/${size}${disabled ? '/disabled' : ''}${loading ? '/loading' : ''}`
  frame.resize(btnW, s.h)
  frame.cornerRadius = s.radius
  frame.opacity      = disabled ? 0.4 : 1

  // fills
  frame.fills = vs.fill ? solid(vs.fill) : []

  // strokes
  if (vs.stroke) {
    frame.strokes      = solid(vs.stroke)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  } else {
    frame.strokes = []
  }

  // Place label centered inside frame manually
  frame.appendChild(labelNode)
  labelNode.x = s.px
  labelNode.y = Math.round((s.h - labelNode.height) / 2)

  return frame
}

// ─── Section label ────────────────────────────────────────────────────────────

async function makeSectionLabel(content) {
  await figma.loadFontAsync(FONT_SEMIBOLD)
  const node = figma.createText()
  node.fontName   = FONT_SEMIBOLD
  node.fontSize   = 11
  node.characters = content
  node.fills      = solid(TOKENS.textMuted)
  node.opacity    = 0.8
  node.textAutoResize = 'WIDTH_AND_HEIGHT'
  node.letterSpacing  = { value: 1.5, unit: 'PIXELS' }
  return node
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function buildButtonShowcase() {
  const PAD         = 48
  const GAP_X       = 12
  const GAP_Y       = 12
  const LABEL_GAP   = 20
  const SECTION_GAP = 48
  const CANVAS_W    = 900

  const page = figma.currentPage

  // Delete previous Button frame if exists
  const existing = page.children.find(n => n.name === '🔘 Button')
  if (existing) existing.remove()

  // Root frame — fixed width, manual layout
  const root = figma.createFrame()
  root.name         = '🔘 Button'
  root.fills        = solid(TOKENS.bgBase)
  root.cornerRadius = 12
  root.clipsContent = false
  root.resize(CANVAS_W, 100) // height adjusted at end

  let curY = PAD

  // ── Title ──────────────────────────────────────────────────────────────────
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
  const title = figma.createText()
  title.fontName   = { family: 'Inter', style: 'Bold' }
  title.fontSize   = 24
  title.characters = 'Button'
  title.fills      = solid(TOKENS.textPrimary)
  title.textAutoResize = 'WIDTH_AND_HEIGHT'
  root.appendChild(title)
  title.x = PAD
  title.y = curY
  curY += title.height + 8

  const subtitle = await makeText('@void-ui/library', { fontSize: 12, color: TOKENS.textMuted })
  root.appendChild(subtitle)
  subtitle.x = PAD
  subtitle.y = curY
  curY += subtitle.height + SECTION_GAP

  // ── Helper: render a section ───────────────────────────────────────────────
  async function addSection(title, buttonRows) {
    const lbl = await makeSectionLabel(title)
    root.appendChild(lbl)
    lbl.x = PAD
    lbl.y = curY
    curY += lbl.height + LABEL_GAP

    for (const row of buttonRows) {
      let curX = PAD
      let rowH = 0

      for (const props of row) {
        const btn = await makeButton(props)
        root.appendChild(btn)
        btn.x  = curX
        btn.y  = curY
        curX  += btn.width + GAP_X
        rowH   = Math.max(rowH, btn.height)
      }

      curY += rowH + GAP_Y
    }

    curY += SECTION_GAP
  }

  // ── Variants ──────────────────────────────────────────────────────────────
  await addSection('VARIANTS', [[
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ]])

  // ── Sizes ─────────────────────────────────────────────────────────────────
  await addSection('SIZES', [[
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ]])

  // ── States ────────────────────────────────────────────────────────────────
  await addSection('STATES', [[
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]])

  // ── All variants × sizes ──────────────────────────────────────────────────
  await addSection('ALL VARIANTS × SIZES',
    ['primary', 'secondary', 'ghost', 'danger'].map(v => [
      { label: v, variant: v, size: 'sm' },
      { label: v, variant: v, size: 'md' },
      { label: v, variant: v, size: 'lg' },
      { label: v, variant: v, disabled: true },
      { label: v, variant: v, loading: true },
    ])
  )

  // ── Adjust final height ───────────────────────────────────────────────────
  root.resize(CANVAS_W, curY + PAD)

  // Place and zoom
  root.x = 200
  root.y = 200
  page.appendChild(root)
  figma.viewport.scrollAndZoomIntoView([root])
  figma.notify('✅  Button showcase created!')
  figma.closePlugin()
}

buildButtonShowcase().catch(err => {
  figma.notify('❌  ' + err.message, { error: true })
  console.error(err)
  figma.closePlugin()
})
