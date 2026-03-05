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

function solid(c, o = 1) { return [{ type: 'SOLID', color: c, opacity: o }] }

// ─── makeButton ───────────────────────────────────────────────────────────────
// Strategy: append text to a temp page frame first so Figma calculates width,
// then move to root frame with correct position.

function makeButton(tempPage, { label, variant = 'primary', size = 'md', disabled = false, loading = false }) {
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

  // 1. Create text, append to temp container so Figma measures it
  const labelNode = figma.createText()
  labelNode.fontName       = FONT_MEDIUM
  labelNode.fontSize       = S.fontSize
  labelNode.characters     = loading ? label + '  ↻' : label
  labelNode.fills          = solid(STYLE.text)
  labelNode.textAutoResize = 'WIDTH_AND_HEIGHT'
  tempPage.appendChild(labelNode) // ← needed for width measurement

  const textW = labelNode.width
  const btnW  = Math.ceil(textW + S.px * 2)

  // 2. Create button frame
  const frame = figma.createFrame()
  frame.name         = `Button/${variant}/${size}${disabled ? '/disabled' : ''}${loading ? '/loading' : ''}`
  frame.resize(btnW, S.h)
  frame.cornerRadius = S.radius
  frame.opacity      = disabled ? 0.4 : 1
  frame.fills        = STYLE.bg ? solid(STYLE.bg) : []
  frame.clipsContent = false

  if (STYLE.border) {
    frame.strokes      = solid(STYLE.border)
    frame.strokeWeight = 1
    frame.strokeAlign  = 'INSIDE'
  } else {
    frame.strokes = []
  }

  // 3. Move label into frame with correct position
  frame.appendChild(labelNode)
  labelNode.x = S.px
  labelNode.y = Math.round((S.h - labelNode.height) / 2)

  return frame
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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

  // Remove previous showcase
  const prev = page.children.find(n => n.name === '🔘 Button')
  if (prev) prev.remove()

  // Root frame — final container
  const root = figma.createFrame()
  root.name         = '🔘 Button'
  root.fills        = solid(T.bgBase)
  root.cornerRadius = 12
  root.clipsContent = false
  root.resize(CANVAS_W, 2000) // will resize at end
  root.x = 300; root.y = 300
  page.appendChild(root)

  let y = PAD

  // ── Title ────────────────────────────────────────────────────────────────

  const title = figma.createText()
  title.fontName = FONT_BOLD; title.fontSize = 22
  title.characters = 'Button'; title.fills = solid(T.textPrimary)
  title.textAutoResize = 'WIDTH_AND_HEIGHT'
  root.appendChild(title); title.x = PAD; title.y = y
  y += title.height + 6

  const sub = figma.createText()
  sub.fontName = FONT_REGULAR; sub.fontSize = 12
  sub.characters = '@void-ui/library'; sub.fills = solid(T.textMuted)
  sub.textAutoResize = 'WIDTH_AND_HEIGHT'
  root.appendChild(sub); sub.x = PAD; sub.y = y
  y += sub.height + SECTION_GAP

  // ── Section helper ────────────────────────────────────────────────────────

  function addSection(title, rows) {
    const lbl = figma.createText()
    lbl.fontName = FONT_SEMIBOLD; lbl.fontSize = 10
    lbl.characters = title; lbl.fills = solid(T.textMuted)
    lbl.opacity = 0.7; lbl.textAutoResize = 'WIDTH_AND_HEIGHT'
    lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' }
    root.appendChild(lbl); lbl.x = PAD; lbl.y = y
    y += lbl.height + LABEL_MB

    for (const row of rows) {
      let x = PAD
      let maxH = 0
      for (const props of row) {
        const btn = makeButton(root, props)
        root.appendChild(btn)
        btn.x = x; btn.y = y
        x += btn.width + GAP_X
        maxH = Math.max(maxH, btn.height)
      }
      y += maxH + GAP_Y
    }
    y += SECTION_GAP
  }

  // ── Sections ─────────────────────────────────────────────────────────────

  addSection('VARIANTS', [[
    { label: 'Primary',   variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Ghost',     variant: 'ghost' },
    { label: 'Danger',    variant: 'danger' },
  ]])

  addSection('SIZES', [[
    { label: 'Small',  variant: 'primary', size: 'sm' },
    { label: 'Medium', variant: 'primary', size: 'md' },
    { label: 'Large',  variant: 'primary', size: 'lg' },
  ]])

  addSection('STATES', [[
    { label: 'Default',  variant: 'primary' },
    { label: 'Disabled', variant: 'primary',   disabled: true },
    { label: 'Loading',  variant: 'primary',   loading: true },
    { label: 'Default',  variant: 'secondary' },
    { label: 'Disabled', variant: 'secondary', disabled: true },
  ]])

  addSection('ALL VARIANTS × SIZES',
    ['primary', 'secondary', 'ghost', 'danger'].map(v => [
      { label: `${v} sm`,  variant: v, size: 'sm' },
      { label: `${v} md`,  variant: v, size: 'md' },
      { label: `${v} lg`,  variant: v, size: 'lg' },
      { label: 'disabled', variant: v, disabled: true },
      { label: 'loading',  variant: v, loading: true },
    ])
  )

  // ── Resize root to actual content height ───────────────────────────────────
  root.resize(CANVAS_W, y + PAD)
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
