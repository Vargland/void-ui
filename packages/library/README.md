# @open-void-ui/library

[![npm version](https://img.shields.io/npm/v/@open-void-ui/library?style=flat-square&color=6666ff)](https://www.npmjs.com/package/@open-void-ui/library)
[![npm downloads](https://img.shields.io/npm/dm/@open-void-ui/library?style=flat-square)](https://www.npmjs.com/package/@open-void-ui/library)
[![license](https://img.shields.io/npm/l/@open-void-ui/library?style=flat-square)](https://github.com/Vargland/void-ui/blob/main/LICENSE)

Minimal, spatial, dark React component library.
CSS custom properties · 12 planet themes · Fully typed · Zero config.

**[Storybook →](https://void-ui-library-git-main-varglands-projects.vercel.app)**  &nbsp;·&nbsp;  **[GitHub →](https://github.com/Vargland/void-ui)**

---

## Install

```bash
npm install @open-void-ui/tokens @open-void-ui/library
```

> Both packages are required. `@open-void-ui/tokens` provides the CSS custom properties that the components depend on.

---

## Setup

Import styles **once** in your root layout or `_app`:

```ts
import '@open-void-ui/tokens/css'     // injects --void-* custom properties on :root
import '@open-void-ui/library/styles' // component styles
```

**Next.js (App Router):**
```tsx
// app/layout.tsx
import '@open-void-ui/tokens/css'
import '@open-void-ui/library/styles'

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
```

**Vite / CRA:**
```ts
// main.tsx or index.tsx
import '@open-void-ui/tokens/css'
import '@open-void-ui/library/styles'
```

---

## Usage

```tsx
import { Button, Badge, TextField, Avatar, Checkbox, Stack } from '@open-void-ui/library'

export default function App() {
  return (
    <Stack direction="column" gap={4}>
      <Button variant="primary" size="md">Get started</Button>
      <Button variant="secondary" loading>Loading…</Button>

      <Badge tone="success" variant="subtle">Live</Badge>
      <Badge tone="error" variant="solid">Critical</Badge>

      <TextField label="Email" placeholder="you@example.com" hint="We'll never share your email" />
      <TextField label="Password" error="Password is required" />

      <Avatar initials="GR" size="md" status="online" />

      <Checkbox label="Accept terms and conditions" />
      <Checkbox label="Subscribe to updates" description="Weekly digest, no spam." />
    </Stack>
  )
}
```

---

## Components

| Component | Description | Key props |
|-----------|-------------|-----------|
| `Button` | Actions and navigation | `variant` · `size` · `loading` · `iconBefore` · `iconAfter` · `fullWidth` · `as` |
| `Badge` | Status and label indicators | `variant` · `tone` · `size` · `dot` |
| `Typography` | Semantic text rendering | `as` · `size` · `color` · `weight` · `leading` · `tracking` · `mono` |
| `Avatar` | User representation | `size` · `shape` · `status` · `src` · `initials` |
| `Divider` | Visual separator | `orientation` · `variant` · `label` · `labelAlign` |
| `Stack` | Flex layout utility | `direction` · `gap` · `align` · `justify` · `wrap` · `as` |
| `Spinner` | Loading indicator | `size` · `variant` |
| `TextField` | Text input | `size` · `state` · `label` · `hint` · `error` · `prefix` · `suffix` |
| `Checkbox` | Boolean input | `size` · `label` · `description` · `error` · `indeterminate` |

### Button

```tsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  {/* default */}
<Button size="lg">Large</Button>

// States
<Button loading>Saving…</Button>
<Button disabled>Disabled</Button>

// Icons
<Button iconBefore={<IconArrow />}>With icon</Button>

// Polymorphic
<Button as="a" href="/dashboard">Link button</Button>
```

### TextField

```tsx
<TextField label="Username" placeholder="your_handle" />
<TextField label="Email" hint="Used for login only" />
<TextField label="Password" error="Minimum 8 characters" />
<TextField label="Search" prefix={<IconSearch />} />
<TextField size="sm" compact />  {/* no label, compact height */}
```

### Checkbox

```tsx
<Checkbox label="Remember me" />
<Checkbox label="All items" indeterminate />
<Checkbox label="Agree" error="Required to continue" />
<Checkbox label="Updates" description="Weekly digest, no spam." />
```

### Badge

```tsx
<Badge tone="success" variant="subtle">Active</Badge>
<Badge tone="error"   variant="solid">Failed</Badge>
<Badge tone="warning" variant="outlined">Review</Badge>
```

---

## Theming

All tokens are CSS custom properties prefixed with `--void-`. Override globally or scope to any subtree.

### Global override

```css
:root {
  --void-color-action-primary: #7c3aed;
  --void-radius-md: 12px;
}
```

### Planet themes (scoped)

Apply `data-void-planet` to any element to activate a full color theme for that subtree:

```tsx
<div data-void-planet="mars">
  <Button variant="primary">Mars</Button>
  <TextField label="Email" />
</div>
```

Available planets:

| Planet | Primary | Vibe |
|--------|---------|------|
| `mercury` | `#b0b0b0` | Monochrome, minimal |
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

### Planet prop (per-component)

```tsx
<Button variant="primary" planet="neptune">Neptune</Button>
```

Wraps the component in a `[data-void-planet]` scope without touching the DOM structure.

---

## MCP server (AI-native)

The repo ships `@open-void-ui/mcp-server` — an MCP server that exposes this library as context for Claude and Cursor.

When connected, the AI knows the exact props, variants, sizes, tokens and usage patterns for every component and generates correct code on the first try.

**Claude Code:**
```sh
claude mcp add void-ui node /path/to/void-ui/mcp-server/dist/index.js
```

**Cursor** — `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "void-ui": {
      "command": "node",
      "args": ["/path/to/void-ui/mcp-server/dist/index.js"]
    }
  }
}
```

---

## Requirements

- React `>=18.0.0`
- Node `>=20.0.0`

## License

MIT © [Germán Román](https://github.com/Vargland)
