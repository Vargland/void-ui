# @open-void-ui/library

Minimal, spatial, dark React component library — built on CSS custom properties, fully typed, zero config.

> **Docs**: [open-void-ui.vercel.app](https://open-void-ui.vercel.app) · **npm**: [@open-void-ui/library](https://www.npmjs.com/package/@open-void-ui/library)

## Install

```bash
npm install @open-void-ui/tokens @open-void-ui/library
```

## Setup

Import styles once in your root layout or `_app`:

```ts
import '@open-void-ui/tokens/css'     // CSS custom properties (:root)
import '@open-void-ui/library/styles' // component styles
```

## Usage

```tsx
import { Button, Badge, TextField, Avatar } from '@open-void-ui/library'

export default function App() {
  return (
    <div>
      <Button variant="primary">Get started</Button>
      <Badge tone="success">Live</Badge>
      <TextField label="Email" placeholder="you@example.com" />
      <Avatar initials="GR" status="online" />
    </div>
  )
}
```

## Components

| Component | Description |
|-----------|-------------|
| `Button` | Actions and navigation — 5 variants, 3 sizes, loading state |
| `Badge` | Status indicators — solid, subtle, outlined × 4 tones |
| `Typography` | Semantic text — 7 sizes, 4 weights, polymorphic `as` prop |
| `Avatar` | User representation — image, initials, status badge |
| `Divider` | Horizontal/vertical separator with optional label |
| `Stack` | Flex layout utility — direction, spacing, alignment |
| `Spinner` | Loading indicator — ring and dots variants |
| `TextField` | Text input with label, helper text, error state |

## Theming

All components consume `--void-*` CSS custom properties from `@open-void-ui/tokens`. Override any token globally or scope a theme to a subtree:

```css
/* Global override */
:root {
  --void-color-action-primary: #7c3aed;
  --void-radius-md: 12px;
}
```

```tsx
/* Planet theme (scoped) */
<div data-void-planet="mars">
  <Button>Mars themed</Button>
</div>
```

## Framework support

The tokens package (`@open-void-ui/tokens`) is framework-agnostic — use it in Angular, Vue, Svelte, or any web project. The library package requires React 18+.

## Requirements

- React `>=18.0.0`
- Node `>=20.0.0`

## License

MIT © [Germán Román](https://github.com/Vargland)
