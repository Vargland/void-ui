# void-ui — Development Log

Complete record of the project build process: technical decisions, step-by-step guide, and troubleshooting.

---

## Table of contents

1. [Phase 1 — Monorepo setup](#phase-1--monorepo-setup)
2. [Phase 2 — Button component](#phase-2--button-component)
3. [Phase 3 — Figma integration](#phase-3--figma-integration)
4. [Troubleshooting](#troubleshooting)

---

## Phase 1 — Monorepo setup

### What was done

The base monorepo was set up with npm workspaces and the `@void-ui/tokens` and `@void-ui/library` packages.

### Resulting structure

```
void-ui/
├── packages/
│   ├── tokens/          — @void-ui/tokens (design tokens)
│   └── library/         — @void-ui/library (React components)
├── package.json         — workspace root
├── tsconfig.base.json   — TypeScript base config
└── ARCHITECTURE.md      — architecture reference
```

### Tokens (`@void-ui/tokens`)

Tokens are split into two layers:

- **`tokens/base.json`** — primitive tokens (raw colors, spacing, typography, shadows, transitions, z-index)
- **`tokens/theme.json`** — semantic tokens that reference base (e.g. `{color.void.600}`)

The build uses **Style Dictionary** (`build.js`) and generates:

```
dist/
├── variables.css    — CSS custom properties (--void-*)
├── tokens.scss      — SCSS variables
├── tokens.js        — ES module
└── tokens.d.ts      — TypeScript declarations
```

All custom properties are prefixed with `--void-*`.

### Library skeleton

```
packages/library/src/
├── components/          — one directory per component
├── typings/components/  — types separated by convention
├── helpers/
│   ├── classnames/      — cn() utility
│   ├── constants/       — sizes, variants, version
│   └── styles/          — _mixins.scss, _functions.scss
├── static/styles/       — reset.css
└── index.ts             — main barrel export
```

---

## Phase 2 — Button component

### Created structure

```
src/components/button/
├── button.tsx           — main component
├── button.module.scss   — CSS Modules styles
├── button.stories.tsx   — Storybook stories
├── button.test.tsx      — 17 tests with Vitest + Testing Library
├── index.ts             — barrel export
├── styles/base.scss     — size map ($button-sizes)
└── docs/button.mdx      — manual MDX documentation

src/typings/components/buttons.ts  — ButtonProps, ButtonVariant, ButtonSize
```

### Component API

```tsx
<Button
  variant="primary"    // 'primary' | 'secondary' | 'ghost' | 'danger'
  size="md"            // 'sm' | 'md' | 'lg'
  fullWidth={false}    // boolean
  loading={false}      // boolean — shows spinner, blocks interaction
  disabled={false}     // boolean
  iconBefore={<Icon/>} // ReactNode — icon before label
  iconAfter={<Icon/>}  // ReactNode — icon after label (hidden during loading)
  as="button"          // ElementType — allows rendering as <a>, Link, etc.
  data-testid="button" // string
>
  Label
</Button>
```

### Polymorphism via `as`

The component accepts any `ElementType` via the `as` prop. When used as `<a>`, the `disabled` attribute (invalid on `<a>`) is not passed, but `aria-disabled` is still set.

```tsx
<Button as="a" href="/route" variant="primary">Link</Button>
```

### Accessibility

- `aria-disabled="true"` whenever disabled or loading
- `aria-busy="true"` during loading
- Native `disabled` only when `Tag === 'button'`
- `:focus-visible` with outline via `focus-ring` mixin
- Spinner with `aria-hidden="true"`

### Sizes (defined in `styles/base.scss`)

| Size | Height | Padding X | Font size | Icon size |
|------|--------|-----------|-----------|-----------|
| sm   | 28px   | 12px      | 13px      | 14px      |
| md   | 36px   | 16px      | 14px      | 16px      |
| lg   | 44px   | 24px      | 16px      | 18px      |

### SCSS — Dart Sass 3 module system

The project uses the modern Sass module system (`@use` instead of `@import`):

```scss
// button.module.scss
@use 'sass:map';
@use '../../helpers/styles/mixins' as *;
@use './styles/base' as *;

// _mixins.scss
@use 'sass:list';
@use 'sass:map';
// list.append() instead of global append()
// map.get() instead of global map-get()
```

---

## Phase 3 — Figma integration

This phase lives in the `feat/figma-integration` branch.

### Components

1. **Sync scripts** (`figma-sync/`) — bidirectional via Figma REST API
2. **Figma Plugin** (`figma-plugin/`) — draws the Button showcase on the canvas

---

### 3a. Sync scripts (figma-sync/)

#### Setup

A `.env` file was created at the repo root:

```
FIGMA_TOKEN=your_personal_access_token
FIGMA_FILE_KEY=figma_file_key
```

The token is obtained from Figma → Settings → Personal access tokens.
The file key is extracted from the URL: `figma.com/design/FILE_KEY/...`

**Documented in `.env.example`** (committed). The actual `.env` is in `.gitignore`.

#### `push-to-figma.js` — code → Figma

Reads `base.json` and `theme.json` and creates/updates **Figma Variables** via REST API.

Flow:
1. Flattens tokens to `/`-separated paths (e.g. `color/void/500`)
2. Queries existing collections and variables in Figma
3. Creates `Primitives` (base) and `Semantic` (theme) collections if they don't exist
4. Creates new variables and updates existing values
5. Resolves `{color.void.600}` references from theme.json to concrete values

```bash
npm run figma:push
```

> ⚠️ The Figma Variables API **requires a Pro plan or higher**. On a free plan it returns 403.

#### `pull-from-figma.js` — Figma → code

Reads Variables from Figma and writes back to `base.json` and `theme.json`.

Flow:
1. Fetches collections and variables from the API
2. Separates `Primitives` → `base.json` and `Semantic` → `theme.json`
3. Converts Figma types (COLOR, FLOAT, STRING) to Style Dictionary types
4. Resolves `VARIABLE_ALIAS` back to `{dot.notation}` references
5. Writes the files

```bash
npm run figma:pull
```

#### `figma:sync` — push + rebuild

```bash
npm run figma:sync
# Equivalent to: npm run figma:push && npm run build:tokens
```

---

### 3b. Figma Plugin (`figma-plugin/`)

The plugin **does not require a Pro plan** — it operates directly on the local canvas.

#### Files

```
figma-plugin/
├── manifest.json   — plugin metadata (id, name, main, ui)
├── code.js         — main logic (runs in Figma's sandbox)
└── ui.html         — minimal UI panel
```

#### How to install

1. Open Figma Desktop
2. `Plugins → Development → Import plugin from manifest…`
3. Select `figma-plugin/manifest.json`
4. The plugin is now available under `Plugins → Development → void-ui Button`

#### What it draws

Generates a `🔘 Button` frame on the canvas with all variants:

- **VARIANTS** — Primary, Secondary, Ghost, Danger
- **SIZES** — Small, Medium, Large
- **STATES** — Default, Disabled, Loading
- **ALL VARIANTS × SIZES** — full matrix (4 variants × 3 sizes + disabled + loading)

#### Fonts used

| Constant       | Family | Style     |
|----------------|--------|-----------|
| FONT_BOLD      | Inter  | Bold      |
| FONT_SEMIBOLD  | Inter  | Semi Bold |
| FONT_MEDIUM    | Inter  | Medium    |
| FONT_REGULAR   | Inter  | Regular   |

> ⚠️ Fonts must be installed on the system or available in Figma. Inter is included by default in Figma.

---

## Troubleshooting

### Storybook

---

#### ❌ autodocs + MDX conflict

**Symptom:** Storybook shows a duplicate documentation error or fails to load the MDX.

**Cause:** `tags: ['autodocs']` in the stories generates an automatic docs page. If a manual `.mdx` also exists, there is a conflict.

**Fix:**
1. In `button.stories.tsx`: change `tags: ['autodocs']` → `tags: []`
2. In `.storybook/main.ts`: restrict the MDX glob to `../src/**/docs/*.mdx`

```ts
// main.ts
stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/docs/*.mdx'],
```

---

#### ❌ Sass: deprecated global `map-get()`

**Symptom:** Warnings in the Storybook console:
```
Deprecation Warning: Global built-in functions are deprecated.
Use map.get instead.
```

**Cause:** Dart Sass 3 deprecated global functions. `map-get()`, `map-has-key()`, and `append()` are no longer supported as globals.

**Fix in `button.module.scss`:**
```scss
// Before
@use 'sass:map';
$val: map-get($map, 'key');  // ❌

// After
$val: map.get($map, 'key');  // ✅
```

**Fix in `_mixins.scss`:**
```scss
// Before
@mixin transition($props...) {
  $result: ();
  @each $prop in $props {
    $result: append($result, $prop var(--void-transition-normal), comma);  // ❌
  }
}

// After
@use 'sass:list';
@use 'sass:map';
@mixin transition($props...) {
  $result: ();
  @each $prop in $props {
    $result: list.append($result, $prop var(--void-transition-normal), comma);  // ✅
  }
}
```

---

#### ❌ Button renders without colors in Storybook

**Symptom:** The Button renders with no colors — transparent background, no color tokens applied.

**Cause:** The CSS tokens (`--void-*`) were not being imported in the Storybook preview.

**Fix in `.storybook/preview.ts`:**
```ts
import '../src/static/styles/reset.css'
import '@void-ui/tokens/css'  // ← add this line
```

---

### Figma Plugin

---

#### ❌ Only the title is visible — buttons don't appear

**Symptom:** The plugin runs without a visible error, but the canvas only shows the frame with "Button" and "@void-ui/library". No sections (VARIANTS, SIZES, etc.) are rendered.

**Root cause:** The Figma Plugin API requires text nodes to be **part of the document** (appended to a parent) **before** assigning `fontName` or `characters`. The previous code was creating nodes, setting all properties, and *then* appending them. This caused `characters` assignment to fail silently.

The same issue affected button frames: `resize()` was called before `appendChild()`.

**Fix:** Add a `makeText()` helper that:
1. Creates the node
2. Appends it to the parent (`appendChild`) **immediately**
3. Sets `fontName`, `fontSize`, `fills`
4. Sets `characters` last

```js
function makeText(parent, { fontName, fontSize, fills, characters, ... }) {
  const node = figma.createText()
  parent.appendChild(node)      // ← in the document first
  node.fontName   = fontName
  node.fontSize   = fontSize
  node.fills      = fills
  node.characters = characters  // ← last
  return node
}
```

---

#### ❌ `The font "Inter SemiBold" could not be loaded`

**Symptom:** Error in the Figma plugin console (visible at `Plugins → Development → Show/Hide console`).

**Cause:** The font style name was `'SemiBold'` (no space). The correct name registered in Figma is `'Semi Bold'` (with a space).

**Fix:**
```js
// Before
const FONT_SEMIBOLD = { family: 'Inter', style: 'SemiBold' }  // ❌

// After
const FONT_SEMIBOLD = { family: 'Inter', style: 'Semi Bold' } // ✅
```

> 💡 To verify the exact font style name in Figma: create a text node manually, select Inter, and check the exact name shown in the typography panel.

---

#### ❌ "Plugin missing" — Figma lost the reference

**Symptom:** When trying to run the plugin from `Plugins → Development`, it doesn't appear or says it cannot be found.

**Cause:** Figma loses the reference to a local plugin if the directory is moved or the app is restarted.

**Fix:** Re-import the manifest:
1. `Plugins → Development → Import plugin from manifest…`
2. Navigate to `figma-plugin/manifest.json`
3. Confirm

---

#### ⚠️ Variables API requires Pro plan

**Symptom:** `npm run figma:push` returns a 403 error.

**Cause:** The Figma Variables REST API is only available on a **Pro plan or higher**. It is not accessible on the free plan.

**Alternative:** Use the local plugin (`figma-plugin/code.js`) which operates directly on the canvas without requiring API access.

---

### Git / Branches

---

#### Branch policy

| Branch                  | Purpose |
|-------------------------|---------|
| `main`                  | stable code — do not touch without explicit permission |
| `feat/figma-integration`| Figma integration (scripts + plugin) |
| `fix/*`                 | specific fixes, merged into their base branch |

**Rules:**
- Do not push to `main` or merge between branches without explicit confirmation from the lead.
- **Rebase** is the standard strategy for keeping branches up to date with their base.
- **Squash merge** is the standard strategy when merging a branch into another — one clean commit per feature/fix.
