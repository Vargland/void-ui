## Monorepo structure

```
void-ui/
├── packages/
│   ├── library/          ← main React components
│   ├── tokens/           ← design tokens (source of truth)
│   ├── icons/            ← iconography (SVG + font)
│   └── dates/            ← date components (separate package, optional)
├── mcp-server/           ← MCP server for Claude/Cursor integration
├── .storybook/           ← global Storybook config
├── package.json          ← workspace root
└── void-ui.code-workspace
```

### Why a monorepo

Each sub-package is published separately on npm:
- `@void-ui/library` — the components
- `@void-ui/tokens` — the tokens (usable without React)
- `@void-ui/icons` — the icons
- `@void-ui/dates` — date components (optional, heavy dependency)

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
│   ├── index.ts            ← MCP server entry point
│   ├── tools.ts            ← tools exposed to Claude/Cursor
│   ├── resources.ts        ← resources (components, tokens, docs)
│   ├── constants.ts        ← server constants
│   ├── types.ts            ← server types
│   └── utils.ts            ← utilities
├── scripts/
│   ├── generate-data.ts    ← generates the library snapshot for the MCP
│   └── sync-version.js     ← syncs versions across packages
└── README.md + SETUP_GUIDE.md
```

The MCP server exposes the full library as context for Claude and Cursor. When Claude "knows" void-ui, it generates code that uses the components correctly instead of making up its own.

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
Phase 1 — Foundation
  ✓ Repo on GitHub
  → Monorepo setup (npm workspaces)
  → packages/tokens (base.json + theme.json + build)
  → packages/library (empty structure + Storybook config + Vitest)

Phase 2 — First complete component
  → Button (with full structure: component, types, stories, test, docs)
  → Validate that the full pipeline works before adding more

Phase 3 — Figma sync
  → Connect Figma Variables with tokens/base.json via MCP

Phase 4 — MCP server
  → mcp-server with tools and resources
  → Validate with Claude Code and Cursor

Phase 5 — CI/CD
  → GitHub Actions: lint + test + build on every PR
  → AI code review on PRs
  → Automatic npm publish on merge to main

Phase 6 — Scale components
  → Plop templates to generate components
  → Add components one by one, with quality
```

---

## Design decisions that must NOT change

1. **One directory per component** — never group multiple components in one folder
2. **Separate typings** — types never live inside the `.tsx`
3. **Dedicated hooks for complex logic** — if the component has more than 50 lines of logic, it goes into a hook
4. **Storybook as the visual source of truth** — if it's not in Storybook, it doesn't exist
5. **Tests before publishing** — no component is published without tests
