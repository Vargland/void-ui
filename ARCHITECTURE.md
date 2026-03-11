## Monorepo structure

```
void-ui/
├── packages/
│   ├── library/          ← @open-void-ui/library — React components
│   ├── tokens/           ← @open-void-ui/tokens — design tokens (source of truth)
│   ├── icons/            ← @open-void-ui/icons — iconography (pending)
│   └── dates/            ← @open-void-ui/dates — date components (pending)
├── mcp-server/           ← @open-void-ui/mcp-server — MCP server for Claude/Cursor
├── figma-plugin/         ← Figma plugin — renders all components on canvas
├── apps/
│   └── docs/             ← @open-void-ui/docs — Next.js 14 docs site
├── .github/
│   └── workflows/
│       ├── ci.yml        ← lint + test + build on every PR
│       ├── publish.yml   ← auto npm publish on version bump to main
│       └── code-review.yml ← Claude AI review on every PR
├── .storybook/           ← global Storybook config
├── package.json          ← workspace root
└── void-ui.code-workspace
```

### Why a monorepo

Each sub-package is published separately on npm:
- `@open-void-ui/library` — the components (requires React 18+)
- `@open-void-ui/tokens` — the tokens (framework-agnostic, plain CSS)
- `@open-void-ui/mcp-server` — AI context server (Claude / Cursor)
- `@open-void-ui/icons` — icons (pending)
- `@open-void-ui/dates` — date components (pending, heavy dependency)

This allows a consumer to install only what they need.

---

## packages/library — Component structure

Each component lives in its own folder and follows this convention **without exception**:

```
src/components/button/
├── button.tsx              ← component implementation
├── button.module.scss      ← styles with CSS Modules
├── button.stories.tsx      ← Storybook stories
├── button.test.tsx         ← tests with Vitest + Testing Library
├── index.ts                ← barrel export
├── styles/
│   └── base.scss           ← base styles imported by the module
└── docs/
    └── button.mdx          ← documentation in Storybook
```

And the typings **always separated**:

```
src/typings/components/
└── buttons.ts              ← component interfaces and types
```

### Why separate typings

- Allows importing only the types without importing the component (useful for forms, validations)
- Forces you to think about the component API before implementing
- Easier to review in PRs — API changes are visible on their own

---

## packages/library — Full internal structure

```
src/
├── components/             ← one directory per component
├── typings/
│   ├── components/         ← types for each component
│   ├── hooks/              ← types for each hook
│   ├── contexts/           ← types for each context
│   ├── helpers/            ← shared types (colors, shadows, etc.)
│   └── docs/               ← types for the documentation system
├── hooks/                  ← reusable hooks (use-toast, use-popper, etc.)
├── contexts/               ← React contexts (toast, tile, etc.)
├── helpers/
│   ├── classnames/         ← utilities for generating classNames
│   ├── constants/          ← shared constants
│   ├── functions/          ← reusable pure functions
│   ├── hooks/              ← internal helper hooks (not exposed)
│   └── styles/             ← SCSS helpers (_mixins, _functions, _constants)
├── static/
│   ├── assets/             ← SVGs, logos
│   └── styles/             ← global reset.css
├── templates/              ← stories for complete patterns (form, data-grid, navigation)
├── docs/                   ← general documentation pages (changelog, welcome)
└── index.ts                ← main barrel export for the library
```

---

## packages/tokens — Design tokens

```
tokens/
├── tokens/
│   ├── base.json           ← colors, spacing, typography (primitives)
│   └── theme.json          ← semantic tokens (color.primary, color.error, etc.)
├── build.js                ← script that generates CSS variables, JS, SCSS from the JSON files
├── config.js               ← build configuration (Style Dictionary)
└── package.json
```

### Token flow

```
Figma Variables
      ↓
tokens/base.json + theme.json   ← source of truth
      ↓
build.js (Style Dictionary)
      ↓
dist/
  ├── variables.css             ← CSS custom properties
  ├── tokens.js                 ← JS object for use in React
  └── tokens.scss               ← SCSS variables
```

When Figma MCP is integrated, the sync directly updates the `.json` files.

---

## packages/icons

```
icons/
├── src/
│   ├── assets/             ← original SVGs
│   └── icons/
│       ├── fonts/          ← generated font (woff, ttf, svg)
│       ├── icons.css       ← CSS classes for using the icons
│       └── selection.json  ← font definition (IcoMoon format)
├── build.js                ← generates the icon font from SVGs
└── generate-enum.js        ← generates a TypeScript enum with all icons
```

---

## mcp-server — AI integration

```
mcp-server/
├── src/
│   ├── index.ts            ← MCP server entry point (stdio transport)
│   ├── tools.ts            ← 4 tools: list-components, get-component, get-tokens, generate-usage
│   ├── resources.ts        ← resources: void-ui://components/{name}, void-ui://tokens
│   ├── data.ts             ← full props + token values for all components
│   ├── constants.ts        ← component name tuple type
│   └── types.ts            ← ComponentMeta, TokenMeta, LibrarySnapshot
├── dist/                   ← compiled output (after npm run mcp:build)
└── README.md
```

The MCP server exposes the full library as context for Claude and Cursor. When Claude "knows" void-ui, it generates code that uses the components correctly instead of making up its own.

**Setup — Claude Code:**
```sh
claude mcp add void-ui node /path/to/void-ui/mcp-server/dist/index.js
```

**Setup — Cursor** (`.cursor/mcp.json`):
```json
{ "mcpServers": { "void-ui": { "command": "node", "args": ["/path/to/mcp-server/dist/index.js"] } } }
```

---

## figma-plugin — Canvas renderer

```
figma-plugin/
├── code.js       ← single-file plugin (Figma sandbox, no DOM/CSS/React)
├── manifest.json ← plugin entry point (never changes)
└── README.md
```

Renders all components on the Figma canvas with exact token values.
Re-run the plugin any time to regenerate all cards (old ones are removed first).

**Current cards:** Button · Badge · Avatar · Typography · Divider · Spinner · TextField · Stack · Checkbox · Planets palette

**Adding a new component:**
1. Add `drawMyComponent()` in `code.js` following the existing pattern
2. Register it in the `drawFns` array inside `run()`
3. No manifest changes needed — `manifest.json` always points to `code.js`

---

## .github/workflows — CI/CD

```
.github/workflows/
├── ci.yml           ← runs on every PR: install → build tokens → test → build library → build mcp
├── publish.yml      ← runs on main: publishes to npm only if version in package.json changed
└── code-review.yml  ← runs on every non-draft PR: Claude reviews diff and posts comment
```

### Secrets required (GitHub repo → Settings → Secrets → Actions)

| Secret | Used by | How to get |
|--------|---------|------------|
| `NPM_TOKEN` | `publish.yml` | npmjs.com → Access Tokens → Automation token |
| `ANTHROPIC_API_KEY` | `code-review.yml` | console.anthropic.com → API Keys |

### Publish flow

The publish workflow compares the version in `package.json` vs what's live on npm.
To release a new version:
1. Bump version in `packages/tokens/package.json` and/or `packages/library/package.json`
2. Commit and merge to main
3. The workflow publishes automatically — no manual `npm publish` needed

---

## Code conventions

### File naming
| Type | Convention | Example |
|------|-----------|---------|
| Component | kebab-case | `button.tsx` |
| Stories | kebab-case + `.stories` | `button.stories.tsx` |
| Tests | kebab-case + `.test` | `button.test.tsx` |
| Types | kebab-case + plural | `buttons.ts` |
| Hooks | `use-` prefix | `use-toast.ts` |
| SCSS helpers | `_` prefix | `_mixins.scss` |

### Barrel exports
Each component has its own `index.ts` that re-exports:
```ts
// components/button/index.ts
export { Button } from './button'
export type { ButtonProps } from '../../typings/components/buttons'
```

And the main `src/index.ts` re-exports everything:
```ts
export { Button } from './components/button'
export type { ButtonProps } from './typings/components/buttons'
// ...
```

### Separation of logic and presentation
Complex components separate their logic into a dedicated hook:
```
combobox/combobox.tsx         ← JSX only
hooks/use-combobox.ts         ← all the logic
typings/hooks/use-combobox.ts ← hook types
```

---

## Storybook

Each component has two types of documentation:

**Stories** (`button.stories.tsx`) — interactive use cases
**MDX** (`docs/button.mdx`) — narrative documentation using the shared template

The docs template lives in `src/docs/template/` and standardizes how each component is documented — same structure, same format.

---

## Testing

- **Framework**: Vitest + Testing Library
- **Setup**: `test-config/setup-tests.js`
- **Snapshots**: `__snapshots__/` folder inside each component
- **Convention**: one `.test.tsx` file per component + one `.test.ts` file per hook

---

## Plop — component generator

void-ui has a `plopfile.mjs` with templates to generate a complete component:

```
plop-templates/new-component/
├── component.hbs       ← component.tsx
├── component.index.hbs ← index.ts
├── component.story.hbs ← stories.tsx
├── component.types.hbs ← typings
├── sass.base.hbs       ← styles/base.scss
└── sass.module.hbs     ← component.module.scss
```

Command: `npm run generate` → prompts for the name → generates the full structure.
**This is key to maintaining consistency at scale.**

---

## Implementation roadmap for void-ui

```
Phase 1 — Foundation                                          ✅ DONE
  ✓ Repo on GitHub
  ✓ Monorepo setup (npm workspaces)
  ✓ packages/tokens (base.json + theme.json + build.js + 12 planet themes)
  ✓ packages/library (structure + Storybook 8 + Vitest + CSS Modules)
  ✓ Published @open-void-ui/tokens@0.2.0 + @open-void-ui/library@0.2.0

Phase 2 — Components                                          ✅ DONE
  ✓ Button   — 5 variants · 3 sizes · loading · icons · polymorphic
  ✓ Badge    — solid/subtle/outlined × 5 tones
  ✓ Avatar   — sizes · shapes · status badge
  ✓ Typography — 9 sizes · 4 weights · polymorphic
  ✓ Divider  — horizontal/vertical · variants · label
  ✓ Stack    — flex layout utility
  ✓ Spinner  — ring variant · 5 sizes
  ✓ TextField — label · hint · error · prefix/suffix · states
  ✓ Checkbox — controlled/uncontrolled · indeterminate · error · 3 sizes
  ✓ Storybook deployed on Vercel
  ✓ apps/docs — Next.js 14 docs website

Phase 3 — Figma                                               ✅ DONE
  ✓ Figma plugin — renders all 9 components + Planets palette on canvas
  ✓ Figma MCP (official) connected — reads Figma nodes for design→code flow

Phase 4 — MCP server                                          ✅ DONE
  ✓ mcp-server/ with 4 tools: list-components, get-component,
    get-tokens, generate-usage
  ✓ Resources: void-ui://components/{name}, void-ui://tokens
  ✓ Validated with Claude Code (stdio transport)
  ✓ .claude/mcp.json configured

Phase 5 — CI/CD                                               ✅ DONE
  ✓ ci.yml      — test + build on every PR
  ✓ publish.yml — auto npm publish on version bump merged to main
  ✓ code-review.yml — Claude AI reviews every non-draft PR
  ✓ NPM_TOKEN + ANTHROPIC_API_KEY secrets configured in GitHub repo
  ✓ Published @open-void-ui/tokens@0.3.0 + @open-void-ui/library@0.3.0

Phase 6 — Scale components                                    🔄 IN PROGRESS
  ✓ Select — dropdown, searchable, clearable, keyboard nav
  ✓ Modal / Dialog — focus trap, Escape key, portal, aria
  ✓ Toast / Notification — variants, auto-dismiss, positions, useToast hook
  ✓ Tooltip — placement, delay, aria-describedby
  ✓ Tabs — keyboard nav, accessible, variants
  ✓ Table — sortable, striped, bordered, caption
  ⬜ DatePicker (packages/dates)
  ⬜ Icons (packages/icons)
```

---

## Design decisions that must NOT change

1. **One directory per component** — never group multiple components in one folder
2. **Separate typings** — types never live inside the `.tsx`
3. **Dedicated hooks for complex logic** — if the component has more than 50 lines of logic, it goes into a hook
4. **Storybook as the visual source of truth** — if it's not in Storybook, it doesn't exist
5. **Tests before publishing** — no component is published without tests
