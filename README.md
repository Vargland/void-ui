# open-void-ui

Minimal, spatial, dark React component library.
CSS custom properties · 12 planet themes · Figma plugin · MCP-native · Zero config.

**[Storybook →](https://void-ui-library-git-main-varglands-projects.vercel.app/?path=/docs/void-ui-introduction--docs)**  &nbsp;
**[npm →](https://www.npmjs.com/package/@open-void-ui/library)**  &nbsp;
**[GitHub →](https://github.com/Vargland/void-ui)**

---

## Install

```sh
npm install @open-void-ui/tokens @open-void-ui/library
```

## Quick start

```tsx
// 1. Import styles once in your root layout or _app
import '@open-void-ui/tokens/css'
import '@open-void-ui/library/styles'

// 2. Use components
import { Button, Badge, TextField, Checkbox } from '@open-void-ui/library'

export default function App() {
  return (
    <Button variant="primary">Get started</Button>
  )
}
```

---

## Components

| Component | Description |
|-----------|-------------|
| `Button` | 5 variants · 3 sizes · loading · icon slots · polymorphic `as` |
| `Badge` | solid · subtle · outlined × 4 tones |
| `Typography` | 9 sizes · 4 weights · polymorphic `as` |
| `Avatar` | image · initials · status badge · circle/square/rounded |
| `Divider` | horizontal/vertical · solid/dashed/dotted · label |
| `Stack` | flex layout utility — direction, gap, align, wrap |
| `Spinner` | ring variant · 5 sizes |
| `TextField` | label · hint · error · prefix/suffix · 4 states |
| `Checkbox` | controlled/uncontrolled · indeterminate · error · 3 sizes |

---

## Planet themes

Apply a theme to any subtree via `data-void-planet`:

```tsx
<div data-void-planet="mars">
  <Button variant="primary">Mars</Button>
  <Badge tone="success">Live</Badge>
</div>
```

Available: `mercury` · `moon` · `mars` · `earth` · `europa` · `neptune` · `jupiter` · `saturn` · `venus` · `io` · `uranus` · `nostromo`

Each planet overrides all `--void-color-*` tokens for that subtree. See the `🪐 Planets` card in the Figma plugin for the full palette.

---

## For designers

### Figma plugin

The repo ships a Figma plugin that renders all components on a canvas with exact token values — colors, spacing, radii, typography.

**Setup (one time):**
1. Clone or download this repo
2. Open Figma → **Plugins → Development → Import plugin from manifest...**
3. Select `figma-plugin/manifest.json`
4. Run the plugin → all 9 component cards + the planets palette appear on the canvas

Re-run the plugin any time to refresh the canvas with the latest components.

**What gets generated:**

| Card | Contents |
|------|----------|
| 🔘 Button | All variants, sizes, states |
| 🏷 Badge | All variants × tones |
| 👤 Avatar | Sizes, shapes, status |
| ✍️ Typography | Size scale, colors |
| ➖ Divider | Line variants, label, vertical |
| ⏳ Spinner | 5 sizes |
| 📝 TextField | 4 states, 3 sizes |
| 📦 Stack | Row and column layouts |
| ☑️ Checkbox | All states, sizes, with description |
| 🪐 Planets | Full palette for all 12 themes |

### MCP server (Claude / Cursor)

The repo ships an MCP server (`mcp-server/`) that exposes the full component library as context for AI assistants. When connected, Claude and Cursor know the exact props, variants, sizes, tokens and usage patterns for every component — and generate correct code on the first try.

**Setup for Claude Code:**

```sh
# Build the server first (once)
npm run mcp:build

# Register in Claude Code
claude mcp add void-ui node /absolute/path/to/void-ui/mcp-server/dist/index.js
```

**Setup for Cursor** — add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "void-ui": {
      "command": "node",
      "args": ["/absolute/path/to/void-ui/mcp-server/dist/index.js"]
    }
  }
}
```

**Available MCP tools:**

| Tool | What it does |
|------|--------------|
| `list-components` | Lists all components with a short description |
| `get-component` | Full props, variants, sizes and examples for a component |
| `get-tokens` | All 38 design tokens with their resolved values |
| `generate-usage` | Generates a ready-to-use code snippet for a component |

**Example workflow:**
> *"Generate a signup form using void-ui"*
> Claude reads the MCP tools, knows `TextField`, `Checkbox`, `Button` props exactly, and generates correct, typed code without hallucinating props.

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@open-void-ui/tokens` | `0.2.0` | Design tokens — CSS custom properties, SCSS, JS |
| `@open-void-ui/library` | `0.2.0` | React components |
| `@open-void-ui/mcp-server` | `0.1.0` | MCP server for Claude / Cursor |

---

## Development

```sh
git clone https://github.com/Vargland/void-ui
cd void-ui
npm install

npm run storybook        # Component development (Storybook)
npm run test             # Run all tests (Vitest)
npm run build:tokens     # Build design tokens
npm run build:library    # Build component library
npm run build:storybook  # Build Storybook static
npm run mcp:build        # Build MCP server
npm run mcp              # Run MCP server (stdio)
```

## License

MIT © [Germán Román](https://github.com/Vargland)
