// void-ui Figma Plugin — code.js (runs in Figma sandbox)

const TOKENS = {
  // ─── Colors ────────────────────────────────────────────────────────────────
  bgBase:           { r: 0.039, g: 0.039, b: 0.039 },
  bgSurface:        { r: 0.102, g: 0.102, b: 0.102 },
  bgOverlay:        { r: 0.141, g: 0.141, b: 0.141 },
  borderDefault:    { r: 0.180, g: 0.180, b: 0.180 },
  borderFocus:      { r: 0.400, g: 0.400, b: 1.000 },
  textPrimary:      { r: 0.961, g: 0.961, b: 0.961 },
  textMuted:        { r: 0.451, g: 0.451, b: 0.451 },
  textDisabled:     { r: 0.322, g: 0.322, b: 0.322 },
  textInverse:      { r: 0.039, g: 0.039, b: 0.039 },
  actionPrimary:    { r: 0.400, g: 0.400, b: 1.000 },
  actionPrimaryHov: { r: 0.533, g: 0.533, b: 1.000 },
  actionSecondary:  { r: 0.180, g: 0.180, b: 0.180 },
  actionSecHov:     { r: 0.239, g: 0.239, b: 0.239 },
  error:            { r: 0.937, g: 0.267, b: 0.267 },
}

const FONT_REGULAR  = { family: 'Inter', style: 'Regular' }
const FONT_MEDIUM   = { family: 'Inter', style: 'Medium' }
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function solid(color, opacity = 1) {
  return [{ type: 'SOLID', color, opacity }]
}

async function makeText(content, { fontSize = 13, font = FONT_MEDIUM, color, opacity = 1 }) {
  await figma.loadFontAsync(font)
  const node = figma.createText()
  node.fontName   = font
  node.fontSize   = fontSize
  node.characters = content
  node.fills      = solid(color, opacity)
  node.opacity    = opacity
  return node
}

async function makeButton({ label, variant = 'primary', size = 'md', disabled = false, loading = false }) {
  const sizes = {
    sm: { h: 28, px: 12, py: 0, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, py: 0, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, py: 0, fontSize: 15, radius: 6 },
  }

  const variantStyles = {
    primary:   { fill: TOKENS.actionPrimary,   stroke: null,               textColor: TOKENS.textInverse  },
    secondary: { fill: TOKENS.actionSecondary, stroke: TOKENS.borderDefault, textColor: TOKENS.textPrimary },
    ghost:     { fill: null,                   stroke: null,               textColor: TOKENS.textPrimary  },
    danger:    { fill: TOKENS.error,            stroke: null,               textColor: TOKENS.textInverse  },
  }

  const s  = sizes[size]
  const vs = variantStyles[variant]
  const op = disabled ? 0.4 : 1

  // Frame (button container)
  const frame = figma.createFrame()
  frame.name              = `Button / ${variant} / ${size}${disabled ? ' / disabled' : ''}${loading ? ' / loading' : ''}`
  frame.layoutMode        = 'HORIZONTAL'
  frame.primaryAxisAlignItems   = 'CENTER'
  frame.counterAxisAlignItems   = 'CENTER'
  frame.paddingLeft       = s.px
  frame.paddingRight      = s.px
  frame.paddingTop        = s.py
  frame.paddingBottom     = s.py
  frame.itemSpacing       = 6
  frame.cornerRadius      = s.radius
  frame.resize(1, s.h)
  frame.primaryAxisSizingMode   = 'AUTO'
  frame.counterAxisSizingMode   = 'FIXED'
  frame.opacity           = op

  // Fill
  if (vs.fill) {
    frame.fills = solid(vs.fill)
  } else {
    frame.fills = []
  }

  // Stroke
  if (vs.stroke) {
    frame.strokes      = solid(vs.stroke)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  } else {
    frame.strokes = []
  }

  // Label
  const displayLabel = loading ? '⟳  ' + label : label
  const labelNode = await makeText(displayLabel, {
    fontSize:  s.fontSize,
    font:      FONT_MEDIUM,
    color:     vs.textColor,
  })
  frame.appendChild(labelNode)

  return frame
}

async function makeSectionLabel(text) {
  const node = await makeText(text, {
    fontSize: 11,
    font:     FONT_SEMIBOLD,
    color:    TOKENS.textMuted,
  })
  node.opacity = 0.7
  return node
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function buildButtonShowcase() {
  const PAD        = 48
  const GAP_X      = 16
  const GAP_Y      = 16
  const SECTION_GAP = 40

  // Root frame
  const root = figma.createFrame()
  root.name        = '🔘 Button'
  root.fills       = solid(TOKENS.bgBase)
  root.cornerRadius = 12
  root.layoutMode  = 'VERTICAL'
  root.primaryAxisSizingMode   = 'AUTO'
  root.counterAxisSizingMode   = 'AUTO'
  root.paddingTop    = PAD
  root.paddingBottom = PAD
  root.paddingLeft   = PAD
  root.paddingRight  = PAD
  root.itemSpacing   = 0

  // Helper: add a row of nodes with a section label
  async function addSection(title, rows) {
    // Section label
    const label = await makeSectionLabel(title)
    root.appendChild(label)

    const spacer1 = figma.createFrame()
    spacer1.resize(1, 16)
    spacer1.fills = []
    spacer1.layoutMode = 'NONE'
    root.appendChild(spacer1)

    for (const row of rows) {
      const rowFrame = figma.createFrame()
      rowFrame.name      = 'row'
      rowFrame.layoutMode = 'HORIZONTAL'
      rowFrame.primaryAxisSizingMode = 'AUTO'
      rowFrame.counterAxisSizingMode = 'AUTO'
      rowFrame.counterAxisAlignItems = 'CENTER'
      rowFrame.itemSpacing = GAP_X
      rowFrame.fills = []

      for (const btnProps of row) {
        const btn = await makeButton(btnProps)
        rowFrame.appendChild(btn)
      }
      root.appendChild(rowFrame)

      const rowSpacer = figma.createFrame()
      rowSpacer.resize(1, GAP_Y)
      rowSpacer.fills = []
      root.appendChild(rowSpacer)
    }

    const sectionSpacer = figma.createFrame()
    sectionSpacer.resize(1, SECTION_GAP)
    sectionSpacer.fills = []
    root.appendChild(sectionSpacer)
  }

  // ── Variants ────────────────────────────────────────────────────────────────
  await addSection('VARIANTS', [[
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ]])

  // ── Sizes ────────────────────────────────────────────────────────────────────
  await addSection('SIZES', [[
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ]])

  // ── States ───────────────────────────────────────────────────────────────────
  await addSection('STATES', [[
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]])

  // ── All variants × sizes ─────────────────────────────────────────────────────
  await addSection('ALL VARIANTS × SIZES', ['primary', 'secondary', 'ghost', 'danger'].map(v => [
    { label: v, variant: v, size: 'sm' },
    { label: v, variant: v, size: 'md' },
    { label: v, variant: v, size: 'lg' },
    { label: v, variant: v, disabled: true },
    { label: v, variant: v, loading: true },
  ]))

  // Place on canvas
  const page = figma.currentPage
  root.x = 200
  root.y = 200
  page.appendChild(root)

  figma.viewport.scrollAndZoomIntoView([root])
  figma.notify('✅ Button component created!')
  figma.closePlugin()
}

buildButtonShowcase().catch(err => {
  figma.notify('❌ Error: ' + err.message, { error: true })
  figma.closePlugin()
})
