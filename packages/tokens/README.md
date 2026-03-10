# @open-void-ui/tokens

Design tokens for [open-void-ui](https://github.com/Vargland/void-ui) — the single source of truth for colors, spacing, typography, radius, shadows and planet themes.

> **npm**: [@open-void-ui/tokens](https://www.npmjs.com/package/@open-void-ui/tokens)

---

## Install

```bash
npm install @open-void-ui/tokens
```

## Usage

### CSS custom properties (recommended)

```ts
import '@open-void-ui/tokens/css'
```

Injects all tokens as `--void-*` CSS custom properties on `:root`:

```css
:root {
  --void-color-background-base: #0a0a0a;
  --void-color-text-primary: #f5f5f5;
  --void-color-action-primary: #6666ff;
  --void-space-4: 16px;
  --void-radius-md: 4px;
  --void-transition-normal: 200ms ease;
  /* ... 38 tokens total */
}
```

### SCSS variables

```scss
@use '@open-void-ui/tokens/scss' as tokens;

.button {
  background: tokens.$color-action-primary;
  padding: tokens.$space-2 tokens.$space-4;
  border-radius: tokens.$radius-md;
}
```

### JavaScript / TypeScript

```ts
import tokens from '@open-void-ui/tokens'

console.log(tokens.colorActionPrimary) // '#6666ff'
```

---

## Planet themes

Planet themes are scoped color overrides. Each planet defines its own set of `--void-color-*` tokens, applied when a `data-void-planet` attribute is present on a parent element.

```ts
// Import the planet themes you need
import '@open-void-ui/tokens/css'           // base tokens
import '@open-void-ui/tokens/planets/mars'  // mars overrides
import '@open-void-ui/tokens/planets/earth' // earth overrides
```

```html
<div data-void-planet="mars">
  <!-- All --void-color-* tokens are overridden for this subtree -->
</div>
```

**Available planets:**

| Planet | Primary color | Character |
|--------|--------------|-----------|
| `mercury` | `#b0b0b0` | Monochrome, sharp |
| `moon` | `#9090c0` | Cool grey-blue |
| `mars` | `#e05c1a` | Warm orange-red |
| `earth` | `#3dd68c` | Deep green |
| `europa` | `#4da6ff` | Ice blue |
| `neptune` | `#6070ff` | Deep indigo |
| `jupiter` | `#d4943c` | Amber |
| `saturn` | `#d4c070` | Golden |
| `venus` | `#e8c020` | Sulfur yellow |
| `io` | `#c8e000` | Electric lime |
| `uranus` | `#40d0e0` | Cyan |
| `nostromo` | `#00ff46` | Terminal green |

---

## Token reference

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--void-color-background-base` | `#0a0a0a` | Page background |
| `--void-color-background-surface` | `#1a1a1a` | Card, panel backgrounds |
| `--void-color-background-overlay` | `#242424` | Input, hover backgrounds |
| `--void-color-text-primary` | `#f5f5f5` | Main text |
| `--void-color-text-secondary` | `#a3a3a3` | Labels, metadata |
| `--void-color-text-muted` | `#737373` | Placeholders, hints |
| `--void-color-action-primary` | `#6666ff` | Primary buttons, links |
| `--void-color-border-default` | `#2e2e2e` | Borders, dividers |
| `--void-color-border-focus` | `#6666ff` | Focus rings |
| `--void-color-status-success` | `#22c55e` | Success states |
| `--void-color-status-warning` | `#f59e0b` | Warning states |
| `--void-color-status-error` | `#ef4444` | Error states |

### Spacing

`--void-space-{1..24}` → `4px` · `8px` · `12px` · `16px` · `20px` · `24px` · `32px` · `40px` · `48px` · `64px` · `80px` · `96px`

### Typography

`--void-font-size-{xs..4xl}` → `11px` through `36px`
`--void-font-weight-{regular|medium|semibold|bold}` → `400` · `500` · `600` · `700`
`--void-font-family-sans` · `--void-font-family-mono`

### Radius

`--void-radius-{none|sm|md|lg|xl|full}` → `0` · `2px` · `4px` · `8px` · `12px` · `9999px`

### Other

`--void-shadow-{sm|md|lg|glow}` · `--void-transition-{fast|normal|slow}`

---

## Token structure

```
tokens/
├── base.json         ← primitive values (raw colors, numbers)
├── theme.json        ← semantic aliases (references to base)
└── planets/
    ├── mercury.json
    ├── moon.json
    ├── mars.json
    └── ...           ← 12 planet themes
```

Build output (`dist/`):

```
dist/
├── variables.css     ← CSS custom properties on :root
├── tokens.scss       ← SCSS variables
├── tokens.js         ← ES module
├── tokens.d.ts       ← TypeScript declarations
└── planets/
    ├── mercury.css
    ├── mars.css
    └── ...
```

Rebuild with:

```sh
cd packages/tokens && node build.js
# or from root:
npm run build:tokens
```

---

## License

MIT © [Germán Román](https://github.com/Vargland)
