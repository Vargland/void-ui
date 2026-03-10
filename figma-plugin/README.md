# void-ui Figma Plugin

Figma plugin that renders all void-ui components on the canvas with exact token values — colors, spacing, radii, typography.

Use it as a visual reference while designing, to check component states, or to preview all planet themes side by side.

---

## Setup (one time)

1. Clone or download the [void-ui repo](https://github.com/Vargland/void-ui)
2. Open Figma
3. Go to **Plugins → Development → Import plugin from manifest...**
4. Select `figma-plugin/manifest.json` from this repo
5. The plugin appears under **Plugins → Development → void-ui**

---

## Usage

1. Open any Figma file
2. Run **Plugins → Development → void-ui**
3. All component cards are drawn on the current page
4. Re-run at any time to refresh with the latest components (old cards are removed first)

---

## What gets generated

| Card | Contents |
|------|----------|
| 🔘 **Button** | Primary · Secondary · Ghost · Outlined · Danger · SM/MD/LG · Hover · Active · Disabled |
| 🏷 **Badge** | Solid · Subtle · Outlined × Default/Success/Warning/Error/Info |
| 👤 **Avatar** | XS–XL sizes · Circle/Square/Rounded · Online/Offline/Error/Warning status |
| ✍️ **Typography** | Full size scale (xs→4xl) · Color variants (primary/secondary/muted/accent) |
| ➖ **Divider** | Solid/Dashed/Dotted · With label · Vertical |
| ⏳ **Spinner** | XS–XL sizes |
| 📝 **TextField** | Default/Error/Success/Warning states · SM/MD/LG sizes |
| 📦 **Stack** | Row layout · Column layout |
| ☑️ **Checkbox** | Unchecked · Checked · Indeterminate · Error · Disabled · SM/MD/LG · With description |
| 🪐 **Planets** | Full color palette for all 12 themes: base · surface · primary · text · border + mini button preview |

---

## Planet palette card

The `🪐 Planets` card shows a row per planet with 5 color swatches and a mini button preview:

```
         base    surface  primary  text    border
Mercury  ■       ■        ■        ■       ■      [Btn]
Moon     ■       ■        ■        ■       ■      [Btn]
Mars     ■       ■        ■        ■       ■      [Btn]
Earth    ■       ■        ■        ■       ■      [Btn]
...
```

Use this as a reference when choosing a planet theme for a section or screen.

---

## Token values used

All values come directly from `packages/tokens/tokens/base.json` and the planet files in `packages/tokens/tokens/planets/`. The plugin uses the same resolved values as the CSS output — what you see in Figma is exactly what renders in the browser.

---

## Notes

- The plugin runs in the Figma sandbox (no DOM, no CSS, no React)
- Cards are always redrawn from scratch — no stale state
- Positioning: 3 columns, 40px gap
- The plugin does NOT use Figma Variables — it draws static frames with hardcoded token values

---

## Development

The plugin is a single file: `figma-plugin/code.js`.

When a new component is added to the library, add a `drawComponentName()` function to `code.js` following the existing pattern, and register it in the `drawFns` array inside `run()`.

```js
// 1. Add draw function
function drawMyComponent() {
  var c = card('🆕 MyComponent')
  cardHeader(c, 'MyComponent', 'prop1 · prop2 · prop3')
  section(c, 'VARIANTS', 'row', 8, 'CENTER', function(row) {
    // ... build nodes
  })
  return c
}

// 2. Register in run()
var drawFns = [
  // ...existing entries...
  ['🆕 MyComponent', drawMyComponent],
]
```

No manifest changes needed — `manifest.json` always points to `code.js` and never changes.
