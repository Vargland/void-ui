# @open-void-ui/library

Minimal, spatial, dark React component library — built on CSS custom properties, fully typed, zero config.

> **Storybook**: [open-void-ui on Vercel](https://void-ui-library-git-main-varglands-projects.vercel.app) · **npm**: [@open-void-ui/library](https://www.npmjs.com/package/@open-void-ui/library)

---

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
import { Button, Badge, TextField, Avatar, Checkbox } from '@open-void-ui/library'

export default function App() {
  return (
    <div>
      <Button variant="primary">Get started</Button>
      <Badge tone="success">Live</Badge>
      <TextField label="Email" placeholder="you@example.com" />
      <Avatar initials="GR" status="online" />
      <Checkbox label="Accept terms" />
    </div>
  )
}
```

---

## Components

| Component | Props highlight |
|-----------|----------------|
| `Button` | `variant` · `size` · `loading` · `iconBefore` · `iconAfter` · `fullWidth` · `as` |
| `Badge` | `variant` · `tone` · `size` · `dot` |
| `Typography` | `as` · `size` · `color` · `weight` · `leading` · `tracking` · `mono` · `truncate` |
| `Avatar` | `size` · `shape` · `status` · `src` · `initials` |
| `Divider` | `orientation` · `variant` · `label` · `labelAlign` · `flush` |
| `Stack` | `as` · `direction` · `gap` · `align` · `justify` · `wrap` · `full` |
| `Spinner` | `variant` · `size` |
| `TextField` | `size` · `state` · `label` · `hint` · `error` · `prefix` · `suffix` · `fullWidth` |
| `Checkbox` | `size` · `label` · `description` · `error` · `indeterminate` · `disabled` |

---

## Theming

All components consume `--void-*` CSS custom properties from `@open-void-ui/tokens`.

### Global token override

```css
:root {
  --void-color-action-primary: #7c3aed;
  --void-radius-md: 12px;
}
```

### Planet theme (scoped)

```tsx
<div data-void-planet="mars">
  <Button variant="primary">Mars themed</Button>
</div>
```

Available planets: `mercury` · `moon` · `mars` · `earth` · `europa` · `neptune` · `jupiter` · `saturn` · `venus` · `io` · `uranus` · `nostromo`

### Planet theme via prop

```tsx
<Button variant="primary" planet="neptune">Neptune</Button>
```

The `planet` prop wraps the component in a `[data-void-planet]` scope without touching the DOM structure.

---

## MCP server

The repo ships `@open-void-ui/mcp-server` — an MCP server that exposes this library as context for Claude and Cursor. When connected, the AI knows every prop, variant, size, token and example for every component.

See the [root README](../../README.md#mcp-server-claude--cursor) for setup instructions.

---

## Requirements

- React `>=18.0.0`
- Node `>=20.0.0`

## Framework support

`@open-void-ui/tokens` is framework-agnostic — use it in Angular, Vue, Svelte or plain CSS. The library package requires React 18+.

## License

MIT © [Germán Román](https://github.com/Vargland)
