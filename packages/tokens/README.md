# @open-void-ui/tokens

Design tokens for [open-void-ui](https://github.com/Vargland/void-ui) — the single source of truth for colors, spacing, typography, radius, and planet themes.

## Install

```bash
npm install @open-void-ui/tokens
```

## Usage

### CSS custom properties (recommended)

```css
@import '@open-void-ui/tokens/css';
```

This injects all tokens as `--void-*` CSS custom properties on `:root`:

```css
:root {
  --void-color-background-base: #0a0a0f;
  --void-color-text-primary: #e8e8f0;
  --void-color-action-primary: #6366f1;
  --void-space-4: 16px;
  --void-radius-md: 8px;
  /* ... */
}
```

### SCSS variables

```scss
@use '@open-void-ui/tokens/scss' as tokens;

.button {
  background: tokens.$color-action-primary;
  padding: tokens.$space-2 tokens.$space-4;
}
```

### JavaScript / TypeScript

```ts
import tokens from '@open-void-ui/tokens'

console.log(tokens.colorActionPrimary) // '#6366f1'
```

## Planet themes

Planet themes are scoped color overrides. Apply a `data-void-planet` attribute to any element to activate a theme for that subtree.

```css
@import '@open-void-ui/tokens/planets/mars';
@import '@open-void-ui/tokens/planets/neptune';
```

```html
<div data-void-planet="mars">
  <!-- All --void-color-* tokens are overridden here -->
</div>
```

Available planets: `mars`, `neptune`, `venus`, `jupiter`, `saturn`.

## Token structure

```
tokens/
├── base.json    ← primitive values (raw colors, numbers)
└── theme.json   ← semantic aliases (references to base)
```

Build output (`dist/`):
- `variables.css` — CSS custom properties on `:root`
- `tokens.scss` — SCSS variables
- `tokens.js` — ES module
- `tokens.d.ts` — TypeScript declarations
- `planets/*.css` — per-planet theme overrides

## License

MIT © [Germán Román](https://github.com/Vargland)
