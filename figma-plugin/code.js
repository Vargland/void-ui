// void-ui Figma Plugin — code.js

const TOKENS = {
  bgBase:          { r: 0.039, g: 0.039, b: 0.039 },
  borderDefault:   { r: 0.180, g: 0.180, b: 0.180 },
  textPrimary:     { r: 0.961, g: 0.961, b: 0.961 },
  textMuted:       { r: 0.451, g: 0.451, b: 0.451 },
  textInverse:     { r: 0.039, g: 0.039, b: 0.039 },
  actionPrimary:   { r: 0.400, g: 0.400, b: 1.000 },
  actionSecondary: { r: 0.180, g: 0.180, b: 0.180 },
  error:           { r: 0.937, g: 0.267, b: 0.267 },
}

const FONT_BOLD     = { family: 'Inter', style: 'Bold' }
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }
const FONT_MEDIUM   = { family: 'Inter', style: 'Medium' }
const FONT_REGULAR  = { family: 'Inter', style: 'Regular' }

function solid(color) {
  return [{ type: 'SOLID', color }]
}

async function loadFonts() {
  await figma.loadFontAsync(FONT_BOLD)
  await figma.loadFontAsync(FONT_SEMIBOLD)
  await figma.loadFontAsync(FONT_MEDIUM)
  await figma.loadFontAsync(FONT_REGULAR)
}

function createText(content, { font, fontSize, color, letterSpacing }) {
  const node = figma.createText()
  node.fontName        = font
  node.fontSize        = fontSize
  node.characters      = content
  node.fills           = solid(color)
  node.textAutoResize  = 'WIDTH_AND_HEIGHT'
  if (letterSpacing) node.letterSpacing = letterSpacing
  return node
}

async function makeButton({ label, variant = 'primary', size = 'md', disabled = false, loading = false }) {
  const SIZE_MAP = {
    sm: { h: 28, px: 12, fontSize: 12, radius: 4 },
    md: { h: 36, px: 16, fontSize: 13, radius: 4 },
    lg: { h: 44, px: 24, fontSize: 15, radius: 6 },
  }
  const VARIANT_MAP = {
    primary:   { fill: TOKENS.actionPrimary,   stroke: null,               textColor: TOKENS.textInverse },
    secondary: { fill: TOKENS.actionSecondary, stroke: TOKENS.borderDefault, textColor: TOKENS.textPrimary },
    ghost:     { fill: null,                   stroke: null,               textColor: TOKENS.textPrimary },
    danger:    { fill: TOKENS.error,           stroke: null,               textColor: TOKENS.textInverse },
  }

  const s  = SIZE_MAP[size]
  const vs = VARIANT_MAP[variant]

  // Text label
  const displayLabel = loading ? '↻  ' + label : label
  const labelNode = createText(displayLabel, {
    font: FONT_MEDIUM, fontSize: s.fontSize, color: vs.textColor,
  })

  const btnW = labelNode.width + s.px * 2

  // Button frame
  const frame = figma.createFrame()
  frame.name         = `Button/${variant}/${size}${disabled ? '/disabled' : ''}${loading ? '/loading' : ''}`
  frame.resize(btnW, s.h)
  frame.cornerRadius = s.radius
  frame.opacity      = disabled ? 0.4 : 1
  frame.fills        = vs.fill ? solid(vs.fill) : []
  frame.clipsContent = false

  if (vs.stroke) {
    frame.strokes      = solid(vs.stroke)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  }

  frame.appendChild(labelNode)
  labelNode.x = s.px
  labelNode.y = Math.round((s.h - labelNode.height) / 2)

  return frame
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function buildButtonShowcase() {
  await loadFonts()

  const PAD         = 48
  const GAP_X       = 12
  const GAP_Y       = 16
  const SECTION_GAP = 44
  const CANVAS_W    = 920
  const page        = figma.currentPage

  // Remove previous
  const prev = page.children.find(n => n.name === '🔘 Button')
  if (prev) prev.remove()

  // Collect all nodes, position them, then put in root at the end
  const nodes = []   // { node, x, y }
  let y = PAD

  function place(node, x) {
    nodes.push({ node, x, y })
    return node
  }

  // ── Title ────────────────────────────────────────────────────────────────

  const title = createText('Button', { font: FONT_BOLD, fontSize: 24, color: TOKENS.textPrimary })
  place(title, PAD)
  y += title.height + 8

  const sub = createText('@void-ui/library', { font: FONT_REGULAR, fontSize: 12, color: TOKENS.textMuted })
  place(sub, PAD)
  y += sub.height + SECTION_GAP

  // ── Section helper ────────────────────────────────────────────────────────

  async function addSection(title, rows) {
    const lbl = createText(title, {
      font: FONT_SEMIBOLD, fontSize: 11, color: TOKENS.textMuted,
      letterSpacing: { value: 1.5, unit: 'PIXELS' },
    })
    place(lbl, PAD)
    y += lbl.height + 16

    for (const row of rows) {
      let x   = PAD
      let rowH = 0
      for (const props of row) {
        const btn = await makeButton(props)
        nodes.push({ node: btn, x, y })
        x    += btn.width + GAP_X
        rowH  = Math.max(rowH, btn.height)
      }
      y += rowH + GAP_Y
    }

    y += SECTION_GAP
  }

  // ── Sections ──────────────────────────────────────────────────────────────

  await addSection('VARIANTS', [[
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ]])

  await addSection('SIZES', [[
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ]])

  await addSection('STATES', [[
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]])

  await addSection('ALL VARIANTS × SIZES',
    ['primary', 'secondary', 'ghost', 'danger'].map(v => [
      { label: v, variant: v, size: 'sm' },
      { label: v, variant: v, size: 'md' },
      { label: v, variant: v, size: 'lg' },
      { label: v, variant: v, disabled: true },
      { label: v, variant: v, loading: true },
    ])
  )

  // ── Build root frame and place everything ─────────────────────────────────

  const CANVAS_H = y + PAD
  const root = figma.createFrame()
  root.name         = '🔘 Button'
  root.resize(CANVAS_W, CANVAS_H)
  root.fills        = solid(TOKENS.bgBase)
  root.cornerRadius = 12
  root.clipsContent = true
  root.x = 300
  root.y = 300

  for (const { node, x, y: ny } of nodes) {
    root.appendChild(node)
    node.x = x
    node.y = ny
  }

  page.appendChild(root)
  figma.viewport.scrollAndZoomIntoView([root])
  figma.notify('✅  Button showcase ready!')
  figma.closePlugin()
}

buildButtonShowcase().catch(err => {
  figma.notify('❌  ' + err.message, { error: true })
  console.error(err)
  figma.closePlugin()
})
